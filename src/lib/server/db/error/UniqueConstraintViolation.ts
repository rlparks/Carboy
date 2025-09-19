/**
 * Represents the Error that occurs on attempt to
 * insert a value that violates a UNIQUE constraint.
 */
export default class UniqueConstraintViolation extends Error {
	public readonly constraintViolated: string;
	public readonly contents?: string;

	constructor(constraintViolated: string, contents?: string) {
		if (contents) {
			super(`Duplicate ${constraintViolated}: ${contents}`);
		} else {
			super(`Duplicate ${constraintViolated}`);
		}
		this.constraintViolated = constraintViolated;
		this.contents = contents;
	}
}
