import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const { account } = await event.parent();
	if (
		!event.locals.security.hasRole("superadmin") &&
		!account.organizationIds.some((orgId) => orgId === event.locals.session?.selectedOrganizationId)
	) {
		return error(403, "Forbidden");
	}
}) satisfies PageServerLoad;
