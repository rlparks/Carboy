import { getTripCount } from "$lib/server/db/queries/trip";
import { getVehicleById } from "$lib/server/db/queries/vehicle";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

// TODO: ensure account has correct organization (or superadmin)
export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const { id } = event.params;
	const vehicle = await getVehicleById(id);

	if (!vehicle) {
		return error(404, "Vehicle not found.");
	}

	const tripCount = await getTripCount({ vehicleNumber: vehicle.number });

	return { vehicle, tripCount };
}) satisfies LayoutServerLoad;
