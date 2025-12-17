import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import {
	createAccount as createDb,
	getAccountByEmail,
	getAccountByUsername,
} from "$lib/server/db/queries/account";
import { refreshAccountOrganizations } from "$lib/server/db/queries/organization";
import { EmailSchema, NameSchema, UsernameSchema } from "$lib/types/validation";
import { error, invalid, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const createAccount = form(
	v.strictObject({
		username: UsernameSchema,
		email: EmailSchema,
		name: NameSchema,
	}),
	async ({ username, email, name }, issue) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("admin");

		if (!event.locals.session?.selectedOrganizationId) {
			return error(400, "No organization selected.");
		}

		const existingAccountIssues = [];
		const [existingAccountUsername, existingAccountEmail] = await Promise.all([
			getAccountByUsername(username),
			getAccountByEmail(email),
		]);

		if (existingAccountUsername) {
			existingAccountIssues.push(issue.username("An account with this username already exists."));
		}

		if (existingAccountEmail) {
			existingAccountIssues.push(issue.email("An account with this email already exists."));
		}

		if (existingAccountIssues.length > 0) {
			return invalid(...existingAccountIssues);
		}

		try {
			const newAccount = await createDb({
				username,
				email,
				name,
				archived: false,
				passwordEnabled: false,
				passwordHash: null,
				role: null,
			});

			if (!newAccount) {
				throw new Error("Account creation failed");
			}

			await refreshAccountOrganizations(newAccount.id, [
				event.locals.session.selectedOrganizationId,
			]);
		} catch {
			return error(500, "An error occurred while creating the account.");
		}

		return redirect(303, resolve("/admin/accounts/[username]", { username }));
	},
);
