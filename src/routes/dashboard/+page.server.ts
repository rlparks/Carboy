import { getDashboardKeyByKey } from "$lib/server/db/queries/dashboardKey";
import { getDestinations } from "$lib/server/db/queries/destination";
import { getTripCount } from "$lib/server/db/queries/trip";
import { getVehiclesByOrganizationId } from "$lib/server/db/queries/vehicle";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	const key = event.url.searchParams.get("key");

	let orgId = "";

	if (key) {
		const fullKey = await getDashboardKeyByKey(key);
		if (!fullKey) {
			return error(403, "Invalid key");
		}

		orgId = fullKey.organizationId;
	} else {
		event.locals.security.enforceAuthenticated();

		const orgFromSession = event.locals.session?.selectedOrganizationId;

		if (!orgFromSession) {
			return error(400, "No organization selected.");
		}

		orgId = orgFromSession;
	}

	const vehiclesPromise = getVehiclesByOrganizationId(orgId);

	const totalTripCountPromise = getTripCount({ organizationId: orgId });

	const firstOfMonth = new Date();
	firstOfMonth.setDate(1);
	firstOfMonth.setHours(0, 0, 0, 0);
	const monthTripCountPromise = getTripCount({
		organizationId: orgId,
		startTimeFrom: firstOfMonth,
	});

	const startOfDay = new Date();
	startOfDay.setHours(0, 0, 0, 0);
	const todayTripCountPromise = getTripCount({ organizationId: orgId, startTimeFrom: startOfDay });

	const destinationsPromise = getDestinations().then((d) => d.slice(0, 3));

	const [vehicles, totalTripCount, monthTripCount, todayTripCount, destinations] =
		await Promise.all([
			vehiclesPromise,
			totalTripCountPromise,
			monthTripCountPromise,
			todayTripCountPromise,
			destinationsPromise,
		]);

	return { vehicles, trips: { totalTripCount, monthTripCount, todayTripCount }, destinations };
}) satisfies PageServerLoad;
