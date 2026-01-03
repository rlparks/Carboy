import { generateTextId } from "$lib/server";
import { parsePgError } from "$lib/server/db/error";
import { sql } from "$lib/server/db/postgres";
import type { DestinationWithCount } from "$lib/types/bonus";
import type { Destination } from "$lib/types/db";

export async function getDestinations() {
	try {
		const rows = await sql<DestinationWithCount[]>`
            SELECT
                id,
                name,
                short_name,
                address,
                latitude,
                longitude,
                created_at,
                updated_at,
                (
                    SELECT count(*)
                    FROM trip_destination
                    WHERE trip_destination.destination_id = destination.id
                )::int as trip_count
            FROM
                destination
            ORDER BY
                trip_count DESC, name
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

export async function updateDestination(
	id: string,
	destination: Omit<Destination, "id" | "createdAt" | "updatedAt">,
) {
	try {
		const [row] = await sql<Destination[]>`
            UPDATE destination
            SET
                name = ${destination.name},
                short_name = ${destination.shortName},
                address = ${destination.address},
                latitude = ${destination.latitude},
                longitude = ${destination.longitude},
                updated_at = NOW()
            WHERE id = ${id}
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

export async function mergeDestinations(finalDestinationId: string, oldDestinationIds: string[]) {
	if (oldDestinationIds.includes(finalDestinationId)) {
		throw new Error("Cannot merge destination into itself!");
	}

	try {
		await sql.begin(async (tx) => {
			await tx`
				DELETE FROM trip_destination
				WHERE
                    destination_id = ANY(${oldDestinationIds})
                    AND trip_id IN (
                        SELECT trip_id FROM trip_destination WHERE destination_id = ${finalDestinationId}
                    )
			;`;

			await tx`
                UPDATE trip_destination
                SET destination_id = ${finalDestinationId}
                WHERE destination_id = ANY(${oldDestinationIds})
            ;`;

			await tx`
                DELETE FROM destination
                WHERE id = ANY(${oldDestinationIds})
            ;`;
		});
	} catch (err) {
		throw parsePgError(err);
	}
}
