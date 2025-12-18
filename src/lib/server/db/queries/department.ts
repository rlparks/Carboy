import { generateTextId } from "$lib/server";
import { parsePgError } from "$lib/server/db/error";
import { sql } from "$lib/server/db/postgres";
import type { Department } from "$lib/types/db";

export async function getDepartmentsByOrganizationId(organizationId: string) {
	try {
		const rows = await sql<Department[]>`
            SELECT
                id,
                name,
                position,
                organization_id,
                created_at,
                updated_at
            FROM
                department
            WHERE
                organization_id = ${organizationId}
            ORDER BY
                position
        `;
		return rows;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function getDepartmentById(departmentId: string) {
	try {
		const [row] = await sql<Department[]>`
            SELECT
                id,
                name,
                position,
                organization_id,
                created_at,
                updated_at
            FROM
                department
            WHERE
                id = ${departmentId}
        `;
		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function getDepartmentByNameAndOrganizationId(name: string, organizationId: string) {
	try {
		const [row] = await sql<Department[]>`
            SELECT
                id,
                name,
                position,
                organization_id,
                created_at,
                updated_at
            FROM
                department
            WHERE
                name = ${name}
                AND organization_id = ${organizationId}
        `;
		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function getHighestDepartmentPosition(organizationId: string) {
	try {
		const [row] = await sql<{ max: number | null }[]>`
            SELECT
                MAX(position)::int AS max
            FROM
                department
            WHERE
                organization_id = ${organizationId}
        `;
		return row?.max ?? null;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function createDepartment(
	department: Omit<Department, "id" | "createdAt" | "updatedAt">,
) {
	const id = generateTextId();
	try {
		const [row] = await sql<Department[]>`
            INSERT INTO department (
                id,
                name,
                position,
                organization_id,
                created_at,
                updated_at
            ) VALUES (
                ${id},
                ${department.name},
                ${department.position},
                ${department.organizationId},
                NOW(),
                NULL
            )
            RETURNING
                id,
                name,
                position,
                organization_id,
                created_at,
                updated_at
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function updateDepartment(
	id: string,
	department: Omit<Department, "id" | "createdAt" | "updatedAt">,
) {
	try {
		const [row] = await sql<Department[]>`
            UPDATE department
            SET
                name = ${department.name},
                position = ${department.position},
                organization_id = ${department.organizationId},
                updated_at = NOW()
            WHERE
                id = ${id}
            RETURNING
                id,
                name,
                position,
                organization_id,
                created_at,
                updated_at
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function reorderDepartments(
	organizationId: string,
	departmentIdsInNewOrder: string[],
) {
	try {
		if (departmentIdsInNewOrder.length === 0) {
			return;
		}

		await sql`
            WITH new_order AS (
				SELECT * FROM UNNEST(${departmentIdsInNewOrder}::text[]) WITH ORDINALITY AS t(id, ord)
			)
			UPDATE department d
			SET position = n.ord - 1, updated_at = NOW()
			FROM new_order n
			WHERE d.id = n.id AND d.organization_id = ${organizationId};
        `;
	} catch (err) {
		throw parsePgError(err);
	}
}
