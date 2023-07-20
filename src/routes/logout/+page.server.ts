import type { PageServerLoad, Actions } from '../$types';

export interface Data{ isLoggedIn: boolean}

function logout(cookies) {
  console.log('logging out');
  cookies.delete('oauth');
}

export const load: PageServerLoad = async ({cookies}) => {
  // TODO: use a store for managing global state of if user is logged in. That way UI will update
  // when user logs out.
  const isLoggedIn = (cookies.get('oauth') ?? '') !== '';

	return { isLoggedIn };
};

export const actions: Actions<any> = {
  default: async ({cookies}) => {
    logout(cookies);
  }
}
