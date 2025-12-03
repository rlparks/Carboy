import { form, getRequestEvent } from "$app/server";
import { createOrganization as createOrganizationDb } from "$lib/server/db/queries/organization";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const createOrganization = form(
	v.strictObject({ name: v.string(), slug: v.string() }),
	async ({ name, slug }) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("superadmin");

		try {
			await createOrganizationDb({ name, slug });
		} catch {
			return error(400, "Failed to create organization");
		}

		return redirect(303, "/super/organizations");
	},
);
