import { form, getRequestEvent, query } from "$app/server";
import { getOidcConfig } from "$lib/server/config/oidc";
import { setValue } from "$lib/server/db/queries/configuration";
import * as v from "valibot";

export const getConfig = query(async () => {
	getRequestEvent().locals.security.enforceRole("superadmin");

	const config = await getOidcConfig();

	return config;
});

export const setConfig = form(
	v.strictObject({
		oidcDiscoveryUrl: v.pipe(v.string(), v.url("Invalid URL")),
		oidcClientId: v.string(),
		oidcClientSecret: v.string(),
		oidcUsernameClaim: v.string(),
		signOutOfIdp: v.boolean(),
	}),
	async (data) => {
		await setValue("oidcDiscoveryUrl", data.oidcDiscoveryUrl);
		await setValue("oidcClientId", data.oidcClientId);
		await setValue("oidcClientSecret", data.oidcClientSecret);
		await setValue("oidcUsernameClaim", data.oidcUsernameClaim);
		await setValue("signOutOfIdp", String(data.signOutOfIdp));
	},
);
