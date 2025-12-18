import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { createVehicle as createDb, getVehicleByNumber } from "$lib/server/db/queries/vehicle";
import { VehicleMileageSchema } from "$lib/types/validation";
import { error, invalid, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const createVehicle = form(
	v.strictObject({
		number: v.pipe(v.string(), v.minLength(1, "Number must be at least 1 character.")),
		name: v.pipe(v.string(), v.minLength(1, "Name must be at least 1 character.")),
		departmentId: v.pipe(v.string(), v.minLength(1, "Department is required.")),
		mileage: VehicleMileageSchema,
	}),
	async ({ number, name, departmentId, mileage }, issue) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("admin");

		const existingVehicleWithNumber = await getVehicleByNumber(number);
		if (existingVehicleWithNumber) {
			return invalid(issue.number("A vehicle with this number already exists."));
		}

		let createdId = "";
		try {
			const newVehicle = await createDb({
				number,
				name,
				departmentId,
				mileage: mileage ?? null,
			});
			if (!newVehicle) {
				throw new Error("Failed to create vehicle.");
			}

			createdId = newVehicle.id;
		} catch {
			return error(500, "An error occurred while creating the vehicle.");
		}

		return redirect(303, resolve("/admin/vehicles/[id]", { id: createdId }));
	},
);
