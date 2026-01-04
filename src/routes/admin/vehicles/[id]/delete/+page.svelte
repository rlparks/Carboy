<script lang="ts">
	import { resolve } from "$app/paths";
	import Button from "$lib/components/Button.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { deleteVehicle } from "./deleteVehicle.remote";

	let { data } = $props();

	const title = $derived(`Delete Vehicle ${data.vehicle.number}`);
</script>

<WindowTitle
	{title}
	description={`Delete vehicle: ${data.vehicle.number} (${data.vehicle.name})`}
/>
<PageTitle {title} />

<div class="max-w-md space-y-4">
	<p class="text-lg">
		Are you sure you want to delete vehicle <span class="font-bold">{data.vehicle.number}</span>
		({data.vehicle.name})?
	</p>

	<p class="text-sm text-gray-600 dark:text-gray-400">
		This action cannot be undone. The vehicle will be permanently removed from the system.
	</p>

	<form {...deleteVehicle} class="flex gap-2">
		<input type="hidden" name="id" value={data.vehicle.id} />
		<Button type="submit">Delete</Button>
		<Button href={resolve("/admin/vehicles/[id]", { id: data.vehicle.id })}>Cancel</Button>
	</form>
</div>
