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

export async function getOrganizationsByAccountId(accountId: string) {
	try {
		const rows = await sql<Organization[]>`
            SELECT o.id, o.name, o.slug, o.created_at, o.updated_at
            FROM organization o
            INNER JOIN account_organization ao ON ao.organization_id = o.id
            WHERE ao.account_id = ${accountId}
            ORDER BY o.name ASC
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
