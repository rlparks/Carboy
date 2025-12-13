import type { Role } from "$lib/server/auth/Security";

export type Organization = {
	id: string;
	name: string;
	slug: string;
	createdAt: Date;
	updatedAt: Date | null;
};

export type Account = {
	id: string;
	name: string;
	email: string;
	username: string;
	role: Role | null;
	archived: boolean;
	passwordHash: string | null;
	passwordEnabled: boolean;
	createdAt: Date;
	updatedAt: Date | null;
};

export type AccountOrganization = {
	accountId: string;
	organizationId: string;
	createdAt: Date;
	updatedAt: Date | null;
};

export type Session = {
	id: string;
	accountId: string;
	tokenHash: string;
	createdAt: Date;
	updatedAt: Date | null;
	expiresAt: Date;
	oidcIdToken: string | null;
	impersonatedBy: string | null;
	selectedOrganizationId: string | null;
};

export type Department = {
	id: string;
	name: string;
	organizationId: string;
	position: number;
	createdAt: Date;
	updatedAt: Date | null;
};

export type Vehicle = {
	id: string;
	number: string;
	name: string;
	departmentId: string;
	mileage: number | null;
	createdAt: Date;
	updatedAt: Date | null;
};

export type Destination = {
	id: string;
	name: string;
	shortName: string | null;
	address: string | null;
	latitude: number | null;
	longitude: number | null;
	createdAt: Date;
	updatedAt: Date | null;
};

export type Trip = {
	id: string;
	vehicleId: string;
	startTime: Date;
	endTime: Date | null;
	startMileage: number | null;
	endMileage: number | null;
	startedBy: string;
	endedBy: string | null;
	createdAt: Date;
	updatedAt: Date | null;
};

export type TripDestination = {
	tripId: string;
	destinationId: string;
	position: number;
	createdAt: Date;
	updatedAt: Date | null;
};

export type Configuration = {
	key: string;
	value: string | null;
	createdAt: Date;
	updatedAt: Date | null;
};
