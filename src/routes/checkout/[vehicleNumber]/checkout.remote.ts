import { form } from "$app/server";
import * as v from "valibot";

export const checkout = form(
	v.strictObject({
		vehicleId: v.string(),
		destinationIds: v.array(v.string()),
		note: v.optional(v.string()),
	}),
	async (data) => {
		console.log(data);
	},
);
