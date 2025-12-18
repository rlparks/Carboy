import { generateTextId } from "$lib/server";
import { parsePgError } from "$lib/server/db/error";
import { sql } from "$lib/server/db/postgres";
import type { Vehicle } from "$lib/types/db";

export async function getVehiclesByOrganizationId(organizationId: string) {
	try {
		const rows = await sql<Vehicle[]>`
            SELECT
                v.id,
                v.number,
                v.name,
                v.department_id,
                v.mileage,
                v.created_at,
                v.updated_at
            FROM
                vehicle v
            JOIN
                department d ON v.department_id = d.id
            WHERE
                d.organization_id = ${organizationId}
            ORDER BY
                v.created_at DESC
        `;

		return rows;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function getVehicleById(id: string) {
	try {
		const [row] = await sql<Vehicle[]>`
            SELECT
                id,
                number,
                name,
                department_id,
                mileage,
                created_at,
                updated_at
            FROM
                vehicle
            WHERE
                id = ${id}
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function getVehicleByNumber(number: string) {
	try {
		const [row] = await sql<Vehicle[]>`
            SELECT
                id,
                number,
                name,
                department_id,
                mileage,
                created_at,
                updated_at
            FROM
                vehicle
            WHERE
                number = ${number}
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function createVehicle(vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">) {
	const id = generateTextId();
	try {
		const [row] = await sql<Vehicle[]>`
            INSERT INTO vehicle (id, number, name, department_id, mileage, created_at, updated_at)
            VALUES (${id}, ${vehicle.number}, ${vehicle.name}, ${vehicle.departmentId}, ${vehicle.mileage}, NOW(), NULL)
            RETURNING
                id,
                number,
                name,
                department_id,
                mileage,
                created_at,
                updated_at
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function updateVehicle(
	id: string,
	vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">,
) {
	try {
		const [row] = await sql<Vehicle[]>`
            UPDATE vehicle
            SET
                number = ${vehicle.number},
                name = ${vehicle.name},
                department_id = ${vehicle.departmentId},
                mileage = ${vehicle.mileage},
                updated_at = NOW()
            WHERE
                id = ${id}
            RETURNING
                id,
                number,
                name,
                department_id,
                mileage,
                created_at,
                updated_at
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}
