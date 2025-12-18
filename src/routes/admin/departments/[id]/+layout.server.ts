import { getDepartmentById } from "$lib/server/db/queries/department";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const { id } = event.params;

	const department = await getDepartmentById(id);
	if (!department) {
		return error(404, "Department not found.");
	}

	// ensure admin can only access departments within their organization unless they are superadmin
	if (
		!event.locals.security.hasRole("superadmin") &&
		department.organizationId !== event.locals.session?.selectedOrganizationId
	) {
		return error(403, "Forbidden");
	}

	return { department };
}) satisfies LayoutServerLoad;
