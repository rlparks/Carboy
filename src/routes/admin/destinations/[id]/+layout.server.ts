import { getDestinationById } from "$lib/server/db/queries/destination";
import { getTripCountByDestinationId } from "$lib/server/db/queries/trip";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const { id } = event.params;
	const destination = await getDestinationById(id);

	if (!destination) {
		return error(404, "Destination not found.");
	}

	const tripCount = await getTripCountByDestinationId(id);

	return { destination, tripCount };
}) satisfies LayoutServerLoad;
