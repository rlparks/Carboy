import { parsePgError } from "$lib/server/db/error";
import { sql } from "$lib/server/db/postgres";
import type { AccountWithOrganizations, FriendlyAccount } from "$lib/types/bonus";
import type { Account } from "$lib/types/db";

export async function getAccounts() {
	try {
		const rows = await sql<AccountWithOrganizations[]>`
            SELECT 
                id,
                name,
                email,
                username,
                role,
                created_at,
                updated_at,
                archived,
                password_enabled,
                (
                    SELECT COALESCE(json_agg(json_build_object('id', o.id, 'name', o.name) ORDER BY o.name), '[]'::json)
                    FROM organization o
                    INNER JOIN account_organization ao ON o.id = ao.organization_id
                    WHERE ao.account_id = a.id
                ) AS organizations
            FROM account a
            ORDER BY created_at DESC;
        `;

		return rows;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function getAccountsInOrganization(organizationId: string) {
	try {
		const rows = await sql<AccountWithOrganizations[]>`
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
            INNER JOIN account_organization ao ON a.id = ao.account_id
            WHERE ao.organization_id = ${organizationId}
            ORDER BY a.created_at DESC;
        `;

		return rows;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function getAccountWithOrgsById(id: string) {
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
            WHERE a.id = ${id}
            GROUP BY a.id;
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function updateAccount(
	account: Omit<Account, "passwordHash" | "createdAt" | "updatedAt">,
) {
	try {
		await sql`
            UPDATE account
            SET 
                name = ${account.name},
                email = ${account.email},
                username = ${account.username},
                role = ${account.role},
                archived = ${account.archived},
                password_enabled = ${account.passwordEnabled},
                updated_at = NOW()
            WHERE id = ${account.id}
        `;
	} catch (err) {
		throw parsePgError(err);
	}
}
