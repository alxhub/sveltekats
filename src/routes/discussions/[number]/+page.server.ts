import { error } from '@sveltejs/kit';

import {
	type DiscussionComment,
	type DiscussionDetails,
	getDiscussionComments,
	getDiscussionDetails,
	validateToken,
	addDiscussionComment,
	getDiscussionId
} from '../../../lib/server/github';

import type { PageServerLoad } from './$types';

export interface Data {
	discussion: DiscussionDetails;
	comments: DiscussionComment[];
}

export const load: PageServerLoad<Data> = async ({ params }) => {
	const number = Number(params.number);
	if (isNaN(number)) {
		throw error(404, 'invalid discussion number');
	}

	const discussion = await getDiscussionDetails(number);
	const comments = await getDiscussionComments(number);
	return { discussion, comments };
};

export const actions = {
	comment: async ({cookies, params: {number}, request}) => {
		const token = cookies.get('oauth');
		if (token == null) {
			throw error(403, 'Not logged in');
		}
		if (!await validateToken(token)) {
			throw error(403, 'Invalid token');
		}
		 try {
			const id = await getDiscussionId(Number.parseInt(number));
			const body = await request.formData();
			await addDiscussionComment(token, id, body.get('contents')!.toString());
			return 
		 } catch (e) {
			throw error(400, 'Github request failed: ' + (e as Error).message);
		 }
	},
};
