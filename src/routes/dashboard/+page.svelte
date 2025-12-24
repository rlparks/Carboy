<script lang="ts">
	import { resolve } from "$app/paths";
	import VehicleCard from "../VehicleCard.svelte";

	let { data } = $props();

	const checkedOutVehicles = $derived(data.vehicles.filter((v) => v.isCheckedOut === true));
</script>

<header class="border-b-4 border-bulldog">
	<a class="p-0.5 text-center" href={resolve("/")}>
		<h1 class="mb-1 font-[Oswald] text-3xl font-bold">Carboy</h1>
	</a>
</header>

<div class="container mx-auto">
	<section class="flex flex-col items-center gap-4">
		<h2 class="text-3xl">Checked Out</h2>
		{#if checkedOutVehicles.length}
			<div class="grid grid-cols-2 gap-4 md:grid-cols-5">
				{#each checkedOutVehicles as vehicle (vehicle.id)}
					<VehicleCard {vehicle} showButton={false} />
				{/each}
			</div>
		{:else}
			<p class="text-xl italic">No vehicles are currently checked out.</p>
		{/if}
	</section>
	<div class="my-6 w-full border-b"></div>
</div>
