import type { Account, Destination, Trip, Vehicle } from "$lib/types/db";

export type FriendlyAccount = Omit<Account, "passwordHash">;
export type AccountWithOrganizations = FriendlyAccount & {
	organizations: { id: string; name: string }[];
};

export type VehicleWithDepartment = Vehicle & {
	departmentName: string;
	departmentId: string;
	organizationId: string;
	isCheckedOut: boolean;
	tripCount: number;
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

export type TripWithDestinations = TripWithVehicle & {
	destinations: Destination[];
	// TODO: note
};

export type DestinationWithCount = Destination & {
	tripCount: number;
};
