import { command, getRequestEvent } from "$app/server";
import { reorderDepartments as reorderDb } from "$lib/server/db/queries/department";
import { error } from "@sveltejs/kit";
import * as v from "valibot";

export const reorderDepartments = command(
	v.strictObject({
		departmentIds: v.pipe(
			v.array(v.string()),
			v.minLength(1, "At least one department ID is required."),
		),
	}),
	async ({ departmentIds }) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("admin");
		const orgId = event.locals.session?.selectedOrganizationId;
		if (!orgId) {
			return error(400, "No organization selected.");
		}

		await reorderDb(orgId, departmentIds);
	},
);
