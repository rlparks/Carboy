<script lang="ts">
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import VehicleCard from "./VehicleCard.svelte";

	let { data } = $props();
</script>

<WindowTitle title="Carboy" description="Vehicle checkout as you've never seen it before." />

{#if data.departments && data.groupedVehicles}
	{#each data.groupedVehicles as status (status.name)}
		<h1 class="text-4xl font-bold">{status.name}</h1>

		{#each data.departments as department (status.name + department.id)}
			<h2 class="text-3xl font-semibold">{department.name}</h2>

			{#each status.vehicles[department.id] as vehicle (vehicle.id)}
				<VehicleCard {vehicle} />
			{/each}
		{/each}
	{/each}
{:else}
	<p>Welcome to Carboy 2.</p>
{/if}
