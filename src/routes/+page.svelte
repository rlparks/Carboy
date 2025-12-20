<script lang="ts">
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import VehicleCard from "./VehicleCard.svelte";

	let { data } = $props();
</script>

<WindowTitle title="Carboy" description="Vehicle checkout as you've never seen it before." />

{#if data.departments && data.groupedVehicles}
	{#each data.groupedVehicles as topLevelSection (topLevelSection.name)}
		<h1 class="text-4xl font-bold">{topLevelSection.name}</h1>

		{#each data.departments as department (topLevelSection.name + department.id)}
			{#if topLevelSection.vehicles[department.id]?.length}
				<h2 class="text-3xl font-semibold">{department.name}</h2>

				{#each topLevelSection.vehicles[department.id] as vehicle (vehicle.id)}
					<VehicleCard {vehicle} />
				{/each}
			{/if}
		{/each}
	{/each}
{:else}
	<p>Welcome to Carboy 2.</p>
{/if}
