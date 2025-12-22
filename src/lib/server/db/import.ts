import { generateTextId } from "$lib/server";
import { sql } from "$lib/server/db/postgres";
import { createAccount } from "$lib/server/db/queries/account";
import {
	createDepartment,
	getDepartmentsByOrganizationId,
	getHighestDepartmentPosition,
} from "$lib/server/db/queries/department";
import { createDestination } from "$lib/server/db/queries/destination";
import { createVehicle } from "$lib/server/db/queries/vehicle";
import type { Trip } from "$lib/types/db";
import { readFile } from "fs/promises";

export async function importCarboy() {
	const vehiclePath = "";
	const userPath = "";
	const orgId = "";

	const uFile = await readFile(userPath);
	const uJson = JSON.parse(uFile.toString()) as Carboy1User[];

	// from old id to new id
	const accounts = new Map<string, string>();

	for (const u of uJson) {
		console.log(u);
		const newAccount = await createAccount({
			archived: u.disabled ?? false,
			email: `${u.username}@uga.edu`,
			name: u.fullName,
			passwordEnabled: false,
			passwordHash: null,
			role: null,
			username: u.username,
		});

		if (newAccount) {
			accounts.set(u._id, newAccount.id);
		}
	}

	const vFile = await readFile(vehiclePath);
	const str = vFile.toString();
	const json = JSON.parse(str) as Carboy1Vehicle[];

	const oldDepartments = json.map((v) => v.department);
	for (const dept of oldDepartments) {
		try {
			await createDepartment({
				name: dept,
				organizationId: orgId,
				position: ((await getHighestDepartmentPosition(orgId)) ?? -1) + 1,
			});
		} catch {
			// do nothing
		}
	}

	const departments = await getDepartmentsByOrganizationId(orgId);

	for (const v of json) {
		const newV = await createVehicle({
			hasImage: false,
			archived: false,
			name: `${v.year ?? ""} ${v.make} ${v.model}`.trim(),
			number: String(v.vehicleNumber),
			mileage: v.mileage,
			departmentId: departments.find((d) => d.name === v.department)!.id,
		});

		if (!newV) {
			throw new Error("e");
		}

		const vehicleDestinations = v.trips.map((t) => t.destination);

		for (const d of vehicleDestinations) {
			try {
				await createDestination({
					address: null,
					latitude: null,
					longitude: null,
					name: d,
					shortName: null,
				});
			} catch {
				// do nothing
			}
		}

		console.log("here");
		await sql.begin(async (tx) => {
			for (const trip of v.trips) {
				console.log(trip);
				const [newTrip] = await tx<Trip[]>`
                    INSERT INTO trip (id, vehicle_id, start_time, end_time, start_mileage, end_mileage, started_by, ended_by, created_at, updated_at)
                    VALUES (${generateTextId()}, ${newV.id}, ${new Date(trip.startTime)}, ${trip.endTime ? new Date(trip.endTime) : null}, ${trip.startMileage ?? null}, ${trip.endMileage ?? null}, ${accounts.get(trip.employee[0] || "") ?? null}, ${accounts.get(trip.employee[1] || "") ?? null}, NOW(), NULL)
                    RETURNING id, vehicle_id, start_time, end_time, start_mileage, end_mileage, started_by, ended_by
                ;`;

				if (!newTrip) {
					throw new Error("no trip!");
				}

				await tx`
                    INSERT INTO trip_destination (trip_id, destination_id, position, created_at, updated_at)
                    VALUES (${newTrip.id}, (SELECT id FROM destination WHERE name = ${trip.destination}), 0, NOW(), NULL)
                ;`;
			}
		});
	}
}

type Carboy1Vehicle = {
	_id: string;
	vehicleNumber: number;
	make: string;
	model: string;
	year: string | null;
	licensePlate: string;
	pictureUrl: string;
	checkedOut: boolean;
	mileage: number | null;
	department: string;
	trips: Carboy1Trip[];
	__v: number;
	disabled: boolean;
	currentUserId: string | null;
};

type Carboy1Trip = {
	startTime: string;
	endTime: string | null;
	startMileage: number | null;
	endMileage: number | null;
	destination: string;
	employee: string[];
	vehicleNumber: string;
	_id: string;
};

type Carboy1User = {
	_id: string;
	username: string;
	admin: boolean;
	fullName: string;
	__v: number;
	disabled: boolean;
};
