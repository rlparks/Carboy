import { form, getRequestEvent } from "$app/server";
import {
	createDepartment as createDb,
	getDepartmentByNameAndOrganizationId,
	getHighestDepartmentPosition,
} from "$lib/server/db/queries/department";
import { error, invalid, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const createDepartment = form(
	v.strictObject({
		name: v.string(),
	}),
	async ({ name }, issue) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("admin");
		const orgId = event.locals.session?.selectedOrganizationId;
		if (!orgId) {
			return error(400, "No organization selected.");
		}

		const existingDepartment = await getDepartmentByNameAndOrganizationId(name, orgId);
		if (existingDepartment) {
			return invalid(issue.name("A department with this name already exists."));
		}

		try {
			const highestPosition = await getHighestDepartmentPosition(orgId);
			await createDb({
				name,
				organizationId: orgId,
				position: highestPosition !== null ? highestPosition + 1 : 0,
			});
		} catch {
			return error(500, "Failed to create department.");
		}

		return redirect(303, "/admin/departments");
	},
);
