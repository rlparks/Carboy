import type { Account } from "$lib/types/db";

export type FriendlyAccount = Omit<Account, "passwordHash">;
