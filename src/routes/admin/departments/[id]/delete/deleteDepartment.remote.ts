import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { deleteDepartment as deleteDb } from "$lib/server/db/queries/department";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const deleteDepartment = form(
	v.strictObject({
		id: v.pipe(v.string(), v.minLength(1, "Department ID is required.")),
	}),
	async ({ id }) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("admin");

		try {
			await deleteDb(id);
		} catch (err) {
			console.error("Failed to delete department:", err);
			return error(500, "An error occurred while deleting the department.");
		}

		return redirect(303, resolve("/admin/departments"));
	},
);
