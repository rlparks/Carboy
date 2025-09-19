import { parsePgError } from "$lib/server/db/error";
import { sql } from "$lib/server/db/postgres";

export async function getAccountCount() {
	try {
		const [row] = await sql<{ count: string }[]>`
                SELECT COUNT(*) AS count
                FROM account;
            `;
		return parseInt(row?.count ?? "");
	} catch (err) {
		throw parsePgError(err);
	}
}
