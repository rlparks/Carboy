import * as v from "valibot";

export const UsernameSchema = v.pipe(
	v.string(),
	v.minLength(1, "Username is required."),
	v.maxLength(20, "Username cannot exceed 20 characters."),
);
export const EmailSchema = v.pipe(v.string(), v.email("Invalid email address."));
export const NameSchema = v.pipe(
	v.string(),
	v.minLength(1, "Name is required."),
	v.maxLength(100, "Name cannot exceed 100 characters."),
);

export const PasswordSchema = v.pipe(
	v.string(),
	v.minLength(8, "Password must be at least 8 characters long."),
	v.maxLength(1000, "Password cannot exceed 1000 characters."),
);

export const VehicleMileageSchema = v.union([
	v.pipe(
		v.literal(""),
		v.transform(() => null),
	),
	v.pipe(v.string(), v.transform(Number), v.integer("Mileage must be an integer.")),
]);
