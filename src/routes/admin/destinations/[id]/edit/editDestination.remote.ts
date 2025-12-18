import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import {
	getDestinationById,
	getDestinationByName,
	updateDestination,
} from "$lib/server/db/queries/destination";
import { error, invalid, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const editDestination = form(
	v.strictObject({
		id: v.string(),
		name: v.pipe(v.string(), v.minLength(1, "Name must be at least 1 character.")),
		shortName: v.string(),
		address: v.string(),
	}),
	async ({ id, name, shortName, address }, issue) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("admin");

		const destination = await getDestinationById(id);
		if (!destination) {
			return error(404, "Destination not found.");
		}

		const existing = await getDestinationByName(name);
		if (existing && existing.id !== id) {
			return invalid(issue.name("A destination with this name already exists."));
		}

		try {
			await updateDestination(id, {
				name,
				shortName: shortName || null,
				address: address || null,
				latitude: destination.latitude ?? null,
				longitude: destination.longitude ?? null,
			});
		} catch {
			return error(500, "Failed to update destination.");
		}

		return redirect(303, resolve("/admin/destinations/[id]", { id }));
	},
);
