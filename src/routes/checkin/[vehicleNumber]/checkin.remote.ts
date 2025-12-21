import { form, getRequestEvent } from "$app/server";
import { getDepartmentById } from "$lib/server/db/queries/department";
import { getTripWithDestinations } from "$lib/server/db/queries/trip";
import { getVehicleById } from "$lib/server/db/queries/vehicle";
import { error, invalid } from "@sveltejs/kit";
import * as v from "valibot";

export const checkin = form(
	v.strictObject(
		{
			tripId: v.string(),
			endMileage: v.optional(
				v.pipe(
					v.string(),
					v.transform((s) => parseInt(s)),
				),
			),
			destinationIds: v.array(v.string()),
			note: v.optional(v.pipe(v.string(), v.trim())),
		},
		"At least one destination is required.",
	),
	async (data, issue) => {
		const event = getRequestEvent();
		event.locals.security.enforceAuthenticated();

		const trip = await getTripWithDestinations(data.tripId);
		if (!trip) {
			return error(404, "Trip not found");
		}

		const vehicle = await getVehicleById(trip.vehicleId);

		if (!vehicle) {
			return error(500, "Vehicle not found");
		}

		const department = await getDepartmentById(vehicle.departmentId);
		if (!department || department.organizationId !== event.locals.session?.selectedOrganizationId) {
			return error(403, "Incorrect organization selected");
		}

		if (trip.startMileage !== null && (data.endMileage === undefined || isNaN(data.endMileage))) {
			return invalid(issue.endMileage("End mileage is required."));
		}

		console.log(data);
	},
);
