import {
	getDepartmentById,
	getDepartmentsByOrganizationId,
} from "$lib/server/db/queries/department";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const orgId = event.locals.session?.selectedOrganizationId;
	if (!orgId) {
		return error(400, "No organization selected.");
	}

	const { vehicle } = await event.parent();
	const department = await getDepartmentById(vehicle.departmentId);
	if (department?.organizationId !== orgId) {
		return error(403, "Vehicle does not belong to the selected organization.");
	}

	return { departments: await getDepartmentsByOrganizationId(orgId) };
}) satisfies PageServerLoad;
