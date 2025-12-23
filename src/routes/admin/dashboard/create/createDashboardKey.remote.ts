import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { generateTextId } from "$lib/server";
import { createDashboardKey as createDb } from "$lib/server/db/queries/dashboardKey";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const createDashboardKey = form(
	v.strictObject({
		name: v.pipe(v.string(), v.minLength(1, "Name must be at least 1 character.")),
	}),
	async ({ name }) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("admin");

		const organizationId = event.locals.session?.selectedOrganizationId;
		if (!organizationId) {
			return error(400, "No organization selected");
		}

		let createdId = "";
		try {
			const newDashboardKey = await createDb({
				name,
				organizationId,
				key: generateTextId(),
			});
			if (!newDashboardKey) {
				throw new Error("Failed to create dashboard key.");
			}

			createdId = newDashboardKey.id;
		} catch {
			return error(500, "An error occurred while creating the dashboard key.");
		}

		return redirect(303, resolve("/admin/dashboard/[id]", { id: createdId }));
	},
);
