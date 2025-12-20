import { getAccounts, getAccountsInOrganization } from "$lib/server/db/queries/account";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const allAccountsMode = event.url.searchParams.get("all") === "true";
	if (allAccountsMode) {
		event.locals.security.enforceRole("superadmin");
		return { accounts: getAccounts() };
	}

	const orgId = event.locals.session?.selectedOrganizationId;
	if (!orgId) {
		return error(400, "No organization selected.");
	}

	return { accounts: getAccountsInOrganization(orgId) };
}) satisfies PageServerLoad;
