import { resolve } from "$app/paths";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("superadmin");

	const { editAccount } = await event.parent();

	if (!editAccount.passwordEnabled) {
		return redirect(303, resolve("/admin/accounts/[username]", { username: editAccount.username }));
	}
}) satisfies PageServerLoad;
