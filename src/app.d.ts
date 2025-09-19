// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Account, Session } from "$lib/types/db";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session | null;
			account: Account | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
