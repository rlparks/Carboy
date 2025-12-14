import type { Account } from "$lib/types/db";

export type FriendlyAccount = Omit<Account, "passwordHash">;
export type AccountWithOrganizations = FriendlyAccount & {
	organizations: { id: string; name: string }[];
};
