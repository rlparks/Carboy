import { generateTextId } from "$lib/server";
import { getOidcConfig } from "$lib/server/config/oidc";
import * as v from "valibot";

const SCOPES = ["openid", "profile", "email"];
export const OIDC_STATE_KEY = "ember-oidc-state";

type DiscoveredUrls = {
	authorizationEndpoint: string;
	tokenEndpoint: string;
	userinfoEndpoint: string;
	endSessionEndpoint: string;
};

// only recheck for URLs if this changes
let lastCheckedDiscoveryUrl: string | null = null;

let cachedDiscoveredUrls: DiscoveredUrls | null = null;

export async function getOidcUrls() {
	const config = await getOidcConfig();

	if (!config.discoveryUrl) {
		throw new Error("OIDC discovery URL is not configured.");
	}

	if (config.discoveryUrl !== lastCheckedDiscoveryUrl || !cachedDiscoveredUrls) {
		lastCheckedDiscoveryUrl = config.discoveryUrl;
		cachedDiscoveredUrls = await discoverOidcUrls(lastCheckedDiscoveryUrl);
	}

	return cachedDiscoveredUrls;
}

const DiscoverySchema = v.object({
	authorization_endpoint: v.pipe(v.string(), v.url()),
	token_endpoint: v.pipe(v.string(), v.url()),
	userinfo_endpoint: v.pipe(v.string(), v.url()),
	end_session_endpoint: v.pipe(v.string(), v.url()),
});

async function discoverOidcUrls(url: string) {
	const res = await fetch(url);

	if (!res.ok) {
		throw new Error(`Failed to fetch OIDC discovery URL: ${res.status} ${res.statusText}`);
	}

	const data = await res.json();

	const result = v.safeParse(DiscoverySchema, data);
	if (!result.success) {
		const issues = v.flatten(result.issues).nested;
		throw new Error("OIDC discovery data is invalid:" + JSON.stringify(issues));
	}

	return {
		authorizationEndpoint: result.output.authorization_endpoint,
		tokenEndpoint: result.output.token_endpoint,
		userinfoEndpoint: result.output.userinfo_endpoint,
		endSessionEndpoint: result.output.end_session_endpoint,
	};
}

export async function getAuthEndpointWithParams(redirectUri: string) {
	const config = await getOidcConfig();

	if (!config.clientId) {
		throw new Error("OIDC client ID is not configured.");
	}

	const { authorizationEndpoint } = await getOidcUrls();
	const url = new URL(authorizationEndpoint);

	const state = generateTextId();

	url.searchParams.set("response_type", "code");
	url.searchParams.set("scope", SCOPES.join(" "));
	url.searchParams.set("client_id", config.clientId);
	url.searchParams.set("redirect_uri", redirectUri);
	url.searchParams.set("state", state);

	return { url: url.toString(), state };
}
