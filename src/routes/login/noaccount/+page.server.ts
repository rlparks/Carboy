import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	if (event.locals.security.isAuthenticated()) {
		return redirect(303, "/");
	}
}) satisfies PageServerLoad;
