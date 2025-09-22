import type { Account } from "$lib/types/db";
import { error } from "@sveltejs/kit";

export const ROLES = ["superadmin", "admin"] as const;
export type Role = (typeof ROLES)[number];

export default class Security {
	private readonly account: Account | null;

	constructor(account: Account | null) {
		this.account = account;
	}

	isAuthenticated() {
		return Boolean(this.account);
	}

	hasRole(role: Role) {
		if (!this.account) {
			return false;
		}

		if (this.account.role === "superadmin") {
			return true;
		}

		return this.account.role === role;
	}

	enforceAuthenticated() {
		if (!this.isAuthenticated()) {
			return error(401, "You are not authenticated. Try logging in.");
		}

		return this;
	}

	enforceRole(role: Role) {
		this.enforceAuthenticated();

		if (!this.hasRole(role)) {
			return error(403, "You do not have permission to access this resource.");
		}

		return this;
	}
}
