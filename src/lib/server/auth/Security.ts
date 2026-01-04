import { updateSelectedOrganization } from "$lib/server/db/queries/session";
import type { FriendlyAccount } from "$lib/types/bonus";
import type { Organization, Session } from "$lib/types/db";
import { error, redirect, type RequestEvent } from "@sveltejs/kit";

export const ROLES = ["superadmin", "admin"] as const;
export type Role = (typeof ROLES)[number];

export default class Security {
	private readonly account: FriendlyAccount | null;
	private readonly session: Session | null;
	private readonly accountOrganizations: Organization[];
	private readonly event: RequestEvent;

	constructor(event: RequestEvent) {
		this.event = event;

		this.account = event.locals.account;
		this.session = event.locals.session;
		this.accountOrganizations = event.locals.accountOrganizations;
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

	async enforceOrganization(organizationId: string) {
		this.enforceAuthenticated();

		if (!this.account || !this.session) {
			return error(401, "You are not authenticated. Try logging in.");
		}

		if (!this.accountOrganizations.some((org) => org.id === organizationId)) {
			return error(403, "You do not have permission to access this resource.");
		}

		if (this.session.selectedOrganizationId !== organizationId) {
			this.session.selectedOrganizationId = organizationId;
			await updateSelectedOrganization(this.session.id, organizationId);

			if (
				this.event.request.method === "GET" &&
				!this.event.isDataRequest &&
				!this.event.isRemoteRequest &&
				!this.event.isSubRequest
			) {
				return redirect(303, this.event.request.url);
			}
		}

		return this;
	}
}
