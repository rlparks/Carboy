import { command, getRequestEvent } from "$app/server";
import { getAccountWithOrgsById } from "$lib/server/db/queries/account";
import { updateSelectedOrganization } from "$lib/server/db/queries/session";
import { redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const switchOrganization = command(
	v.strictObject({ organizationId: v.string() }),
	async ({ organizationId }) => {
		const event = getRequestEvent();
		if (!event.locals.security.isAuthenticated()) {
			return redirect(303, "/");
		}

		const sessionId = event.locals.session?.id;
		if (sessionId) {
			const accountWithOrgs = await getAccountWithOrgsById(event.locals.account!.id);
			if (
				accountWithOrgs?.organizations.some((org) => org.id === organizationId) ||
				event.locals.account?.role === "superadmin"
			) {
				await updateSelectedOrganization(sessionId, organizationId);
			}
		}
	},
);
