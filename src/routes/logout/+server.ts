import type { RequestHandler} from '@sveltejs/kit';

export interface Data{}

// TODO: consolidate duplicated code. This function is copied from +page.server.ts.
function logout(cookies) {
  console.log('logging out');
  cookies.delete('oauth');
}

export const POST: RequestHandler<{}>  = ({cookies}) => {
  logout(cookies);

  return new Response();
}