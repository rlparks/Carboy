import { resolve } from "$app/paths";
import { form, getRequestEvent } from "$app/server";
import { mergeDestinations as mergeDb } from "$lib/server/db/queries/destination";
import { error, redirect } from "@sveltejs/kit";
import * as v from "valibot";

export const mergeDestinations = form(
	v.strictObject(
		{
			finalDestinationId: v.string(),
			oldDestinationIds: v.array(v.string()),
		},
		"At least one destination is required.",
	),
	async ({ finalDestinationId, oldDestinationIds }) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("admin");

		try {
			await mergeDb(finalDestinationId, oldDestinationIds);
		} catch (err) {
			console.error(err);
			return error(500, "Unable to merge destinations");
		}

		return redirect(303, resolve("/admin/destinations/[id]", { id: finalDestinationId }));
	},
);
