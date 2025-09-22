import { getValue } from "$lib/server/db/queries/configuration";

export async function getOidcConfig() {
	const [discoveryUrl, clientId, clientSecret, usernameClaim, signOutOfIdp] = await Promise.all([
		getValue("oidcDiscoveryUrl"),
		getValue("oidcClientId"),
		getValue("oidcClientSecret"),
		getValue("oidcUsernameClaim"),
		getValue("signOutOfIdp"),
	]);

	return {
		discoveryUrl,
		clientId,
		clientSecret,
		usernameClaim,
		signOutOfIdp: signOutOfIdp === "true",
	};
}
