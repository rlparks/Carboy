import { generateTextId } from "$lib/server";
import { parsePgError } from "$lib/server/db/error";
import { sql } from "$lib/server/db/postgres";
import type { Organization } from "$lib/types/db";

export async function getOrganizations() {
	try {
		const rows = await sql<Organization[]>`
            SELECT id, name, slug, created_at, updated_at
            FROM organization
            ORDER BY name ASC
            ;`;
		return rows;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function createOrganization(
	organization: Omit<Organization, "id" | "createdAt" | "updatedAt">,
) {
	const id = generateTextId();
	const now = new Date();

	try {
		await sql`
            INSERT INTO organization (id, name, slug, created_at, updated_at)
            VALUES (${id}, ${organization.name}, ${organization.slug}, ${now}, NULL)
            ;`;
	} catch (err) {
		throw parsePgError(err);
	}
}
