import { generateTextId } from "$lib/server";
import type { Role } from "$lib/server/auth/Security";
import { sql } from "$lib/server/db/postgres";
import type { FriendlyAccount } from "$lib/types/bonus";
import type { Session } from "$lib/types/db";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const SESSION_DURATION = DAY_IN_MS * 30;
const SESSION_RENEWAL = DAY_IN_MS * 7;

export const sessionCookieName = "carboy-session";
export const impersonateCookieName = "carboy-impersonate-session";

export async function createSession(
	accountId: string,
	organizationId: string | null,
	oidcIdToken: string | null,
	impersonatedBy: string | null,
) {
	const token = generateSessionToken();
	const tokenHash = hashToken(token);

	const now = new Date();
	const newSession: Omit<Session, "id"> = {
		accountId,
		selectedOrganizationId: organizationId,
		tokenHash,
		createdAt: now,
		updatedAt: null,
		expiresAt: new Date(now.getTime() + SESSION_DURATION),
		oidcIdToken,
		impersonatedBy,
	};

	const id = generateTextId();
	await sql`
        INSERT INTO session
            (id, account_id, selected_organization_id, token_hash, created_at, updated_at, expires_at, oidc_id_token, impersonated_by)
        VALUES
            (${id}, ${newSession.accountId}, ${newSession.selectedOrganizationId}, ${newSession.tokenHash}, ${newSession.createdAt}, ${newSession.updatedAt}, ${newSession.expiresAt}, ${newSession.oidcIdToken}, ${newSession.impersonatedBy})
    ;`;

	return { token, session: newSession };
}

type ValidationSelectResult = {
	sessionId: string;
	accountId: string;
	sessionCreatedAt: Date;
	sessionUpdatedAt: Date | null;
	sessionExpiresAt: Date;
	sessionImpersonatedBy: string | null;
	sessionOidcIdToken: string;
	sessionSelectedOrganizationId: string | null;

	accountEmail: string;
	accountUsername: string;
	accountCreatedAt: Date;
	accountUpdatedAt: Date | null;
	accountRole: Role | null;
	accountName: string;
	accountArchived: boolean;
	accountPasswordEnabled: boolean;
};

const noSession = {
	session: null,
	account: null,
};

export async function validateSessionToken(token: string) {
	const tokenHash = hashToken(token);
	const row = await getSessionAccountByTokenHash(tokenHash);
	const { session, account } = extractSessionAccount(row, tokenHash);

	if (!session || !account) {
		return noSession;
	}

	const now = new Date();
	const sessionExpired = now > session.expiresAt;
	if (sessionExpired) {
		await deleteSession(session.id);
		return noSession;
	}

	const renewSession = now.getTime() > session.expiresAt.getTime() - SESSION_RENEWAL;
	if (renewSession) {
		const newExpiry = new Date(now.getTime() + SESSION_DURATION);
		await updateSessionExpiry(session.id, newExpiry);
		session.expiresAt = newExpiry;
	}

	return { session, account };
}

function extractSessionAccount(row: ValidationSelectResult | undefined, tokenHash: string) {
	if (!row) {
		return noSession;
	}

	const session: Session = {
		id: row.sessionId,
		accountId: row.accountId,
		tokenHash,
		createdAt: row.sessionCreatedAt,
		updatedAt: row.sessionUpdatedAt,
		expiresAt: row.sessionExpiresAt,
		impersonatedBy: row.sessionImpersonatedBy,
		oidcIdToken: row.sessionOidcIdToken,
		selectedOrganizationId: row.sessionSelectedOrganizationId,
	};

	const account: FriendlyAccount = {
		id: row.accountId,
		email: row.accountEmail,
		username: row.accountUsername,
		createdAt: row.accountCreatedAt,
		updatedAt: row.accountUpdatedAt,
		role: row.accountRole,
		name: row.accountName,
		archived: row.accountArchived,
		passwordEnabled: row.accountPasswordEnabled,
	};

	return { session, account };
}

async function getSessionAccountByTokenHash(tokenHash: string) {
	const [row] = await sql<ValidationSelectResult[]>`
        SELECT
            s.id AS session_id,
            a.id AS account_id,
            s.created_at AS session_created_at,
            s.updated_at AS session_updated_at,
            s.expires_at AS session_expires_at,
            s.oidc_id_token AS session_oidc_id_token,
            s.selected_organization_id AS session_selected_organization_id,
            s.impersonated_by AS session_impersonated_by,
            a.email AS account_email,
            a.username AS account_username,
            a.created_at AS account_created_at,
            a.updated_at AS account_updated_at,
            a.role AS account_role,
            a.name AS account_name,
            a.archived AS account_archived,
            a.password_enabled AS account_password_enabled
        FROM session s
        INNER JOIN account a ON s.account_id = a.id
        WHERE s.token_hash = ${tokenHash}
    ;`;

	return row;
}

export async function deleteSession(sessionId: string) {
	await sql`
        DELETE FROM session
        WHERE id = ${sessionId}
    ;`;
}

async function updateSessionExpiry(sessionId: string, expiresAt: Date) {
	await sql`
        UPDATE session
        SET expires_at = ${expiresAt}
        WHERE id = ${sessionId}
    ;`;
}

function generateSessionToken() {
	return generateTextId();
}

function hashToken(token: string) {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}
