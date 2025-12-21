import { getVehiclesByOrganizationId } from "$lib/server/db/queries/vehicle";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const orgId = event.locals.session?.selectedOrganizationId;
	if (!orgId) {
		return error(400, "No organization selected.");
	}

	return { vehicles: getVehiclesByOrganizationId(orgId, true) };
}) satisfies PageServerLoad;
