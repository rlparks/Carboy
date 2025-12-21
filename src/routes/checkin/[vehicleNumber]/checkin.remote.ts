import { form, getRequestEvent } from "$app/server";
import { getDistanceConfig } from "$lib/server/config/distance";
import { getDepartmentById } from "$lib/server/db/queries/department";
import { checkinVehicle, getTrips, getTripWithDestinations } from "$lib/server/db/queries/trip";
import { getVehicleById } from "$lib/server/db/queries/vehicle";
import { error, invalid, redirect } from "@sveltejs/kit";
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

		if (trip.endTime) {
			return redirect(303, "/?error=checkin");
		}

		const [mostRecentTrip] = await getTrips({ vehicleNumber: vehicle.number, limit: 1 });
		if (mostRecentTrip?.id !== data.tripId) {
			console.error("Attempted check in of old trip!");
			return redirect(303, "/?error=checkin");
		}

		if (trip.startMileage !== null && (data.endMileage === undefined || isNaN(data.endMileage))) {
			return invalid(issue.endMileage("End mileage is required."));
		}

		if (vehicle.mileage === null && data.endMileage !== undefined) {
			return invalid(issue.endMileage("Vehicle does not support mileage."));
		}

		if (data.endMileage !== undefined && vehicle.mileage !== null) {
			if (data.endMileage < vehicle.mileage) {
				return invalid(
					issue.endMileage("Ending mileage cannot be less than vehicle's current mileage."),
				);
			}

			const distanceConfig = await getDistanceConfig();
			const tripDistance = data.endMileage - vehicle.mileage;

			if (distanceConfig.errorStart && tripDistance >= distanceConfig.errorStart) {
				return invalid(
					issue.endMileage(
						`Trip distance cannot be greater than ${distanceConfig.errorStart} miles.`,
					),
				);
			}
		}

		try {
			await checkinVehicle(
				event.locals.account!.id,
				trip.id,
				data.endMileage ?? null,
				data.destinationIds,
				data.note,
			);
		} catch (err) {
			console.error(err);
			return error(500, "Something went wrong while updating the trip");
		}

		return redirect(303, "/?success=checkin");
	},
);
