import { building } from "$app/environment";
import { impersonateCookieName, sessionCookieName, validateSessionToken } from "$lib/server/auth";
import { deleteSessionCookie, setSessionCookie } from "$lib/server/auth/helpers";
import Security from "$lib/server/auth/Security";
import { getOrganizations, getOrganizationsByAccountId } from "$lib/server/db/queries/organization";
import { updateSelectedOrganization } from "$lib/server/db/queries/session";
import { initCarboy } from "$lib/server/init";
import type { Organization } from "$lib/types/db";
import type { Handle, ServerInit } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

export const init: ServerInit = async () => {
	if (!building) {
		await initCarboy();
		console.log("Carboy started!");
	}
};

const handleAuth: Handle = async ({ event, resolve }) => {
	const impersonatedToken = event.cookies.get(impersonateCookieName);
	const normalToken = event.cookies.get(sessionCookieName);

	const token = impersonatedToken || normalToken;

	if (!token) {
		event.locals.session = null;
		event.locals.account = null;
		event.locals.security = new Security(event);

		return await resolve(event);
	}

	const { session, account } = await validateSessionToken(token);
	if (session) {
		setSessionCookie(event, token, session.expiresAt, Boolean(impersonatedToken));
	} else {
		deleteSessionCookie(event);
	}

	let accountOrgs: Organization[] = [];
	if (account && session) {
		accountOrgs = await (account.role === "superadmin"
			? getOrganizations()
			: getOrganizationsByAccountId(account.id));

		if (!session.selectedOrganizationId) {
			// if no organization is selected, and the account has organizations, select the first one by default
			if (accountOrgs.length > 0 && accountOrgs[0]?.id) {
				session.selectedOrganizationId = accountOrgs[0].id;
				await updateSelectedOrganization(session.id, session.selectedOrganizationId);
			}
		} else if (!accountOrgs.some((org) => org.id === session.selectedOrganizationId)) {
			// if the selected organization is no longer accessible, deselect it
			session.selectedOrganizationId = null;
			await updateSelectedOrganization(session.id, null);
		}
	}

	event.locals.session = session;
	event.locals.account = account;
	event.locals.accountOrganizations = accountOrgs;

	event.locals.security = new Security(event);

	return await resolve(event);
};

const setHeaders: Handle = async ({ event, resolve }) => {
	const start = performance.now();

	const result = await resolve(event);

	const remoteFnText = event.isRemoteRequest ? " (remote function)" : "";
	console.log(
		`${new Date().toLocaleString()} - ${event.locals.account?.username ?? "Unauthenticated"} - ${event.request.method} ${event.url.pathname} - ${(performance.now() - start).toFixed(2)}ms${remoteFnText}`,
	);

	result.headers.set("referrer-policy", "strict-origin-when-cross-origin");
	result.headers.set("x-content-type-options", "nosniff");
	result.headers.set("x-frame-options", "DENY");
	result.headers.set("cross-origin-resource-policy", "same-origin");
	result.headers.set("strict-transport-security", "max-age=63072000; includeSubDomains; preload");

	return result;
};

export const handle = sequence(handleAuth, setHeaders);
