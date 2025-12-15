import { parsePgError } from "$lib/server/db/error";
import { sql } from "$lib/server/db/postgres";

export async function updateSelectedOrganization(sessionId: string, organizationId: string | null) {
	try {
		await sql`
            UPDATE session
            SET selected_organization_id = ${organizationId}
            WHERE id = ${sessionId}
        ;`;
	} catch (err) {
		throw parsePgError(err);
	}
}
