import { getAccountCount } from "$lib/server/db/queries/auth";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
	const numberOfAccounts = await getAccountCount();
	if (numberOfAccounts > 0) {
		return error(400, "Setup has already been completed.");
	}
}) satisfies PageServerLoad;
