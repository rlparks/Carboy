import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { updateDashboardKey } from "$lib/server/db/queries/dashboardKey";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const editDashboardKey = form(
	v.strictObject({
		id: v.string(),
		name: v.pipe(v.string(), v.minLength(1, "Name must be at least 1 character.")),
	}),
	async ({ id, name }) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("admin");

		try {
			await updateDashboardKey(id, { name });
		} catch {
			return error(500, "An error occurred while updating the dashboard key.");
		}

		return redirect(303, resolve("/admin/dashboard/[id]", { id }));
	},
);
