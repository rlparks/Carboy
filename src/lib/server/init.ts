import { runMigrations } from "$lib/server/db/migrate";

export async function initEmber() {
	console.log("Server initializing...");
	await runMigrations();
}
