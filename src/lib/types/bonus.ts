import type { Account, Vehicle } from "$lib/types/db";

export type FriendlyAccount = Omit<Account, "passwordHash">;
export type AccountWithOrganizations = FriendlyAccount & {
	organizations: { id: string; name: string }[];
};

export type VehicleWithDepartment = Vehicle & {
	departmentName: string;
	departmentId: string;
};
