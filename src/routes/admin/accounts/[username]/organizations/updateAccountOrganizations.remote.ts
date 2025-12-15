import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { refreshAccountOrganizations } from "$lib/server/db/queries/organization";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const updateAccountOrganizations = form(
	v.strictObject({
		accountId: v.string(),
		username: v.string(),
		organizationIds: v.string(),
	}),
	async ({ accountId, username, organizationIds: orgIdsRaw }) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("superadmin");

		const organizationIds = orgIdsRaw
			.split(",")
			.map((id) => id.trim())
			.filter((id) => id.length > 0);

		try {
			await refreshAccountOrganizations(accountId, organizationIds);
		} catch {
			return error(500, "Failed to update account organizations.");
		}

		return redirect(303, resolve("/admin/accounts/[username]", { username }));
	},
);
