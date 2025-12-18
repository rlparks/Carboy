import { getVehicleById } from "$lib/server/db/queries/vehicle";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const { id } = event.params;
	const vehicle = await getVehicleById(id);

	if (!vehicle) {
		return error(404, "Vehicle not found.");
	}

	return { vehicle };
}) satisfies LayoutServerLoad;
