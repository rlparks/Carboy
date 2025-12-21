import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { getVehicleByNumber, updateVehicle as updateDb } from "$lib/server/db/queries/vehicle";
import { VehicleMileageSchema } from "$lib/types/validation";
import { error, invalid, redirect } from "@sveltejs/kit";
import { mkdir, unlink, writeFile } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import * as v from "valibot";

export const editVehicle = form(
	v.strictObject({
		id: v.string(),
		number: v.pipe(v.string(), v.minLength(1, "Number must be at least 1 character.")),
		name: v.pipe(v.string(), v.minLength(1, "Name must be at least 1 character.")),
		departmentId: v.pipe(v.string(), v.minLength(1, "Department is required.")),
		mileage: VehicleMileageSchema,
		updateImage: v.optional(v.boolean(), false),
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
	}),
	async ({ id, number, name, departmentId, mileage, updateImage, image }, issue) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("admin");

		const existingVehicleWithNumber = await getVehicleByNumber(number);
		if (existingVehicleWithNumber && existingVehicleWithNumber.id !== id) {
			return invalid(issue.number("A vehicle with this number already exists."));
		}

		try {
			const updatedVehicle = await updateDb(id, {
				number,
				name,
				departmentId,
				mileage: mileage ?? null,
			});
			if (!updatedVehicle) {
				throw new Error("Failed to update vehicle.");
			}

			if (updateImage) {
				const imageDir = join(process.cwd(), "images", "vehicles");
				await mkdir(imageDir, { recursive: true });
				const imagePath = join(imageDir, `${id}.webp`);

				if (image) {
					const buffer = await image.arrayBuffer();
					const processedImage = await sharp(Buffer.from(buffer))
						.resize({ height: 500, width: 667, fit: "inside" })
						.webp()
						.toBuffer();
					await writeFile(imagePath, processedImage);
				} else {
					await unlink(imagePath);
				}
			}
		} catch {
			return error(500, "An error occurred while updating the vehicle.");
		}

		return redirect(303, resolve("/admin/vehicles/[id]", { id }));
	},
);
