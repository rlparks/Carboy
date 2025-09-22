import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.enforceRole("superadmin");
	return redirect(303, "/super/config");
};
