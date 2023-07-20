import { env } from '$env/dynamic/private';
import { App, Octokit } from 'octokit';

import GITHUB_KEY from '../../../.env.private-key.pem?raw';
import type { REACTIONS } from '../reactions';
import type { DiscussionCommentReply } from '$lib/types';

function requireEnv(key: string): string {
	const value = env[key];
	if (value == null) {
		throw new Error(`Missing ${key} env var. Did you create a .env file?`);
	}

	return value;
}

const GITHUB_APP_ID = requireEnv('GITHUB_APP_ID');
const GITHUB_CLIENT_ID = requireEnv('GITHUB_CLIENT_ID');
const GITHUB_CLIENT_SECRET = requireEnv('GITHUB_CLIENT_SECRET');
const GITHUB_INSTALLATION_ID = Number(requireEnv('GITHUB_INSTALLATION_ID'));
const GITHUB_REPO_NAME = requireEnv('GITHUB_REPO_NAME');
const GITHUB_REPO_OWNER = requireEnv('GITHUB_REPO_OWNER');

interface QueryVariables {
	[name: string]: unknown;
}

export function getAuthUrl(): string {
	const app = new App({
		appId: GITHUB_APP_ID,
		privateKey: GITHUB_KEY,
		oauth: { clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET }
	});
	const res = app.oauth.getWebFlowAuthorizationUrl({});
	// app.oauth.createToken({code: '123'});
	return res.url;
}

export async function getTokenForOauthCode(code: string): Promise<string> {
	const app = new App({
		appId: GITHUB_APP_ID,
		privateKey: GITHUB_KEY,
		oauth: { clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET }
	});
	const auth = await app.oauth.createToken({
		code});
	return auth.authentication.token;
}

export async function validateToken(token: string): Promise<boolean> {
	const app = new App({
		appId: GITHUB_APP_ID,
		privateKey: GITHUB_KEY,
		oauth: { clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET }
	});
	try {
		await app.oauth.checkToken({token});
		return true;
	} catch {
		return false;
	}
}

async function queryGraphQl(query: string, variables?: QueryVariables): Promise<unknown> {
	const app = new App({
		appId: GITHUB_APP_ID,
		privateKey: GITHUB_KEY,	
		oauth: { clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET }
	});
	const octokit = await app.getInstallationOctokit(GITHUB_INSTALLATION_ID);
	return await octokit.graphql(
		query,
		variables,
	);
}

export interface Discussion {
	number: number;
	title: string;
	author: string;
	createdAt: string;
}

export interface ReactionGroup {
	content: (typeof REACTIONS)[number];
	totalCount: number;
}

export interface DiscussionDetails extends Discussion {
	reactionGroups: ReactionGroup[];
	bodyHTML: string;
}

const REPO_VARS = {
	repoOwner: GITHUB_REPO_OWNER,
	repoName: GITHUB_REPO_NAME
};

export async function getDiscussionList(): Promise<Discussion[]> {
	const body = await queryGraphQl(`
		query discussionList($repoOwner: String!, $repoName: String!) {
			repository(owner: $repoOwner, name: $repoName) {
				discussions(last: 10) {
					edges {
						node {
							number
							title
							author {
								login
							}
							createdAt
						}
					}
				}
			}
		}
	`, REPO_VARS);
	const discussions = (body as any).repository.discussions.edges;
	return discussions.map((discussion: any) => ({
		number: discussion.node.number,
		title: discussion.node.title,
		author: discussion.node.author.login,
		createdAt: discussion.node.createdAt
	}));
}

export async function getDiscussionDetails(number: number): Promise<DiscussionDetails> {
	const body = await queryGraphQl(
		`
    query discussionDetails($repoOwner: String!, $repoName: String!, $number: Int!) {
      repository(owner: $repoOwner, name: $repoName) {
        discussion(number: $number) {
          number
          title
          author {
            login
          }
          createdAt
          reactionGroups {
            content
            reactors {
              totalCount
            }
          }
          bodyHTML
        }
      }
		}
	`,
		{ number, ...REPO_VARS }
	);
	const discussion = (body as any).repository.discussion;
	return {
		number: discussion.number,
		title: discussion.title,
		author: discussion.author.login,
		createdAt: discussion.createdAt,
		reactionGroups: discussion.reactionGroups.map((group: any) => ({
			content: group.content,
			totalCount: group.reactors.totalCount
		})),
		bodyHTML: discussion.bodyHTML
	};
}

export interface DiscussionComment {
	id: string;
	author: string;
	createdAt: string;
	bodyHTML: string;
}

export async function getDiscussionComments(number: number): Promise<DiscussionComment[]> {
	const body = await queryGraphQl(
		`
		query discussionComments($repoOwner: String!, $repoName: String!, $number: Int!) {
			repository(owner: $repoOwner, name: $repoName) {
				discussion(number: $number) {
					comments(last: 10) {
						edges {
							node {
								id
								author {
									login
								}
								createdAt
								bodyHTML
							}
						}
					}
				}
			}
		}
	`,
		{ number, ...REPO_VARS }
	);
	const comments = (body as any).repository.discussion.comments.edges;
	return comments.map((comment: any) => ({
		id: comment.node.id,
		author: comment.node.author.login,
		createdAt: comment.node.createdAt,
		bodyHTML: comment.node.bodyHTML
	}));
}

export async function getDiscussionCommentReplies(id: string): Promise<DiscussionCommentReply[]> {
	const body = await queryGraphQl(
		`
		query discussionCommentReplies($id: ID!) {
			node(id: $id) {
				... on DiscussionComment {
					replies(first: 10) {
						edges {
							node {
								author {
									login
								}
								createdAt
								bodyHTML
							}
						}
					}
				}
			}
		}
	`,
		{ id, ...REPO_VARS }
	);
	return (body as any).node.replies.edges.map((edge: any) => {
		return {
			author: edge.node.author.login,
			bodyHTML: edge.node.bodyHTML,
			createdAt: edge.node.createdAt,
		};
	});
}

export interface RepositoryDetails {
	description: string|null;
	name: string;
}

export async function getRepoDetails(): Promise<RepositoryDetails> {
	const body = await queryGraphQl(`
		query repoDetails($repoOwner: String!, $repoName: String!) {
			repository(owner: $repoOwner, name: $repoName) {
				name
				description
			}
		}
	`, REPO_VARS);
	const data = (body as any).repository;
	return {
		name: data.name,
		description: data.description,
	};
}

export async function authedQueryGraphQl(token: string, query: string, variables?: QueryVariables): Promise<unknown> {
	const octo = new Octokit({
		auth: token,
	})
	return octo.graphql(query, variables);
}

export async function getDiscussionId(number: number): Promise<string> {
	const body: any = await queryGraphQl(`
	query discussionId($repoOwner: String!, $repoName: String!, $number: Int!) {
		repository(owner: $repoOwner, name: $repoName) {
			discussion(number: $number) {
				id
			}
		}
	}
	`, {...REPO_VARS, number});
	return body.repository.discussion.id;
}


export async function addDiscussionComment(token: string, id: string, comment: string): Promise<void> {
	await authedQueryGraphQl(token, `
		mutation AddComment($id: ID!, $body: String!){
			addDiscussionComment(input: {body: $body, discussionId: $id}) {
				__typename
			}
		}
	`, {id, body: comment});
}