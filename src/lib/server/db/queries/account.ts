import { parsePgError } from "$lib/server/db/error";
import { sql } from "$lib/server/db/postgres";
import type { FriendlyAccount } from "$lib/types/bonus";

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

export async function getAccountWithOrgsByUsername(username: string) {
	try {
		type AccountWithOrgs = FriendlyAccount & { organizationIds: string[] };
		const [row] = await sql<AccountWithOrgs[]>`
            SELECT 
                a.id,
                a.name,
                a.email,
                a.username,
                a.role,
                a.created_at,
                a.updated_at,
                a.archived,
                a.password_enabled,
                COALESCE(
                  ARRAY_AGG(ao.organization_id) FILTER (WHERE ao.organization_id IS NOT NULL),
                  ARRAY[]::text[]
                ) AS "organization_ids"
            FROM account a
            LEFT JOIN account_organization ao ON a.id = ao.account_id
            WHERE a.username = ${username}
            GROUP BY a.id;
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function getAccountByUsernameOrEmail(usernameOrEmail: string) {
	try {
		const [row] = await sql<FriendlyAccount[]>`
            SELECT 
                id,
                name,
                email,
                username,
                role,
                created_at,
                updated_at,
                archived,
                password_enabled
            FROM account
            WHERE username = ${usernameOrEmail} OR email = ${usernameOrEmail};
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function getAccountPasswordHashById(accountId: string) {
	try {
		const [row] = await sql<{ passwordHash: string | null }[]>`
            SELECT 
                password_hash
            FROM account
            WHERE id = ${accountId};
        `;

		return row?.passwordHash ?? null;
	} catch (err) {
		throw parsePgError(err);
	}
}
