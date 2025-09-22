import { impersonateCookieName, sessionCookieName } from "$lib/server/auth";
import type { RequestEvent } from "@sveltejs/kit";

export function setSessionCookie(
	event: RequestEvent,
	sessionToken: string,
	expiresAt: Date,
	impersonated: boolean,
) {
	const cookieName = impersonated ? impersonateCookieName : sessionCookieName;

	setCookie(event, cookieName, sessionToken, expiresAt);
}

export function setCookie(event: RequestEvent, cookieName: string, value: string, expiresAt: Date) {
	event.cookies.set(cookieName, value, {
		path: "/",
		sameSite: "lax", // if "strict", does not log in after redirect from OIDC provider
		expires: expiresAt,
		httpOnly: true,
		secure: true,
	});
}

export function deleteSessionCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, { path: "/" });
}

export function deleteImpersonateCookie(event: RequestEvent) {
	event.cookies.delete(impersonateCookieName, { path: "/" });
}
