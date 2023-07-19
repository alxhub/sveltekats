import { error } from '@sveltejs/kit';

import {
	type RepositoryDetails,
  getRepoDetails,
} from '../../lib/server/github';

import type { PageServerLoad } from './$types';

export interface Data {
  details: RepositoryDetails;
}

export const load: PageServerLoad<Data> = async () => {
  const details = await getRepoDetails();
	return { details };
};
