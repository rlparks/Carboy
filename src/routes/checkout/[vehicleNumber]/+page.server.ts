import { getTrips } from "$lib/server/db/queries/trip";
import { getVehicleByNumber } from "$lib/server/db/queries/vehicle";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceAuthenticated();

	const { vehicleNumber } = event.params;

	const vehicle = await getVehicleByNumber(vehicleNumber);

	if (!vehicle) {
		return error(404, "Vehicle not found");
	}

	// TODO: switch or error
	if (vehicle.organizationId !== event.locals.session?.selectedOrganizationId) {
		return error(403, "Organization does not match.");
	}

	const [mostRecentTrip] = await getTrips({ vehicleNumber: vehicle.number, limit: 1 });
	if (mostRecentTrip && !mostRecentTrip.endTime) {
		return redirect(303, "/?error=checkout");
	}

	if (vehicle.archived) {
		return error(400, "Vehicle is archived.");
	}

	return { vehicle };
}) satisfies PageServerLoad;
