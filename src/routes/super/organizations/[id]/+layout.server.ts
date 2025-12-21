import { getOrganizationById } from "$lib/server/db/queries/organization";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("superadmin");

	const { id } = event.params;

	const organization = await getOrganizationById(id);
	if (!organization) {
		return error(404, "Organization not found.");
	}

	return { organization };
}) satisfies LayoutServerLoad;
