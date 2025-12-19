import { getRequestEvent, query } from "$app/server";
import { sql } from "$lib/server/db/postgres";
import type { Destination } from "$lib/types/db";
import { error } from "@sveltejs/kit";
import * as v from "valibot";

export const searchDestinations = query(v.string(), async (query) => {
	const event = getRequestEvent();
	event.locals.security.enforceAuthenticated();

	try {
		const rows = await sql<Destination[]>`
            SELECT
                id,
                name,
                short_name,
                address,
                latitude,
                longitude,
                created_at,
                updated_at
            FROM destination
            WHERE
                name ILIKE ${"%" + query + "%"} OR
                short_name ILIKE ${"%" + query + "%"}
            LIMIT 5
            ;`;

		return rows;
	} catch (err) {
		console.error(err);
		return error(500, "Unable to search.");
	}
});
