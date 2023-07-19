import { getAuthUrl,  } from '../lib/server/github';

import type { PageServerLoad } from './$types';

export interface Data {
  isLoggedIn: boolean;
	loginUrl: string;
}

export const load: PageServerLoad<Data> = async ({cookies}) => {
	return {
    isLoggedIn: (cookies.get('oauth') ?? '') !== '',
    loginUrl: getAuthUrl(),
  };
};
