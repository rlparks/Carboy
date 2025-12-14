import { getAccountWithOrgsByUsername } from "$lib/server/db/queries/auth";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");
	const { username } = event.params;

	const account = await getAccountWithOrgsByUsername(username);
	if (!account) {
		return error(404, "Account not found");
	}

	// ensure admin can only access accounts within their organization unless they are superadmin
	if (
		!event.locals.security.hasRole("superadmin") &&
		!account.organizationIds.some((orgId) => orgId === event.locals.session?.selectedOrganizationId)
	) {
		return error(403, "Forbidden");
	}

	return { account };
}) satisfies LayoutServerLoad;
