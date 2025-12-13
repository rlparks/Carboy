import { form, getRequestEvent } from "$app/server";
import { generateTextId } from "$lib/server";
import { createSession } from "$lib/server/auth";
import { hashPassword, setSessionCookie } from "$lib/server/auth/helpers";
import { sql } from "$lib/server/db/postgres";
import { getAccountCount } from "$lib/server/db/queries/account";
import type { FriendlyAccount } from "$lib/types/bonus";
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

		const now = new Date();
		const accountId = generateTextId();
		const passwordHash = await hashPassword(password);

		const [account] = await sql<FriendlyAccount[]>`
                INSERT INTO account (id, name, email, username, role, archived, password_hash, password_enabled, created_at, updated_at)   
                VALUES (${accountId}, ${name}, ${email}, ${username}, 'superadmin', false,  ${passwordHash}, true, ${now}, NULL)
                RETURNING id, name, email, username, role, archived, password_enabled, created_at, updated_at
        ;`;

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
