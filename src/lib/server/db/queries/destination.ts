import { generateTextId } from "$lib/server";
import { parsePgError } from "$lib/server/db/error";
import { sql } from "$lib/server/db/postgres";
import type { Destination } from "$lib/types/db";

export async function getDestinations() {
	try {
		const rows = await sql<Destination[]>`
            SELECT
                id,
                name,
                short_name,
                address,
                latitude,
                longitude,
                created_at,
                updated_at
            FROM
                destination
            ORDER BY
                created_at DESC
        `;

		return rows;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function getDestinationById(id: string) {
	try {
		const [row] = await sql<Destination[]>`
            SELECT
                id,
                name,
                short_name,
                address,
                latitude,
                longitude,
                created_at,
                updated_at
            FROM
                destination
            WHERE
                id = ${id}
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function getDestinationByName(name: string) {
	try {
		const [row] = await sql<Destination[]>`
            SELECT
                id,
                name,
                short_name,
                address,
                latitude,
                longitude,
                created_at,
                updated_at
            FROM
                destination
            WHERE
                name = ${name}
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function createDestination(
	destination: Omit<Destination, "id" | "createdAt" | "updatedAt">,
) {
	const id = generateTextId();
	try {
		const [row] = await sql<Destination[]>`
            INSERT INTO destination (id, name, short_name, address, latitude, longitude, created_at, updated_at)
            VALUES (${id}, ${destination.name}, ${destination.shortName}, ${destination.address}, ${destination.latitude}, ${destination.longitude}, NOW(), NULL)
            RETURNING
                id,
                name,
                short_name,
                address,
                latitude,
                longitude,
                created_at,
                updated_at
        `;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}
