import { form, getRequestEvent } from "$app/server";
import { endOidcSession } from "$lib/server/auth/helpers";
import { redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const idpLogout = form(v.strictObject({ id_token: v.string() }), async ({ id_token }) => {
	const event = getRequestEvent();
	if (event.locals.security.isAuthenticated()) {
		return redirect(303, "/");
	}

	return await endOidcSession(event.url.origin, id_token);
});
