import { getValue } from "$lib/server/db/queries/configuration";

export async function getDistanceConfig() {
	const [warningStart, errorStart] = await Promise.all([
		getValue("distanceWarningStart"),
		getValue("distanceErrorStart"),
	]);

	return {
		warningStart: warningStart ? parseInt(warningStart) : null,
		errorStart: errorStart ? parseInt(errorStart) : null,
	};
}
