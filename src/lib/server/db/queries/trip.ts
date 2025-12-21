import { generateTextId } from "$lib/server";
import { parsePgError } from "$lib/server/db/error";
import { sql } from "$lib/server/db/postgres";
import type { TripWithDestinations, TripWithVehicle } from "$lib/types/bonus";
import type { Trip, TripDestination } from "$lib/types/db";
import { error } from "@sveltejs/kit";

export type TripFilterOptions = {
	vehicleNumber?: string;
	organizationId?: string;
	startTimeFrom?: Date;
	startTimeTo?: Date;
	endTimeFrom?: Date | null;
	endTimeTo?: Date | null;
	distance?: number | null;
	distanceComparator?: "=" | "<" | ">" | "<=" | ">=";
	duration?: number;
	durationComparator?: "=" | "<" | ">" | "<=" | ">=";
	startedBy?: string;
	endedBy?: string | null;
	endedByDifferent?: boolean;
	limit?: number;
	offset?: number;
};

export async function getTrips(opts: TripFilterOptions = {}) {
	const vehicleNumber = opts.vehicleNumber
		? sql`t.vehicle_id = (SELECT id FROM vehicle WHERE number = ${opts.vehicleNumber})`
		: sql`TRUE`;

	const organizationId = opts.organizationId
		? sql`d.organization_id = ${opts.organizationId}`
		: sql`TRUE`;

	const startTimeFrom = opts.startTimeFrom ? sql`t.start_time >= ${opts.startTimeFrom}` : sql`TRUE`;

	const startTimeTo = opts.startTimeTo ? sql`t.start_time <= ${opts.startTimeTo}` : sql`TRUE`;

	const endTimeFrom = opts.endTimeFrom ? sql`t.end_time >= ${opts.endTimeFrom}` : sql`TRUE`;

	const endTimeTo = opts.endTimeTo ? sql`t.end_time <= ${opts.endTimeTo}` : sql`TRUE`;

	const distance =
		opts.distance !== undefined && opts.distanceComparator !== undefined
			? sql`t.distance ${opts.distanceComparator} ${opts.distance}`
			: sql`TRUE`;

	const duration =
		opts.duration !== undefined && opts.durationComparator !== undefined
			? sql`t.end_time - t.start_time ${opts.durationComparator} ${opts.duration}`
			: sql`TRUE`;

	const startedBy = opts.startedBy ? sql`s.username = ${opts.startedBy}` : sql`TRUE`;

	const endedBy = opts.endedBy !== undefined ? sql`e.username = ${opts.endedBy}` : sql`TRUE`;

	const endedByDifferent =
		opts.endedByDifferent !== undefined && !opts.endedByDifferent
			? sql`t.ended_by IS DISTINCT FROM t.started_by`
			: sql`TRUE`;

	try {
		const rows = await sql<TripWithVehicle[]>`
            SELECT
                t.id,
                t.vehicle_id,
                t.start_time,
                t.end_time,
                t.start_mileage,
                t.end_mileage,
                t.end_mileage - t.start_mileage AS distance,
                t.started_by,
                t.ended_by,
                t.created_at,
                t.updated_at,
                v.number AS vehicle_number,
                v.name AS vehicle_name,
                v.department_id AS department_id,
                d.name AS department_name,
                s.username AS started_by_username,
                s.name AS started_by_name,
                e.username AS ended_by_username,
                e.name AS ended_by_name
            FROM trip t
            INNER JOIN vehicle v ON t.vehicle_id = v.id
            INNER JOIN department d ON v.department_id = d.id
            INNER JOIN account s ON t.started_by = s.id
            LEFT JOIN account e ON t.ended_by = e.id
            WHERE ${vehicleNumber}
                AND ${organizationId}
                AND ${startTimeFrom}
                AND ${startTimeTo}
                AND ${endTimeFrom}
                AND ${endTimeTo}
                AND ${distance}
                AND ${duration}
                AND ${startedBy}
                AND ${endedBy}
                AND ${endedByDifferent}
            ORDER BY t.start_time DESC
            LIMIT ${opts.limit || 100}
            OFFSET ${opts.offset || 0} 
            ;`;

		return rows;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function getTripWithDestinations(tripId: string) {
	try {
		const [row] = await sql<TripWithDestinations[]>`
            SELECT
                t.id,
                t.vehicle_id,
                t.start_time,
                t.end_time,
                t.start_mileage,
                t.end_mileage,
                t.end_mileage - t.start_mileage AS distance,
                t.started_by,
                t.ended_by,
                t.created_at,
                t.updated_at,
                v.number AS vehicle_number,
                v.name AS vehicle_name,
                v.department_id AS department_id,
                d.name AS department_name,
                s.username AS started_by_username,
                s.name AS started_by_name,
                e.username AS ended_by_username,
                e.name AS ended_by_name,
                (
                    SELECT array_agg(
                        json_build_object(
                            'id', dest.id,
                            'name', dest.name,
                            'short_name', dest.short_name,
                            'address', dest.address,
                            'latitude', dest.latitude,
                            'longitude', dest.longitude,
                            'created_at', dest.created_at,
                            'updated_at', dest.updated_at
                        ) ORDER BY td.position
                    )
                    FROM trip_destination td
                    JOIN destination dest ON td.destination_id = dest.id
                    WHERE td.trip_id = t.id
                ) AS destinations
            FROM trip t
            INNER JOIN vehicle v ON t.vehicle_id = v.id
            INNER JOIN department d ON v.department_id = d.id
            INNER JOIN account s ON t.started_by = s.id
            LEFT JOIN account e ON t.ended_by = e.id
            WHERE t.id = ${tripId}
        ;`;

		return row;
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function checkoutVehicle(
	startedById: string,
	vehicleId: string,
	destinationIds: string[],
	note: string | undefined,
) {
	const now = new Date();
	try {
		await sql.begin(async (tx) => {
			const [newTrip] = await tx<Trip[]>`
                INSERT INTO trip (id, vehicle_id, start_time, end_time, start_mileage, end_mileage, started_by, ended_by, created_at, updated_at)
                VALUES (
                    ${generateTextId()},
                    ${vehicleId},
                    ${now},
                    NULL,
                    (SELECT mileage FROM vehicle WHERE id = ${vehicleId}),
                    NULL,
                    ${startedById},
                    NULL,
                    ${now},
                    NULL
                )
                RETURNING id, vehicle_id, start_time, end_time, start_mileage, end_mileage, started_by, ended_by, created_at, updated_at
            ;`;

			if (!newTrip) {
				return error(500, "Unable to create trip");
			}

			for (let i = 0; i < destinationIds.length; i++) {
				const destinationId = destinationIds[i]!;
				const tripDestination = await tx<TripDestination[]>`
                    INSERT INTO trip_destination (trip_id, destination_id, position, created_at, updated_at)
                    VALUES (${newTrip.id}, ${destinationId}, ${i}, ${now}, NULL)
                    RETURNING trip_id, destination_id, position, created_at, updated_at
                ;`;

				if (!tripDestination) {
					return error(500, "Unable to create trip destination");
				}
			}

			if (note) {
				// TODO: create note :)
			}
		});
	} catch (err) {
		throw parsePgError(err);
	}
}

export async function checkinVehicle(
	endedById: string,
	tripId: string,
	endMileage: number | null,
	destinationIds: string[],
	note: string | undefined,
) {
	const now = new Date();
	try {
		await sql.begin(async (tx) => {
			const [updatedTrip] = await tx<Trip[]>`
                UPDATE trip SET
                    end_time = ${now},
                    end_mileage = ${endMileage},
                    ended_by = ${endedById},
                    updated_at = ${now}
                WHERE id = ${tripId}
                RETURNING id, vehicle_id, start_time, end_time, start_mileage, end_mileage, started_by, ended_by, created_at, updated_at
            ;`;

			if (!updatedTrip) {
				return error(500, "Unable to update trip");
			}

			await tx`
                UPDATE vehicle SET
                    mileage = ${endMileage}
                WHERE id = ${updatedTrip.vehicleId}
            ;`;

			await tx`
                DELETE FROM trip_destination
                WHERE trip_id = ${updatedTrip.id}
            ;`;

			for (let i = 0; i < destinationIds.length; i++) {
				const destinationId = destinationIds[i]!;
				const tripDestination = await tx<TripDestination[]>`
                    INSERT INTO trip_destination (trip_id, destination_id, position, created_at, updated_at)
                    VALUES (${updatedTrip.id}, ${destinationId}, ${i}, ${now}, NULL)
                    RETURNING trip_id, destination_id, position, created_at, updated_at
                ;`;

				if (!tripDestination) {
					return error(500, "Unable to create trip destination");
				}
			}

			if (note) {
				// TODO: create note :)
			}
		});
	} catch (err) {
		throw parsePgError(err);
	}
}
