import type { FriendlyAccount } from "$lib/types/bonus";
import { error } from "@sveltejs/kit";

export const ROLES = ["superadmin", "admin"] as const;
export type Role = (typeof ROLES)[number];

export default class Security {
	private readonly account: FriendlyAccount | null;

	constructor(account: FriendlyAccount | null) {
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
