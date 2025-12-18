import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import {
	getDepartmentById,
	getDepartmentByNameAndOrganizationId,
	updateDepartment,
} from "$lib/server/db/queries/department";
import { error, invalid, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const editDepartment = form(
	v.strictObject({
		id: v.string(),
		name: v.pipe(v.string(), v.trim(), v.minLength(1, "Name is required.")),
	}),
	async ({ id, name }, issue) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("admin");

		const department = await getDepartmentById(id);
		if (!department) {
			return error(404, "Department not found");
		}

		const orgId = event.locals.session?.selectedOrganizationId;
		if (!event.locals.security.hasRole("superadmin") && department.organizationId !== orgId) {
			return error(403, "Forbidden");
		}

		const existing = await getDepartmentByNameAndOrganizationId(name, department.organizationId);
		if (existing && existing.id !== id) {
			return invalid(issue.name("A department with this name already exists."));
		}

		try {
			await updateDepartment(id, {
				name,
				position: department.position ?? 0,
				organizationId: department.organizationId,
			});
		} catch {
			return error(500, "Failed to update department.");
		}

		return redirect(303, resolve("/admin/departments/[id]", { id }));
	},
);
