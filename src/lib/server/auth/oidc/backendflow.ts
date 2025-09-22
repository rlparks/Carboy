import { error } from "@sveltejs/kit";
import * as v from "valibot";

const AccessTokenResponse = v.object({
	access_token: v.string(),
	id_token: v.string(),
});

export async function getAccessToken(
	tokenEndpoint: string,
	clientId: string,
	clientSecret: string,
	code: string,
	redirectUri: string,
) {
	const body = new URLSearchParams();
	body.append("grant_type", "authorization_code");
	body.append("client_id", clientId);
	body.append("client_secret", clientSecret);
	body.append("redirect_uri", redirectUri);
	body.append("code", code);

	const res = await fetch(tokenEndpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body,
	});

	if (!res.ok) {
		return error(500, "Failure getting auth token");
	}

	const tokenJson = await res.json();

	const result = v.safeParse(AccessTokenResponse, tokenJson);
	if (!result.success) {
		const issues = v.flatten(result.issues).nested;
		throw new Error("OIDC token response is invalid:" + JSON.stringify(issues));
	}

	return result.output;
}

export async function getUserInfo(userInfoEndpoint: string, accessToken: string) {
	const userInfoResponse = await fetch(userInfoEndpoint, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!userInfoResponse.ok) {
		return error(500, "Error getting user info");
	}

	const userInfoJson = await userInfoResponse.json();

	return userInfoJson;
}
