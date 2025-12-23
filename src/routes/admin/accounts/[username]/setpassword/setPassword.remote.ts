import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { hashPassword } from "$lib/server/auth/helpers";
import { getAccountByUsername } from "$lib/server/db/queries/account";
import { setAccountPasswordHash } from "$lib/server/db/queries/auth";
import { PasswordSchema } from "$lib/types/validation";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const setPassword = form(
	v.strictObject({
		username: v.string(),
		password: PasswordSchema,
	}),
	async ({ username, password }) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("superadmin");

		const account = await getAccountByUsername(username);

		if (!account) {
			return error(404, "Account not found");
		}

		const passwordHash = await hashPassword(password);

		await setAccountPasswordHash(account.id, passwordHash);

		return redirect(303, resolve("/admin/accounts/[username]", { username: account.username }));
	},
);
