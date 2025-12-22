import { getOrganizations, getOrganizationsByAccountId } from "$lib/server/db/queries/organization";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
	const accountOrganizations = event.locals.security.hasRole("superadmin")
		? await getOrganizations()
		: event.locals.account
			? await getOrganizationsByAccountId(event.locals.account.id)
			: [];

	const selectedOrganizationId = event.locals.session?.selectedOrganizationId ?? null;

	return {
		account: event.locals.account,
		accountOrganizations,
		selectedOrganizationId,
		impersonatedBy: event.locals.session?.impersonatedBy ?? null,
	};
};
