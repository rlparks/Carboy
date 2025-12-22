import { form, getRequestEvent } from "$app/server";
import { getTripWithDestinations, updateTrip } from "$lib/server/db/queries/trip";
import { VehicleMileageSchema } from "$lib/types/validation";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const editTrip = form(
	v.strictObject({
		id: v.string(),
		startMileage: VehicleMileageSchema,
		endMileage: VehicleMileageSchema,
	}),
	async ({ id, startMileage, endMileage }) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("superadmin");

		const trip = await getTripWithDestinations(id);
		if (!trip) {
			return error(404, "Trip not found");
		}

		try {
			await updateTrip(id, startMileage, endMileage);
		} catch (err) {
			console.error(err);
			return error(500, "Something went wrong while updating the trip");
		}

		return redirect(303, `/trips/${id}`);
	},
);
