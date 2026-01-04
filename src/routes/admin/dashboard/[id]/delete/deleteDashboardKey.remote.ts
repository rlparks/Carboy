import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import {
	deleteDashboardKey as deleteDb,
	getDashboardKeyById,
} from "$lib/server/db/queries/dashboardKey";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const deleteDashboardKey = form(
	v.strictObject({
		id: v.pipe(v.string(), v.minLength(1, "Dashboard key ID is required.")),
	}),
	async ({ id }) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("admin");

		const dashboardKey = await getDashboardKeyById(id);
		if (!dashboardKey) {
			return error(404, "Dashboard key not found");
		}

		if (
			!event.locals.security.hasRole("superadmin") &&
			dashboardKey.organizationId !== event.locals.session?.selectedOrganizationId
		) {
			return error(403, "Forbidden");
		}

		try {
			await deleteDb(id);
		} catch (err) {
			console.error("Failed to delete dashboard key:", err);
			return error(500, "An error occurred while deleting the dashboard key.");
		}

		return redirect(303, resolve("/admin/dashboard"));
	},
);
