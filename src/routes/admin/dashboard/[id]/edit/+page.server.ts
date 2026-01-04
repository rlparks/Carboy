import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const { dashboardKey } = await event.parent();

	if (
		!event.locals.security.hasRole("superadmin") &&
		dashboardKey.organizationId !== event.locals.session?.selectedOrganizationId
	) {
		return error(403, "Forbidden");
	}
}) satisfies PageServerLoad;
