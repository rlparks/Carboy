import { resolve } from "$app/paths";
import { form, getRequestEvent, query } from "$app/server";
import { deleteSession } from "$lib/server/auth";
import { deleteSessionCookie } from "$lib/server/auth/helpers";
import { redirect } from "@sveltejs/kit";

export const me = query(async () => {
	const { account, session } = getRequestEvent().locals;

	return { account, session };
});

export const logout = form(async () => {
	const event = getRequestEvent();
	if (!event.locals.security.isAuthenticated()) {
		return redirect(303, resolve("/"));
	}

	const sessionId = event.locals.session?.id;
	if (sessionId) {
		await deleteSession(sessionId);
	}

	deleteSessionCookie(event);

	return redirect(303, resolve("/"));
});
