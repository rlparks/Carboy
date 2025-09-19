import { generateTextId } from "$lib/server";
import { sql } from "$lib/server/db/postgres";
const migrationFiles = import.meta.glob("./schema/postgres/*.sql", { query: "?raw" });

type Migration = {
	id: string;
	name: string;
	createdAt: Date;
};

export async function runMigrations() {
	await createMigrationsTableIfNotDefined();

	const appliedMigrations = await getAppliedMigrations();

	const sortedMigrationFileNames = Object.keys(migrationFiles).toSorted();

	for (const filePath of sortedMigrationFileNames) {
		if (!appliedMigrations.includes(filePath)) {
			const file = await getFileContents(filePath);
			await applyMigration(file, filePath);
			console.log(`Applied migration: ${filePath}`);
		}
	}
}

async function createMigrationsTableIfNotDefined() {
	try {
		await sql`
            CREATE TABLE migration (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                created_at TIMESTAMPTZ NOT NULL
            );
    `;
	} catch (err) {
		if (!(err instanceof Error && err.message.includes('relation "migration" already exists'))) {
			console.error(`Error creating migrations table: ${err}`);
		}
	}
}

async function getFileContents(filePath: string) {
	const file = (await migrationFiles[filePath]?.()) as { default: string };
	return file.default;
}

async function applyMigration(sqlString: string, filePath: string) {
	await sql.begin(async (sql) => {
		await sql.unsafe(sqlString);

		const id = generateTextId();
		await sql`
            INSERT INTO migration (id, name, created_at)
            VALUES (${id}, ${filePath}, NOW())
        `;
	});
}

async function getAppliedMigrations() {
	const migrations = await sql<Migration[]>`
        SELECT id, name, created_at
        FROM migration
        ORDER BY name
    `;

	const appliedMigrations = migrations.map((migration) => migration.name);

	return appliedMigrations;
}
