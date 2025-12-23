import {
	getDepartmentById,
	getDepartments,
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

	if (event.locals.security.hasRole("superadmin")) {
		const departments = await getDepartments();
		const departmentGroups = Object.groupBy(departments, (d) => d.organizationName);

		const groupOptions = [];

		for (const org of Object.keys(departmentGroups)) {
			const departments = departmentGroups[org];
			if (departments) {
				const departmentOptions = departments.map((dept) => ({
					value: dept.id,
					label: dept.name,
				}));

				groupOptions.push({ label: org, options: departmentOptions });
			}
		}

		return { departmentGroups: groupOptions };
	}

	return { departments: await getDepartmentsByOrganizationId(orgId) };
}) satisfies PageServerLoad;
