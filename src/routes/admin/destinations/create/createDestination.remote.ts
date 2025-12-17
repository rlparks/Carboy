import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import {
	createDestination as createDb,
	getDestinationByName,
} from "$lib/server/db/queries/destination";
import { error, invalid, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const createDestination = form(
	v.strictObject({
		name: v.string(),
		shortName: v.string(),
		address: v.string(),
	}),
	async ({ name, shortName, address }, issue) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("admin");

		const existingDestinationWithName = await getDestinationByName(name);
		if (existingDestinationWithName) {
			return invalid(issue.name("A destination with this name already exists."));
		}

		let createdId = "";
		try {
			const newDestination = await createDb({
				name,
				shortName,
				address,
				latitude: null,
				longitude: null,
			});
			if (!newDestination) {
				throw new Error("Failed to create destination.");
			}

			createdId = newDestination.id;
		} catch {
			return error(500, "An error occurred while creating the destination.");
		}

		return redirect(303, resolve("/admin/destinations/[id]", { id: createdId }));
	},
);
