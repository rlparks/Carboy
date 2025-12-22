import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { createSession, deleteSession } from "$lib/server/auth";
import { deleteImpersonateCookie, setSessionCookie } from "$lib/server/auth/helpers";
import { getAccountWithOrgsById } from "$lib/server/db/queries/account";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const impersonate = form(
	v.strictObject({ accountId: v.string() }),
	async ({ accountId }) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("superadmin");

		const currentAccount = event.locals.account!;

		const newAccount = await getAccountWithOrgsById(accountId);

		if (!newAccount) {
			return error(500, "Impersonated account not found");
		}

		// if the user belongs to only one organization, select it automatically
		const selectedOrganizationId =
			newAccount.organizations.length === 1 ? newAccount.organizations[0]!.id : null;

		const { token, session } = await createSession(
			accountId,
			selectedOrganizationId,
			null,
			currentAccount.id,
		);

		setSessionCookie(event, token, session.expiresAt, true);

		return redirect(303, "/");
	},
);

export const stopImpersonating = form(async () => {
	const event = getRequestEvent();

	if (!event.locals.session?.impersonatedBy) {
		return error(500, "Not impersonating!");
	}

	const currentAccount = event.locals.account;

	await deleteSession(event.locals.session.id);

	deleteImpersonateCookie(event);

	if (!currentAccount) {
		return redirect(303, "/");
	}

	return redirect(
		303,
		resolve("/admin/accounts/[username]", { username: currentAccount.username }),
	);
});
