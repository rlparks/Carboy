import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("superadmin");
}) satisfies PageServerLoad;
