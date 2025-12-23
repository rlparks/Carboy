import { impersonateCookieName, sessionCookieName } from "$lib/server/auth";
import { getOidcUrls } from "$lib/server/auth/oidc";
import { redirect, type RequestEvent } from "@sveltejs/kit";
import crypto from "crypto";

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

// https://dev.to/farnabaz/hash-your-passwords-with-scrypt-using-nodejs-crypto-module-316k
export async function hashPassword(password: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const salt = crypto.randomBytes(8).toString("hex");

		crypto.scrypt(password, salt, 64, (err, derivedKey) => {
			if (err) reject(err);
			resolve(derivedKey.toString("hex") + ":" + salt);
		});
	});
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const [key, salt] = passwordHash.split(":");
		if (!key || !salt) {
			return reject(new Error("Invalid password hash format"));
		}

		crypto.scrypt(password, salt, 64, (err, derivedKey) => {
			if (err) reject(err);
			resolve(key == derivedKey.toString("hex"));
		});
	});
}

export async function endOidcSession(origin: string, id_token: string) {
	const { endSessionEndpoint } = await getOidcUrls();
	const logoutUrl = new URL(endSessionEndpoint);
	logoutUrl.searchParams.set("id_token_hint", id_token);
	logoutUrl.searchParams.set("post_logout_redirect_uri", origin + "/");

	return redirect(303, logoutUrl.toString());
}
