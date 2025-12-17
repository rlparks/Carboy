import { getDepartmentById } from "$lib/server/db/queries/department";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	event.locals.security.enforceRole("admin");
	const { id } = event.params;

	const department = await getDepartmentById(id);

	if (!department) {
		return error(404, "Department not found.");
	}

	return { department };
}) satisfies LayoutServerLoad;
