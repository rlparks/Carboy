import { getTrips, type TripFilterOptions } from "$lib/server/db/queries/trip";
import { error } from "@sveltejs/kit";
import Papa from "papaparse";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (event) => {
	event.locals.security.enforceAuthenticated();
	const params = event.url.searchParams;

	const orgId = event.locals.session?.selectedOrganizationId;
	if (!orgId) {
		return error(400, "No organization selected.");
	}

	const opts: TripFilterOptions = {
		limit: Number.MAX_SAFE_INTEGER,
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
	};

	const trips = await getTrips(opts);

	const origin = event.url.origin;
	const urlPrefix = `${origin}/trips/`;

	const formattedData = trips.map((t) => ({
		"Vehicle Number": t.vehicleNumber,
		"Vehicle Name": t.vehicleName,
		"Vehicle Department": t.departmentName,
		"Started By": `${t.startedByName} (${t.startedByUsername})`,
		"Ended By": t.endedByName ? `${t.endedByName} (${t.endedByUsername})` : "",
		"Starting Time": formatDateForCsv(t.startTime),
		"Ending Time": formatDateForCsv(t.endTime),
		"Starting Mileage": t.startMileage,
		"Ending Mileage": t.endMileage,
		Distance: t.endMileage && t.startMileage ? t.endMileage - t.startMileage : "",
		Destinations: t.destinations,
		"Trip URL": `${urlPrefix}${t.id}`,
		"Created At": formatDateForCsv(t.createdAt),
		"Updated At": formatDateForCsv(t.updatedAt),
	}));

	const csv = Papa.unparse(formattedData, {
		header: true,
	});

	const filename = timestampedFilename("carboy-trips", "csv");
	const contentLength = new TextEncoder().encode(csv).length;

	return new Response(csv, {
		headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition": `attachment; filename*=UTF-8''${filename}`,
			"Content-Length": contentLength.toString(),
		},
	});
};

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

function formatDateForCsv(date: Date | null) {
	if (!date) return "";
	return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
}

function timestampedFilename(prefix: string, ext: string) {
	const now = new Date();
	const pad = (n: number) => n.toString().padStart(2, "0");
	const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
	return `${prefix}-${ts}.${ext}`;
}
