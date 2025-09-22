import { setCookie } from "$lib/server/auth/helpers";
import { getAuthEndpointWithParams, OIDC_STATE_KEY } from "$lib/server/auth/oidc";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	if (event.locals.security.isAuthenticated()) {
		return redirect(303, "/");
	}

	const redirectUri = event.url.origin + "/login/callback";
	const authEndpoint = await getAuthEndpointWithParams(redirectUri);

	const inOneMinute = new Date(Date.now() + 60 * 1000);
	setCookie(event, OIDC_STATE_KEY, authEndpoint.state, inOneMinute);

	return redirect(303, authEndpoint.url);
};
