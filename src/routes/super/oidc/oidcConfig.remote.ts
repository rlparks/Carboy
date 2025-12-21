import { form, getRequestEvent } from "$app/server";
import { setValue } from "$lib/server/db/queries/configuration";
import * as v from "valibot";

// TODO: set distance thresholds for checkin warning/error

export const setOidcConfig = form(
	v.strictObject({
		oidcDiscoveryUrl: v.pipe(v.string(), v.url("Invalid URL")),
		oidcClientId: v.string(),
		oidcClientSecret: v.string(),
		oidcUsernameClaim: v.string(),
		signOutOfIdp: v.optional(v.boolean(), false),
	}),
	async (data) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("superadmin");

		await setValue("oidcDiscoveryUrl", data.oidcDiscoveryUrl);
		await setValue("oidcClientId", data.oidcClientId);
		await setValue("oidcClientSecret", data.oidcClientSecret);
		await setValue("oidcUsernameClaim", data.oidcUsernameClaim);
		await setValue("signOutOfIdp", String(data.signOutOfIdp));

		return {};
	},
);
