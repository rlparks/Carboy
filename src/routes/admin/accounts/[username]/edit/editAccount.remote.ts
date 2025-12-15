import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { getAccountWithOrgsById, updateAccount } from "$lib/server/db/queries/account";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const editAccount = form(
	v.strictObject({
		id: v.string(),
		name: v.pipe(v.string(), v.trim(), v.minLength(1, "Name is required.")),
		email: v.pipe(v.string(), v.trim(), v.email("Invalid email.")),
		username: v.string(),
		role: v.union([v.literal(""), v.literal("admin"), v.literal("superadmin")]),
		archived: v.optional(v.boolean(), false),
		passwordEnabled: v.optional(v.boolean(), false),
	}),
	async ({ id, name, email, username, role, archived, passwordEnabled }) => {
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

		if (role === "superadmin" && !event.locals.security.hasRole("superadmin")) {
			return error(403, "Cannot assign superadmin role");
		}

		const newRole = role === "" ? null : role;
		try {
			await updateAccount({ id, name, email, username, role: newRole, archived, passwordEnabled });
		} catch {
			return error(400, "Failed to update account");
		}

		return redirect(303, resolve("/admin/accounts/[username]", { username }));
	},
);
