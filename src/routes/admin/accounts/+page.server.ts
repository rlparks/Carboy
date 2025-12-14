import { getAccounts, getAccountsInOrganization } from "$lib/server/db/queries/account";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const accounts = event.locals.security.hasRole("superadmin")
		? getAccounts()
		: getAccountsInOrganization(event.locals.session?.selectedOrganizationId ?? "");

	return { accounts };
}) satisfies PageServerLoad;
