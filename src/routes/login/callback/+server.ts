import { createSession } from "$lib/server/auth";
import { setSessionCookie } from "$lib/server/auth/helpers";
import { OIDC_STATE_KEY, getOidcUrls } from "$lib/server/auth/oidc";
import { getAccessToken, getUserInfo } from "$lib/server/auth/oidc/backendflow";
import { getOidcConfig } from "$lib/server/config/oidc";
import { getAccountWithOrgsByUsername } from "$lib/server/db/queries/auth";
import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	if (event.locals.security.isAuthenticated()) {
		return redirect(303, "/");
	}

	const storedState = event.cookies.get(OIDC_STATE_KEY);
	const code = event.url.searchParams.get("code");
	const urlState = event.url.searchParams.get("state");
	if (!code || !urlState || !storedState) {
		return error(400, "Missing code or state parameter.");
	}

	event.cookies.delete(OIDC_STATE_KEY, { path: "/" });

	if (urlState !== storedState) {
		return error(400, "Invalid OIDC state parameter.");
	}

	const { clientId, clientSecret, usernameClaim } = await getOidcConfig();

	const { tokenEndpoint, userinfoEndpoint } = await getOidcUrls();
	const redirectUri = event.url.origin + "/login/callback";

	if (!clientId || !clientSecret || !usernameClaim) {
		throw new Error("OIDC client ID, secret, or username claim is not configured.");
	}

	const { access_token, id_token } = await getAccessToken(
		tokenEndpoint,
		clientId,
		clientSecret,
		code,
		redirectUri,
	);

	const oidcUserInfo = await getUserInfo(userinfoEndpoint, access_token);

	const username = parseUsernameClaim(oidcUserInfo, usernameClaim);

	if (!username) {
		return error(400, "Invalid OIDC user info.");
	}

	const account = await getAccountWithOrgsByUsername(username);
	if (!account || account.archived) {
		const url = `/login/noaccount?username=${encodeURIComponent(username)}&id_token=${encodeURIComponent(id_token)}`;
		return redirect(303, url);
	}

	if (account.organizationIds.length === 0 && account.role !== "superadmin") {
		return error(
			403,
			"Your account is not associated with any organizations. Please contact an administrator.",
		);
	}

	// if the user belongs to only one organization, select it automatically
	const selectedOrganizationId =
		account.organizationIds.length === 1 ? account.organizationIds[0] : null;

	const { token, session } = await createSession(
		account.id,
		selectedOrganizationId ?? null,
		id_token,
		null,
	);

	setSessionCookie(event, token, session.expiresAt, false);

	return redirect(303, "/");
};

function parseUsernameClaim(userInfo: Record<string, unknown>, claim: string) {
	if (claim in userInfo && typeof userInfo[claim] === "string") {
		return userInfo[claim];
	}

	return null;
}
