<script lang="ts">
	import { page } from "$app/state";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import VehicleCard from "./VehicleCard.svelte";

	let { data } = $props();

	const successMessage = $derived(page.url.searchParams.get("success"));
	const errorMessage = $derived(page.url.searchParams.get("error"));
</script>

<WindowTitle title="Carboy" description="Vehicle checkout as you've never seen it before." />

{#if successMessage}
	{#if successMessage === "checkout"}
		<p class="border-b-4 border-green-600 pb-4 text-xl">
			Your vehicle was successfully checked out!
		</p>
	{:else if successMessage === "checkin"}
		<p class="border-b-4 border-green-600 pb-4 text-xl">
			Your vehicle was successfully checked in!
		</p>
	{/if}
{:else if errorMessage}
	{#if errorMessage === "checkout"}
		<p class="border-b-4 border-bulldog pb-4 text-xl">This vehicle is already checked out.</p>
	{:else if errorMessage === "checkin"}
		<p class="border-b-4 border-bulldog pb-4 text-xl">This vehicle is already checked in.</p>
	{/if}
{/if}

{#if data.departments && data.groupedVehicles}
	{#each data.groupedVehicles as topLevelSection (topLevelSection.name)}
		{#if Object.values(topLevelSection.vehicles).some((vehicles) => vehicles?.length && vehicles.length > 0)}
			<h1 class="text-4xl font-bold">{topLevelSection.name}</h1>

			{#each data.departments as department (topLevelSection.name + department.id)}
				{#if topLevelSection.vehicles[department.id]?.length}
					<h2 class="text-3xl font-semibold">{department.name}</h2>

					<section class="grid grid-cols-2 gap-4 md:grid-cols-5">
						{#each topLevelSection.vehicles[department.id] as vehicle (vehicle.id)}
							<VehicleCard {vehicle} />
						{/each}
					</section>
				{/if}
			{/each}
		{/if}
	{/each}
{:else}
	<p>Welcome to Carboy 2.</p>
{/if}
