import { form } from "$app/server";
import * as v from "valibot";

export const checkout = form(
	v.strictObject(
		{
			vehicleId: v.string(),
			destinationIds: v.array(v.string()),
			note: v.optional(v.string()),
		},
		"At least one destination is required.",
	),
	async (data) => {
		console.log(data);
	},
);
