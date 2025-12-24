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

{#if data.departments && data.availableVehicles && data.checkedOutVehicles}
	<h1 class="text-4xl font-bold">Available</h1>

	{#if Object.values(data.availableVehicles).some((vehicles) => vehicles?.length && vehicles.length > 0)}
		{#each data.departments as department (department.id)}
			{#if data.availableVehicles[department.id]?.length}
				<h2 class="text-3xl font-semibold">{department.name}</h2>

				<section class="grid grid-cols-2 gap-4 md:grid-cols-5">
					{#each data.availableVehicles[department.id] as vehicle (vehicle.id)}
						<VehicleCard {vehicle} />
					{/each}
				</section>
			{/if}
		{/each}
	{:else}
		<p class="text-lg italic">No vehicles are currently available.</p>
	{/if}

	{#if data.checkedOutVehicles.length}
		<h1 class="text-4xl font-bold">Checked Out</h1>

		<section class="grid grid-cols-2 gap-4 md:grid-cols-5">
			{#each data.checkedOutVehicles as vehicle (vehicle.id)}
				<VehicleCard {vehicle} />
			{/each}
		</section>
	{/if}
{:else}
	<p>Welcome to Carboy 2.</p>
{/if}
