import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { deleteAccount as deleteDb, getAccountWithOrgsById } from "$lib/server/db/queries/account";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const deleteAccount = form(
	v.strictObject({
		id: v.pipe(v.string(), v.minLength(1, "Account ID is required.")),
	}),
	async ({ id }) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("admin");

		const account = await getAccountWithOrgsById(id);
		if (!account) {
			return error(404, "Account not found");
		}

		if (
			!event.locals.security.hasRole("superadmin") &&
			!account.organizations.some((org) => org.id === event.locals.session?.selectedOrganizationId)
		) {
			return error(403, "Forbidden");
		}

		if (account.role === "superadmin" && !event.locals.security.hasRole("superadmin")) {
			return error(403, "Forbidden");
		}

		try {
			await deleteDb(id);
		} catch (err) {
			console.error("Failed to delete account:", err);
			return error(500, "An error occurred while deleting the account.");
		}

		return redirect(303, resolve("/admin/accounts"));
	},
);
