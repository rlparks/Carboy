import { getAccountsInOrganization } from "$lib/server/db/queries/account";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const orgId = event.locals.session?.selectedOrganizationId;
	if (!orgId) {
		return error(400, "No organization selected.");
	}

	// TODO: way to see accounts that are not in organizations
	return { accounts: getAccountsInOrganization(orgId) };
}) satisfies PageServerLoad;
