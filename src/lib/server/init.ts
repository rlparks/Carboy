import { runMigrations } from "$lib/server/db/migrate";

export async function initCarboy() {
	console.log("Server initializing...");
	await runMigrations();
}
