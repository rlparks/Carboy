import { form, getRequestEvent } from "$app/server";
import { createTripNote, getTripWithDestinations } from "$lib/server/db/queries/trip";
import { error } from "@sveltejs/kit";
import * as v from "valibot";

export const addNote = form(
	v.strictObject({
		tripId: v.string(),
		note: v.pipe(v.string(), v.minLength(1, "Note must be at least 1 character long.")),
	}),
	async ({ tripId, note }) => {
		const event = getRequestEvent();
		event.locals.security.enforceAuthenticated();

		const trip = await getTripWithDestinations(tripId);

		if (!trip) {
			return error(404, "Trip not found");
		}

		if (trip.organizationId !== event.locals.session?.selectedOrganizationId) {
			return error(403, "Organization does not match.");
		}

		try {
			await createTripNote({ accountId: event.locals.account!.id, tripId, text: note });
		} catch (err) {
			console.error(err);
			return error(500, "Error creating note");
		}
	},
);
