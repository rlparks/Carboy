import { form, getRequestEvent } from "$app/server";
import {
	createDestination as createDb,
	getDestinationByName,
} from "$lib/server/db/queries/destination";
import { invalid } from "@sveltejs/kit";
import { error } from "console";
import * as v from "valibot";

export const createDestinationSimple = form(
	v.strictObject({
		name: v.pipe(v.string(), v.trim(), v.minLength(1, "Name must be at least 1 character.")),
		shortName: v.pipe(v.string(), v.trim()),
		address: v.pipe(v.string(), v.trim()),
	}),
	async ({ name, shortName, address }, issue) => {
		const event = getRequestEvent();
		event.locals.security.enforceAuthenticated();

		const existingDestinationWithName = await getDestinationByName(name);
		if (existingDestinationWithName) {
			return invalid(issue.name("A destination with this name already exists."));
		}

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
		} catch {
			return error(500, "An error occurred while creating the destination.");
		}

		return {};
	},
);
