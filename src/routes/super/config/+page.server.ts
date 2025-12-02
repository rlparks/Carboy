import { getOidcConfig } from "$lib/server/config/oidc";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("superadmin");

	const config = await getOidcConfig();

	return { config };
}) satisfies PageServerLoad;
