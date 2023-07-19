import type { PageServerLoad, Actions } from '../$types';
import {redirect} from '@sveltejs/kit';

export interface Data{}

function logout(cookies) {
  console.log('logging out');
  cookies.delete('oauth');
}

export const load: PageServerLoad<Data> = async ({cookies}) => {
  const isLoggedIn = (cookies.get('oauth') ?? '') !== '';
  if (isLoggedIn) {
    logout(cookies);
    // TODO(zarend): use a store to manage the global state for authentication
    throw redirect(307, '/logout');
  }
	return {};
};

export const actions: Actions<any> = {
  default: async ({cookies}) => {
    logout(cookies);
  }
}