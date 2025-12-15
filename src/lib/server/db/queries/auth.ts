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
		type AccountWithOrgs = FriendlyAccount & { organizations: { id: string; name: string }[] };
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
                (
                    SELECT COALESCE(json_agg(json_build_object('id', o.id, 'name', o.name) ORDER BY o.name), '[]'::json)
                    FROM organization o
                    INNER JOIN account_organization ao ON o.id = ao.organization_id
                    WHERE ao.account_id = a.id
                ) AS organizations
            FROM account a
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
