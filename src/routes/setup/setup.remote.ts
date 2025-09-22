import { form, getRequestEvent } from "$app/server";
import { generateTextId } from "$lib/server";
import { createSession } from "$lib/server/auth";
import { setSessionCookie } from "$lib/server/auth/helpers";
import { sql } from "$lib/server/db/postgres";
import type { Account } from "$lib/types/db";
import { redirect } from "@sveltejs/kit";
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

export const createInitialSuperadmin = form(
	v.strictObject({
		username: UsernameSchema,
		email: EmailSchema,
		name: NameSchema,
	}),
	async ({ username, email, name }) => {
		const now = new Date();
		const accountId = generateTextId();
		const [account] = await sql<Account[]>`
                INSERT INTO account (id, name, email, username, role, archived, created_at, updated_at)   
                VALUES (${accountId}, ${name}, ${email}, ${username}, 'superadmin', false, ${now}, NULL)
                RETURNING id, name, email, username, role, archived, created_at, updated_at
        ;`;

		if (!account) {
			return {
				success: false,
				error: "Failed to create account.",
			};
		}

		const { token, session } = await createSession(account.id, null, "initial-admin", null);

		setSessionCookie(getRequestEvent(), token, session.expiresAt, false);

		return redirect(303, "/");
	},
);
