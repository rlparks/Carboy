import { form, getRequestEvent } from "$app/server";
import { createSession } from "$lib/server/auth";
import { setSessionCookie, verifyPassword } from "$lib/server/auth/helpers";
import {
	getAccountByUsernameOrEmail,
	getAccountPasswordHashById,
} from "$lib/server/db/queries/auth";
import { PasswordSchema } from "$lib/types/validation";
import { invalid, redirect } from "@sveltejs/kit";
import * as v from "valibot";

const standardErrorMessage = "Invalid credentials.";

export const login = form(
	v.strictObject({
		usernameOrEmail: v.pipe(v.string(), v.trim(), v.minLength(1, "Username or email is required.")),
		password: PasswordSchema,
	}),
	async ({ usernameOrEmail, password }) => {
		const event = getRequestEvent();
		if (event.locals.security.isAuthenticated()) {
			return redirect(303, "/");
		}

		const account = await getAccountByUsernameOrEmail(usernameOrEmail);

		if (!account) {
			console.error(`No account found for username/email: ${usernameOrEmail}`);
			return invalid(standardErrorMessage);
		}

		const passwordHash = await getAccountPasswordHashById(account.id);

		if (!passwordHash) {
			// account does not have password set
			console.error(
				`Attempted password login for account without password set: ${usernameOrEmail}`,
			);
			return invalid(standardErrorMessage);
		}

		if (!account.passwordEnabled) {
			console.error(
				`Attempted password login for account with disabled password: ${usernameOrEmail}`,
			);
			return invalid(standardErrorMessage);
		}

		const isValid = await verifyPassword(password, passwordHash);
		if (!isValid) {
			console.error(`Invalid password attempt for user: ${usernameOrEmail}`);
			return invalid(standardErrorMessage);
		}

		const { token, session } = await createSession(account.id, null, null, null);

		setSessionCookie(event, token, session.expiresAt, false);

		return redirect(303, "/");
	},
);
