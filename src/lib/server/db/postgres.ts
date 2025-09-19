import { building } from "$app/environment";
import { env } from "$env/dynamic/private";
import postgres from "postgres";

if (!env.POSTGRES_URL && !building) {
	console.error("POSTGRES_URL is not set! Web requests will fail.");
}

export const sql = postgres(env.POSTGRES_URL ?? "", { transform: postgres.camel });
