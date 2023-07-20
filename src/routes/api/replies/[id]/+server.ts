import { getDiscussionCommentReplies } from "$lib/server/github";
import { json } from "@sveltejs/kit";

export async function GET({ params: {id} }) {
  const replies = await getDiscussionCommentReplies(id);
  return json(replies);
}
