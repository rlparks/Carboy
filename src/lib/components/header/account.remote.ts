import { resolve } from "$app/paths";
import { form, getRequestEvent, query } from "$app/server";
import { deleteSession } from "$lib/server/auth";
import { deleteSessionCookie } from "$lib/server/auth/helpers";
import { getOidcUrls } from "$lib/server/auth/oidc";
import { getOidcConfig } from "$lib/server/config/oidc";
import { redirect } from "@sveltejs/kit";
import { INITIAL_ADMIN_ID_TOKEN } from "../../../routes/setup/setup.remote";

export const me = query(async () => {
	const { account, session } = getRequestEvent().locals;

	return { account, session };
});

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
	if (
		event.locals.session &&
		signOutOfIdp &&
		event.locals.session?.oidcIdToken !== INITIAL_ADMIN_ID_TOKEN
	) {
		return await endOidcSession(event.url.origin, event.locals.session.oidcIdToken);
	}

	return redirect(303, resolve("/"));
});

async function endOidcSession(origin: string, id_token: string) {
	const { endSessionEndpoint } = await getOidcUrls();
	const logoutUrl = new URL(endSessionEndpoint);
	logoutUrl.searchParams.set("id_token_hint", id_token);
	logoutUrl.searchParams.set("post_logout_redirect_uri", origin + "/");

	return redirect(303, logoutUrl.toString());
}
