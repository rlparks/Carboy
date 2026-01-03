<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { resolve } from "$app/paths";
	import logo from "$lib/assets/carboy-icon.png";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import VehicleCard from "../VehicleCard.svelte";

	let { data } = $props();

	const checkedOutVehicles = $derived(data.vehicles.filter((v) => v.isCheckedOut === true));
	const availableVehiclesCount = $derived(data.vehicles.length - checkedOutVehicles.length);

	// destinations already ordered by trip count
	const vehiclesOrderedTripCount = $derived(
		data.vehicles.toSorted((a, b) => b.tripCount - a.tripCount),
	);

	let intervalId: NodeJS.Timeout | null = null;

	$effect(() => {
		intervalId = setInterval(() => {
			invalidateAll();
		}, 5000);

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	});
</script>

<WindowTitle title="Dashboard" description="See an overview of Carboy" />

<header class="border-b-4 border-bulldog">
	<a class="flex items-center justify-center p-4" href={resolve("/")}>
		<img src={logo} alt="A small icon of a car" class="w-12" />
		<h1 class="mb-1 text-center font-[Oswald] text-4xl font-bold">Carboy</h1>
	</a>
</header>

<div class="mx-[6%]">
	<section class="space-y-4">
		<h2 class="text-center text-3xl">Checked Out</h2>
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

	<section class="grid grid-cols-2 gap-4 md:grid-cols-4">
		<div class="border">
			<h2 class="p-4 text-xl">Vehicles</h2>
			<div class="border-b"></div>
			<div class="space-y-2 p-4">
				<p class="truncate">
					<span class="font-bold">{data.vehicles.length.toLocaleString()}</span>
					total {data.vehicles.length === 1 ? "vehicle" : "vehicles"}
				</p>

				<p class="truncate">
					<span class="font-bold">{availableVehiclesCount.toLocaleString()}</span>
					available {availableVehiclesCount === 1 ? "vehicle" : "vehicles"}
				</p>

				<p class="truncate">
					<span class="font-bold">{checkedOutVehicles.length.toLocaleString()}</span>
					checked out {checkedOutVehicles.length === 1 ? "vehicle" : "vehicles"}
				</p>
			</div>
		</div>

		<div class="border">
			<h2 class="p-4 text-xl">Trips</h2>
			<div class="border-b"></div>
			<div class="space-y-2 p-4">
				<p class="truncate">
					<span class="font-bold">{data.trips.totalTripCount.toLocaleString()}</span>
					total {data.trips.totalTripCount === 1 ? "trip" : "trips"}
				</p>

				<p class="truncate">
					<span class="font-bold">{data.trips.monthTripCount.toLocaleString()}</span>
					{data.trips.monthTripCount === 1 ? "trip" : "trips"} this month
				</p>

				<p class="truncate">
					<span class="font-bold">{data.trips.todayTripCount.toLocaleString()}</span>
					{data.trips.todayTripCount === 1 ? "trip" : "trips"} today
				</p>
			</div>
		</div>

		<div class="border">
			<h2 class="p-4 text-xl">Favorite Vehicles</h2>
			<div class="border-b"></div>
			<div class="space-y-2 p-4">
				{#if vehiclesOrderedTripCount[0]}
					<p class="truncate">
						{vehiclesOrderedTripCount[0].number} -
						<span class="font-bold">{vehiclesOrderedTripCount[0].tripCount.toLocaleString()}</span>
						{vehiclesOrderedTripCount[0].tripCount === 1 ? "trip" : "trips"}
					</p>
				{/if}

				{#if vehiclesOrderedTripCount[1]}
					<p class="truncate">
						{vehiclesOrderedTripCount[1].number} -
						<span class="font-bold">{vehiclesOrderedTripCount[1].tripCount.toLocaleString()}</span>
						{vehiclesOrderedTripCount[1].tripCount === 1 ? "trip" : "trips"}
					</p>
				{/if}

				{#if vehiclesOrderedTripCount[2]}
					<p class="truncate">
						{vehiclesOrderedTripCount[2].number} -
						<span class="font-bold">{vehiclesOrderedTripCount[2].tripCount.toLocaleString()}</span>
						{vehiclesOrderedTripCount[2].tripCount === 1 ? "trip" : "trips"}
					</p>
				{/if}
			</div>
		</div>

		<div class="border">
			<h2 class="p-4 text-xl">Top Destinations</h2>
			<div class="border-b"></div>
			<div class="space-y-2 p-4">
				{#if data.destinations[0]}
					<p class="truncate">
						<span class="font-bold">{data.destinations[0].tripCount.toLocaleString()}</span>
						{data.destinations[0].tripCount === 1 ? "trip" : "trips"} -
						{data.destinations[0].name}
					</p>
				{/if}

				{#if data.destinations[1]}
					<p class="truncate">
						<span class="font-bold">{data.destinations[1].tripCount.toLocaleString()}</span>
						{data.destinations[1].tripCount === 1 ? "trip" : "trips"} -
						{data.destinations[1].name}
					</p>
				{/if}

				{#if data.destinations[2]}
					<p class="truncate">
						<span class="font-bold">{data.destinations[2].tripCount.toLocaleString()}</span>
						{data.destinations[2].tripCount === 1 ? "trip" : "trips"} -
						{data.destinations[2].name}
					</p>
				{/if}
			</div>
		</div>
	</section>
</div>
