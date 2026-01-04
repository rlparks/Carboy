import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");

	const { tripCount, editAccount } = await event.parent();

	if (
		!event.locals.security.hasRole("superadmin") &&
		!editAccount.organizations.some(
			(org) => org.id === event.locals.session?.selectedOrganizationId,
		)
	) {
		return error(403, "Forbidden");
	}

	if (tripCount > 0) {
		return error(400, "Cannot delete account with associated trips.");
	}

	if (editAccount.role === "superadmin" && !event.locals.security.hasRole("superadmin")) {
		return error(403, "Only superadmins can delete other superadmins.");
	}

	if (editAccount.id === event.locals.session?.accountId) {
		return error(400, "Cannot delete your own account.");
	}
}) satisfies PageServerLoad;
