import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { deleteVehicle as deleteDb } from "$lib/server/db/queries/vehicle";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const deleteVehicle = form(
	v.strictObject({
		id: v.pipe(v.string(), v.minLength(1, "Vehicle ID is required.")),
	}),
	async ({ id }) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("admin");

		try {
			await deleteDb(id);
		} catch (err) {
			console.error("Failed to delete vehicle:", err);
			return error(500, "An error occurred while deleting the vehicle.");
		}

		return redirect(303, resolve("/admin/vehicles"));
	},
);
