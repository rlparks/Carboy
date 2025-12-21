import { getVehicleByNumber } from "$lib/server/db/queries/vehicle";
import { error } from "@sveltejs/kit";
import { readFile } from "fs/promises";
import { join } from "path";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.enforceAuthenticated();

	const { vehicleNumber } = event.params;
	const vehicle = await getVehicleByNumber(vehicleNumber);
	if (!vehicle) {
		throw error(404, "Vehicle not found");
	}

	try {
		const imagePath = join(process.cwd(), "images", "vehicles", `${vehicle.id}.webp`);
		const imageBuffer = await readFile(imagePath);
		return new Response(imageBuffer, {
			headers: {
				"Content-Type": "image/webp",
			},
		});
	} catch {
		return error(404, "Image not found");
	}
};
