import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const { tripCount } = await event.parent();

	if (tripCount > 0) {
		return error(400, "Cannot delete vehicle with associated trips.");
	}
}) satisfies PageServerLoad;
