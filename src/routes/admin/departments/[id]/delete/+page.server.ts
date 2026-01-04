import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const { vehicleCount } = await event.parent();

	if (vehicleCount > 0) {
		return error(400, "Cannot delete department with associated vehicles.");
	}
}) satisfies PageServerLoad;
