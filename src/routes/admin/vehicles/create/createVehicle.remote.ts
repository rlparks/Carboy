import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { createVehicle as createDb, getVehicleByNumber } from "$lib/server/db/queries/vehicle";
import { VehicleMileageSchema } from "$lib/types/validation";
import { error, invalid, redirect } from "@sveltejs/kit";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import * as v from "valibot";

export const createVehicle = form(
	v.strictObject(
		{
			number: v.pipe(v.string(), v.minLength(1, "Number must be at least 1 character.")),
			name: v.pipe(v.string(), v.minLength(1, "Name must be at least 1 character.")),
			departmentId: v.pipe(v.string(), v.minLength(1, "Department is required.")),
			mileage: VehicleMileageSchema,
			image: v.optional(
				v.pipe(
					v.file("Please select an image file."),
					v.mimeType(
						["image/jpeg", "image/png", "image/webp"],
						"Please select a JPEG, PNG, or WebP file.",
					),
					v.maxSize(1024 * 1024 * 10, "Please select a file smaller than 10 MB."),
				),
			),
		},
		"Please select a department.",
	),
	async ({ number, name, departmentId, mileage, image }, issue) => {
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
				hasImage: Boolean(image),
				archived: false,
			});
			if (!newVehicle) {
				throw new Error("Failed to create vehicle.");
			}

			createdId = newVehicle.id;

			if (image) {
				const imageDir = join(process.cwd(), "images", "vehicles");
				await mkdir(imageDir, { recursive: true });
				const imagePath = join(imageDir, `${createdId}.webp`);
				const buffer = await image.arrayBuffer();
				const processedImage = await sharp(Buffer.from(buffer))
					.resize({ height: 500, fit: "inside" })
					.webp()
					.toBuffer();
				await writeFile(imagePath, processedImage);
			}
		} catch {
			return error(500, "An error occurred while creating the vehicle.");
		}

		return redirect(303, resolve("/admin/vehicles/[id]", { id: createdId }));
	},
);
