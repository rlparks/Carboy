import ForeignKeyViolation from "./ForeignKeyViolation";
import PostgresConnectionError from "./PostgresConnectionError";
import UniqueConstraintViolation from "./UniqueConstraintViolation";

export function parsePgError(err: unknown) {
	const uniqueViolation = parseUniqueViolation(err);

	if (uniqueViolation) {
		if (uniqueViolation.columnViolated) {
			return new UniqueConstraintViolation(
				uniqueViolation.columnViolated,
				uniqueViolation.contents,
			);
		} else {
			return new UniqueConstraintViolation("unknown");
		}
	}

	const foreignKeyViolation = parseForeignKeyViolation(err);
	if (foreignKeyViolation) {
		if (foreignKeyViolation.columnViolated) {
			return new ForeignKeyViolation(
				foreignKeyViolation.table,
				foreignKeyViolation.columnViolated,
				foreignKeyViolation.contents,
			);
		} else {
			return new ForeignKeyViolation("unknown", "unknown", "unknown");
		}
	}

	console.log(err);

	return new PostgresConnectionError();
}

function parseUniqueViolation(err: unknown) {
	if (err instanceof Error && err.message.includes("duplicate")) {
		if (
			"detail" in err &&
			typeof err.detail === "string" &&
			err.detail.includes("already exists")
		) {
			return parseColumnViolatedAndContents(err.detail);
		} else {
			return {
				columnViolated: undefined,
				contents: undefined,
			};
		}
	}
	return undefined;
}

function parseForeignKeyViolation(err: unknown) {
	if (err instanceof Error && err.message.includes("violates foreign key constraint")) {
		if (
			"detail" in err &&
			typeof err.detail === "string" &&
			err.detail.includes("is not present in table")
		) {
			const columnAndContents = parseColumnViolatedAndContents(err.detail);
			const tableQuoteStartIndex = err.detail.indexOf('"');
			const tableQuoteEndIndex = err.detail.indexOf('"', tableQuoteStartIndex + 1);
			const table = err.detail.substring(tableQuoteStartIndex + 1, tableQuoteEndIndex);

			return { ...columnAndContents, table };
		} else {
			return { table: undefined, columnViolated: undefined, contents: undefined };
		}
	}

	return undefined;
}

function parseColumnViolatedAndContents(detail: string) {
	// detail: 'Key (username)=(f749e608-76e5-4394-9d88-24c7a9aa9575) already exists.',
	const firstOpenParenIndex = detail.indexOf("(");
	const firstCloseParenIndex = detail.indexOf(")");

	const secondOpenParenIndex = detail.indexOf("(", firstCloseParenIndex);
	const secondCloseParenIndex = detail.indexOf(")", secondOpenParenIndex);

	const columnViolated = detail.substring(firstOpenParenIndex + 1, firstCloseParenIndex);
	const contents = detail.substring(secondOpenParenIndex + 1, secondCloseParenIndex);

	return { columnViolated, contents };
}
