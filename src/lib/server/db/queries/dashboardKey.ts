import { generateTextId } from "$lib/server";
import { parsePgError } from "$lib/server/db/error";
import { sql } from "$lib/server/db/postgres";
import type { DashboardKey } from "$lib/types/db";

export async function getDashboardKeys(organizationId?: string) {
	try {
		let query = sql<DashboardKey[]>`
            SELECT
                id,
                name,
                key,
                organization_id,
                created_at,
                updated_at
            FROM
                dashboard_key
            ORDER BY
                created_at DESC
        `;

		if (organizationId) {
			query = sql<DashboardKey[]>`
                SELECT
                    id,
                    name,
                    key,
                    organization_id,
                    created_at,
                    updated_at
                FROM
                    dashboard_key
                WHERE
                    organization_id = ${organizationId}
                ORDER BY
                    created_at DESC
            `;
		}

		const rows = await query;
		return rows;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function getDashboardKeyById(id: string) {
	try {
		const [row] = await sql<DashboardKey[]>`
            SELECT
                id,
                name,
                key,
                organization_id,
                created_at,
                updated_at
            FROM
                dashboard_key
            WHERE
                id = ${id}
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function getDashboardKeyByKey(key: string) {
	try {
		const [row] = await sql<DashboardKey[]>`
            SELECT
                id,
                name,
                key,
                organization_id,
                created_at,
                updated_at
            FROM
                dashboard_key
            WHERE
                key = ${key}
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function createDashboardKey(
	data: Omit<DashboardKey, "id" | "createdAt" | "updatedAt">,
) {
	try {
		const id = generateTextId();
		const [row] = await sql<DashboardKey[]>`
            INSERT INTO dashboard_key (id, name, key, organization_id, created_at, updated_at)
            VALUES (${id}, ${data.name}, ${data.key}, ${data.organizationId}, NOW(), NULL)
            RETURNING
                id,
                name,
                key,
                organization_id,
                created_at,
                updated_at
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function updateDashboardKey(id: string, data: { name: string }) {
	try {
		const [row] = await sql<DashboardKey[]>`
            UPDATE dashboard_key
            SET name = ${data.name}, updated_at = NOW()
            WHERE id = ${id}
            RETURNING
                id,
                name,
                key,
                organization_id,
                created_at,
                updated_at
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function deleteDashboardKey(id: string) {
	try {
		await sql`DELETE FROM dashboard_key WHERE id = ${id}`;
	} catch (err) {
		throw parsePgError(err);
	}
}
