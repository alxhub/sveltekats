import { redirect } from '@sveltejs/kit';
import { type Discussion, getDiscussionList } from '../../../lib/server/github';

import type { PageServerLoad } from './$types';

export interface Data {
}

export const load: PageServerLoad<Data> = async ({cookies, url}) => {
  cookies.set('oauth', url.searchParams.get('code') ?? '', {path: '/'});
  throw redirect(307, '/');
};
