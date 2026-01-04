import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import {
	deleteDestination as deleteDb,
	getDestinationById,
} from "$lib/server/db/queries/destination";
import { getTripCountByDestinationId } from "$lib/server/db/queries/trip";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const deleteDestination = form(
	v.strictObject({
		id: v.pipe(v.string(), v.minLength(1, "Destination ID is required.")),
	}),
	async ({ id }) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("admin");

		const destination = await getDestinationById(id);
		if (!destination) {
			return error(404, "Destination not found");
		}

		const tripCount = await getTripCountByDestinationId(id);
		if (tripCount > 0) {
			return error(400, "Cannot delete destination with associated trips.");
		}

		try {
			await deleteDb(id);
		} catch (err) {
			console.error("Failed to delete destination:", err);
			return error(500, "An error occurred while deleting the destination.");
		}

		return redirect(303, resolve("/admin/destinations"));
	},
);
