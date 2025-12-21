import { form, getRequestEvent } from "$app/server";
import { setValue } from "$lib/server/db/queries/configuration";
import { invalid } from "@sveltejs/kit";
import * as v from "valibot";

export const setDistanceConfig = form(
	v.strictObject({
		distanceWarningStart: v.pipe(
			v.string(),
			v.transform((s) => parseInt(s)),
			v.minValue(0, "Must be a positive number"),
		),
		distanceErrorStart: v.pipe(
			v.string(),
			v.transform((s) => parseInt(s)),
			v.minValue(0, "Must be a positive number"),
		),
	}),
	async (data, issue) => {
		const event = getRequestEvent();
		event.locals.security.enforceRole("superadmin");

		// Validate that warning is less than error
		if (data.distanceWarningStart >= data.distanceErrorStart) {
			return invalid(
				issue.distanceWarningStart("Warning threshold must be less than error threshold."),
			);
		}

		await setValue("distanceWarningStart", String(data.distanceWarningStart));
		await setValue("distanceErrorStart", String(data.distanceErrorStart));

		return {};
	},
);
