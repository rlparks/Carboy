import { getOrganizations } from "$lib/server/db/queries/organization";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("superadmin");

	const organizations = await getOrganizations();

	return {
		organizations,
	};
}) satisfies PageServerLoad;
