import { getDistanceConfig } from "$lib/server/config/distance";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("superadmin");

	const config = await getDistanceConfig();

	return { config };
}) satisfies PageServerLoad;
