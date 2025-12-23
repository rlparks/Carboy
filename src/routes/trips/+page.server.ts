import { getTripCount, getTrips, type TripFilterOptions } from "$lib/server/db/queries/trip";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

const perPage = 100;

export const load = (async (event) => {
	event.locals.security.enforceAuthenticated();

	const orgId = event.locals.session?.selectedOrganizationId;
	if (!orgId) {
		return error(400, "No organization selected.");
	}

	const opts = getFilterParams(event.url.searchParams, orgId);
	return {
		trips: getTrips(opts),
		totalCount: getTripCount(opts),
		chips: getChips(opts, event.url.searchParams),
	};
}) satisfies PageServerLoad;

function getFilterParams(params: URLSearchParams, orgId: string): TripFilterOptions {
	const filterParams: TripFilterOptions = {
		vehicleNumber: params.get("vehicleNumber") || undefined,
		organizationId: orgId,
		startTimeFrom: getDate(params.get("startTimeFrom")),
		startTimeTo: getDate(params.get("startTimeTo")),
		endTimeFrom: getDate(params.get("endTimeFrom")),
		endTimeTo: getDate(params.get("endTimeTo")),
		distance:
			params.get("distance") !== null && params.get("distance") !== ""
				? parseInt(params.get("distance")!)
				: undefined,
		distanceComparator: getComparator(params.get("distanceComparator")),
		duration:
			params.get("duration") !== null && params.get("duration") !== ""
				? parseInt(params.get("duration")!)
				: undefined,
		durationComparator: getComparator(params.get("durationComparator")),
		startedBy: params.get("startedBy") || undefined,
		endedBy: params.get("endedBy") || undefined,
		endedByDifferent:
			params.get("endedByDifferentUser") !== null
				? params.get("endedByDifferentUser") === "on"
				: undefined,
		limit: params.get("limit") !== null ? parseInt(params.get("limit")!) : undefined,
		offset: params.get("page") !== null ? (parseInt(params.get("page")!) - 1) * perPage : undefined,
	};

	return filterParams;
}

type Comparator = "=" | ">" | "<" | ">=" | "<=";

function getComparator(param: string | null): Comparator {
	if (!param) {
		return "=";
	}

	const validOptions = ["=", ">", "<", ">=", "<="];

	return validOptions.includes(param) ? (param as Comparator) : "=";
}

function getDate(param: string | null) {
	if (!param) {
		return undefined;
	}

	return new Date(param);
}

function getChips(opts: TripFilterOptions, params: URLSearchParams) {
	const values = [];

	if (opts.vehicleNumber) {
		values.push({ name: "vehicleNumber", displayName: "Vehicle", value: opts.vehicleNumber });
	}

	if (opts.startedBy) {
		values.push({ name: "startedBy", displayName: "Started By", value: opts.startedBy });
	}

	if (opts.endedBy) {
		values.push({ name: "endedBy", displayName: "Ended By", value: opts.endedBy });
	}

	if (opts.endedByDifferent) {
		values.push({ name: "endedByDifferent", displayName: "Ended By Different User", value: "yes" });
	}

	const startTimeFrom = params.get("startTimeFrom");
	if (startTimeFrom) {
		values.push({ name: "startTimeFrom", displayName: "Starting From", value: startTimeFrom });
	}

	const startTimeTo = params.get("startTimeTo");
	if (startTimeTo) {
		values.push({ name: "startTimeTo", displayName: "Starting To", value: startTimeTo });
	}

	const endTimeFrom = params.get("endTimeFrom");
	if (endTimeFrom) {
		values.push({ name: "endTimeFrom", displayName: "Ending From", value: endTimeFrom });
	}

	const endTimeTo = params.get("endTimeTo");
	if (endTimeTo) {
		values.push({ name: "endTimeTo", displayName: "Ending To", value: endTimeTo });
	}

	if (opts.distance) {
		values.push({ name: "distance", displayName: "Distance", value: String(opts.distance) });
	}

	if (opts.duration) {
		values.push({ name: "duration", displayName: "Duration", value: String(opts.duration) });
	}

	return values;
}
