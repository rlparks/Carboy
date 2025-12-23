import { getDashboardKeyById } from "$lib/server/db/queries/dashboardKey";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const { id } = event.params;
	const dashboardKey = await getDashboardKeyById(id);
	if (!dashboardKey) {
		return error(404, "Dashboard key not found");
	}

	return { dashboardKey };
}) satisfies PageServerLoad;
