<script lang="ts">
	import { resolve } from "$app/paths";
	import Button from "$lib/components/Button.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const title = $derived(`Vehicle ${data.vehicle.number}`);
</script>

<WindowTitle
	{title}
	description={`Manage vehicle: ${data.vehicle.number} (${data.vehicle.name})`}
/>

<header class="flex justify-between">
	<PageTitle {title} />
	<div class="flex gap-2">
		<Button href={resolve("/admin/vehicles/[id]/edit", { id: data.vehicle.id })}>Edit</Button>
		{#if data.tripCount === 0}
			<Button href={resolve("/admin/vehicles/[id]/delete", { id: data.vehicle.id })}>Delete</Button>
		{/if}
	</div>
</header>

<div class="grid max-w-md grid-cols-2 gap-4">
	<p class="font-semibold">Number:</p>
	<p>{data.vehicle.number}</p>

	<p class="font-semibold">Name:</p>
	<p>{data.vehicle.name}</p>

	<p class="font-semibold">Mileage:</p>
	<p>{data.vehicle.mileage?.toLocaleString() ?? "N/A"}</p>

	<p class="font-semibold">Archived:</p>
	<p>{data.vehicle.archived ? "Yes" : "No"}</p>

	<p class="font-semibold">Created At:</p>
	<p>{data.vehicle.createdAt.toLocaleString()}</p>

	<p class="font-semibold">Updated At:</p>
	<p>{data.vehicle.updatedAt?.toLocaleString() ?? "Never"}</p>
</div>
