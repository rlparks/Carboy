import { getTripWithDestinations } from "$lib/server/db/queries/trip";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("superadmin");

	const { id } = event.params;

	const trip = await getTripWithDestinations(id);

	if (!trip) {
		return error(404, "Trip not found");
	}

	return { trip };
}) satisfies PageServerLoad;
