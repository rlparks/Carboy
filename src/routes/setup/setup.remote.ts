import { form, getRequestEvent } from "$app/server";
import { createSession } from "$lib/server/auth";
import { hashPassword, setSessionCookie } from "$lib/server/auth/helpers";
import { createAccount } from "$lib/server/db/queries/account";
import { getAccountCount } from "$lib/server/db/queries/auth";
import { EmailSchema, NameSchema, PasswordSchema, UsernameSchema } from "$lib/types/validation";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const createInitialSuperadmin = form(
	v.strictObject({
		username: UsernameSchema,
		email: EmailSchema,
		name: NameSchema,
		password: PasswordSchema,
	}),
	async ({ username, email, name, password }) => {
		const numberOfAccounts = await getAccountCount();
		if (numberOfAccounts > 0) {
			return error(400, "Setup has already been completed.");
		}

		const passwordHash = await hashPassword(password);
		const account = await createAccount({
			username,
			email,
			name,
			role: "superadmin",
			passwordHash,
			archived: false,
			passwordEnabled: true,
		});

		if (!account) {
			return {
				success: false,
				error: "Failed to create account.",
			};
		}

		const { token, session } = await createSession(account.id, null, null, null);

		setSessionCookie(getRequestEvent(), token, session.expiresAt, false);

		return redirect(303, "/");
	},
);
