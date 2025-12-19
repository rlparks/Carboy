import type { Account, Trip, Vehicle } from "$lib/types/db";

export type FriendlyAccount = Omit<Account, "passwordHash">;
export type AccountWithOrganizations = FriendlyAccount & {
	organizations: { id: string; name: string }[];
};

export type VehicleWithDepartment = Vehicle & {
	departmentName: string;
	departmentId: string;
};

export type TripWithVehicle = Trip & {
	vehicleNumber: string;
	vehicleName: string;
	vehicleId: string;
	departmentName: string;
	departmentId: string;
	distance: number | null;
	startedByUsername: string;
	startedByName: string;
	endedByUsername: string | null;
	endedByName: string | null;
};
