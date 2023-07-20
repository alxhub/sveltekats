import { error, redirect } from '@sveltejs/kit';
import { type Discussion, getDiscussionList, getTokenForOauthCode } from '../../../lib/server/github';

import type { PageServerLoad } from './$types';

export interface Data {
}

export const load: PageServerLoad<Data> = async ({cookies, url}) => {
  const code = url.searchParams.get('code');
  if (code === null) {
    throw error(500, 'No oauth code');
  }

  const token = await getTokenForOauthCode(code);
  cookies.set('oauth', token, {path: '/'});
  throw redirect(307, '/');
}
