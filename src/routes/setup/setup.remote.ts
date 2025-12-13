import { form, getRequestEvent } from "$app/server";
import { generateTextId } from "$lib/server";
import { createSession } from "$lib/server/auth";
import { hashPassword, setSessionCookie } from "$lib/server/auth/helpers";
import { sql } from "$lib/server/db/postgres";
import { getAccountCount } from "$lib/server/db/queries/account";
import type { FriendlyAccount } from "$lib/types/bonus";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

const UsernameSchema = v.pipe(
	v.string(),
	v.minLength(1, "Username is required."),
	v.maxLength(20, "Username cannot exceed 20 characters."),
);
const EmailSchema = v.pipe(v.string(), v.email("Invalid email address."));
const NameSchema = v.pipe(
	v.string(),
	v.minLength(1, "Name is required."),
	v.maxLength(100, "Name cannot exceed 100 characters."),
);

const PasswordSchema = v.pipe(
	v.string(),
	v.minLength(8, "Password must be at least 8 characters long."),
	v.maxLength(1000, "Password cannot exceed 1000 characters."),
);

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
