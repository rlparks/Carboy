import { getDistanceConfig } from "$lib/server/config/distance";
import { getTrips, getTripWithDestinations } from "$lib/server/db/queries/trip";
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

	await event.locals.security.enforceOrganization(vehicle.organizationId);

	if (vehicle.archived) {
		return error(400, "Vehicle is archived.");
	}

	const [mostRecentTrip] = await getTrips({ vehicleNumber: vehicle.number, limit: 1 });
	if (!mostRecentTrip || mostRecentTrip.endTime) {
		return redirect(303, "/?error=checkin");
	}

	const fullTrip = await getTripWithDestinations(mostRecentTrip.id);

	if (!fullTrip) {
		return error(500, "Error fetching full trip.");
	}

	const distanceConfig = await getDistanceConfig();

	return { vehicle, trip: fullTrip, distanceWarningStart: distanceConfig.warningStart };
}) satisfies PageServerLoad;
