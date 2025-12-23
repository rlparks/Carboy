import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { deleteSession } from "$lib/server/auth";
import { deleteSessionCookie, endOidcSession } from "$lib/server/auth/helpers";
import { getOidcConfig } from "$lib/server/config/oidc";
import { redirect } from "@sveltejs/kit";

export const logout = form(async () => {
	const event = getRequestEvent();
	if (!event.locals.security.isAuthenticated()) {
		return redirect(303, resolve("/"));
	}

	const sessionId = event.locals.session?.id;
	if (sessionId) {
		await deleteSession(sessionId);
	}

	deleteSessionCookie(event);

	const { signOutOfIdp } = await getOidcConfig();
	if (event.locals.session && signOutOfIdp && event.locals.session.oidcIdToken) {
		return await endOidcSession(event.url.origin, event.locals.session.oidcIdToken);
	}

	return redirect(303, resolve("/"));
});
