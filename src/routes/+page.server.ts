import { getDepartmentsByOrganizationId } from "$lib/server/db/queries/department";
import { getVehiclesByOrganizationId } from "$lib/server/db/queries/vehicle";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	if (event.locals.security.isAuthenticated()) {
		const orgId = event.locals.session?.selectedOrganizationId;
		if (!orgId) {
			return error(400, "No organization selected.");
		}

		const [vehicles, departments] = await Promise.all([
			getVehiclesByOrganizationId(orgId),
			getDepartmentsByOrganizationId(orgId),
		]);

		const vehiclesWithStatus = {
			available: vehicles.filter((vehicle) => !vehicle.isCheckedOut),
			checkedOut: vehicles.filter((vehicle) => vehicle.isCheckedOut),
		};

		const availableVehicles = Object.groupBy(
			vehiclesWithStatus.available,
			(vehicle) => vehicle.departmentId,
		);

		return {
			departments,
			availableVehicles,
			checkedOutVehicles: vehiclesWithStatus.checkedOut,
		};
	}

	return {};
}) satisfies PageServerLoad;
