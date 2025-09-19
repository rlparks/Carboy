/**
 * Represents the Error that occurs on attempt to
 * insert a value that violates a foreign key constraint.
 */
export default class ForeignKeyViolation extends Error {
	public readonly table: string;
	public readonly column: string;
	public readonly contents: string;

	constructor(table: string, column: string, contents: string) {
		super(`Foreign key violation on ${column}: ${contents}`);
		this.table = table;
		this.column = column;
		this.contents = contents;
	}
}
