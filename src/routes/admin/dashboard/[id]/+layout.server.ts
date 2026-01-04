import { getDashboardKeyById } from "$lib/server/db/queries/dashboardKey";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const { id } = event.params;
	const dashboardKey = await getDashboardKeyById(id);

	if (!dashboardKey) {
		return error(404, "Dashboard key not found");
	}

	// ensure admin can only access dashboard keys within their organization unless they are superadmin
	if (
		!event.locals.security.hasRole("superadmin") &&
		dashboardKey.organizationId !== event.locals.session?.selectedOrganizationId
	) {
		return error(403, "Forbidden");
	}

	return { dashboardKey };
}) satisfies LayoutServerLoad;
