import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { parsePgError } from "$lib/server/db/error";
import { sql } from "$lib/server/db/postgres";
import { redirect } from "@sveltejs/kit";
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
			await sql`
					DELETE FROM account_organization
					WHERE account_id = ${accountId}
				`;

			const now = new Date();
			for (const orgId of organizationIds) {
				await sql`
                        INSERT INTO account_organization (account_id, organization_id, created_at, updated_at)
                        VALUES (${accountId}, ${orgId}, ${now}, NULL)
                    `;
			}
		} catch (err) {
			throw parsePgError(err);
		}

		return redirect(303, resolve("/admin/accounts/[username]", { username }));
	},
);
