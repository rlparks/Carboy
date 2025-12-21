import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import {
	getOrganizationById,
	getOrganizations,
	updateOrganization,
} from "$lib/server/db/queries/organization";
import { error, invalid, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const editOrganization = form(
	v.strictObject({
		id: v.string(),
		name: v.pipe(v.string(), v.trim(), v.minLength(1, "Name is required.")),
	}),
	async ({ id, name }, issue) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("superadmin");

		const organization = await getOrganizationById(id);
		if (!organization) {
			return error(404, "Organization not found");
		}

		const existing = (await getOrganizations()).find((org) => org.name === name && org.id !== id);
		if (existing) {
			return invalid(issue.name("An organization with this name already exists."));
		}

		try {
			await updateOrganization(id, { name });
		} catch {
			return error(500, "Failed to update organization.");
		}

		return redirect(303, resolve("/super/organizations/[id]", { id }));
	},
);
