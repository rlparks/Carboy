import { generateRandomString } from "@oslojs/crypto/random";

export const INITIAL_ADMIN_ID_TOKEN = "initial-admin-token";
const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateTextId(length = 21): string {
	return generateRandomString({ read: (bytes) => crypto.getRandomValues(bytes) }, alphabet, length);
}
