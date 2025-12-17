import { getDepartmentsByOrganizationId } from "$lib/server/db/queries/department";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const orgId = event.locals.session?.selectedOrganizationId;
	if (!orgId) {
		return error(400, "No organization selected.");
	}

	return { departments: getDepartmentsByOrganizationId(orgId) };
}) satisfies PageServerLoad;
