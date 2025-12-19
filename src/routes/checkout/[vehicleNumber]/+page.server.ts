import { getVehicleByNumber } from "$lib/server/db/queries/vehicle";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceAuthenticated();

	const { vehicleNumber } = event.params;

	const vehicle = await getVehicleByNumber(vehicleNumber);

	if (!vehicle) {
		return error(404, "Vehicle not found");
	}

	if (vehicle.organizationId !== event.locals.session?.selectedOrganizationId) {
		return error(403, "Organization does not match.");
	}

	return { vehicle };
}) satisfies PageServerLoad;
