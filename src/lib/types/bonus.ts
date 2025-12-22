import type { Account, Destination, Trip, TripNote, Vehicle } from "$lib/types/db";

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
	vehicleHasImage: boolean;
	vehicleId: string;
	departmentName: string;
	departmentId: string;
	organizationId: string;
	distance: number | null;
	startedByUsername: string;
	startedByName: string;
	endedByUsername: string | null;
	endedByName: string | null;
	noteCount: number;
	destinations: string;
};

export type TripNoteWithAuthor = TripNote & {
	authorUsername: string;
	authorName: string;
};

export type TripWithDestinations = TripWithVehicle & {
	destinations: Destination[];
	notes: TripNoteWithAuthor[];
};

export type DestinationWithCount = Destination & {
	tripCount: number;
};
