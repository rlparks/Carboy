import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const { editAccount } = await event.parent();
	if (
		!event.locals.security.hasRole("superadmin") &&
		!editAccount.organizations.some(
			(org) => org.id === event.locals.session?.selectedOrganizationId,
		)
	) {
		return error(403, "Forbidden");
	}

	if (editAccount.role === "superadmin" && !event.locals.security.hasRole("superadmin")) {
		return error(403, "Forbidden");
	}
}) satisfies PageServerLoad;
