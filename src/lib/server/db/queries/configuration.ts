import { parsePgError } from "$lib/server/db/error";
import { sql } from "$lib/server/db/postgres";

type ConfigKey =
	| "oidcDiscoveryUrl"
	| "oidcClientId"
	| "oidcClientSecret"
	| "oidcUsernameClaim"
	| "signOutOfIdp"
	| "distanceWarningStart"
	| "distanceErrorStart";

export async function getValue(key: ConfigKey) {
	try {
		const [row] = await sql<
			{
				value: string;
			}[]
		>`
            SELECT value FROM configuration WHERE key = ${key}
        `;
		return row?.value;
	} catch (err) {
		parsePgError(err);
	}
}

export async function setValue(key: ConfigKey, value: string | null) {
	try {
		const now = new Date();
		await sql`
            INSERT INTO configuration (key, value, created_at, updated_at)
            VALUES (${key}, ${value}, ${now}, null)
            ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = ${now}
        `;
	} catch (err) {
		parsePgError(err);
	}
}
