import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from '../$types';

export interface Data{ isLoggedIn: boolean}

function logout(cookies) {
  console.log('logging out');
  cookies.delete('oauth');
}

// only render the logout page if the user is logged out
export const load: PageServerLoad = async ({cookies, fetch}) => {
  const isLoggedIn = (cookies.get('oauth') ?? '') !== '';
  if (isLoggedIn) {
    await fetch("/logout", {method: "POST"});
    throw redirect(307, '/logout');
  }

	return { isLoggedIn };
};

export const actions: Actions<any> = {
  default: async ({cookies}) => {
    logout(cookies);
  }
}
