<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import type { Destination } from "$lib/types/db";
	import { checkout } from "./checkout.remote";
	import { searchDestinations } from "./searchDestinations.remote";

	let { data } = $props();

	const title = $derived(`Check Out ${data.vehicle.number}`);

	let query = $state("");
	const searchPromise = $derived(query ? searchDestinations(query) : undefined);

	let destinations: Destination[] = $state([]);

	let draggedDestinationId: string | null = $state(null);
	let draggedOverIndex: number | null = $state(null);

	function handleDragStart(id: string) {
		draggedDestinationId = id;
	}

	function handleDragOver(event: DragEvent, overId: string) {
		event.preventDefault();

		const fromIndex = destinations.findIndex((d) => d.id === draggedDestinationId);
		const toIndex = destinations.findIndex((d) => d.id === overId);
		draggedOverIndex = toIndex;

		const updated = [...destinations];
		const [movedItem] = updated.splice(fromIndex, 1);
		if (!movedItem) return;
		updated.splice(toIndex, 0, movedItem);
		destinations = updated;
	}

	function handleDragLeave() {
		draggedOverIndex = null;
	}

	function handleDrop() {
		draggedDestinationId = null;
		draggedOverIndex = null;
	}
</script>

<WindowTitle {title} description="Check out a vehicle." />

<div class="justify-around md:flex">
	<section class="w-md space-y-2">
		<PageTitle title="Check Out" />
		<h2 class="text-3xl font-semibold">{data.vehicle.number}</h2>
		<p class="text-xl">{data.vehicle.name}</p>
		{#if data.vehicle.mileage !== null}
			<p class="text-xl">
				{data.vehicle.mileage}
				{data.vehicle.mileage === 1 ? "mile" : "miles"}
			</p>
		{/if}
	</section>
	<section class="container w-md">
		<form {...checkout} class="space-y-4">
			<input {...checkout.fields.vehicleId.as("hidden", data.vehicle.id)} />

			<div class="space-y-2">
				<h2 class="text-3xl font-semibold">Destinations</h2>
				<Input label="Search" issues={checkout.fields.destinationIds.issues()} bind:value={query} />

				<!-- search results -->
				<div>
					{#await searchPromise}
						<p aria-live="polite">Loading...</p>
					{:then results}
						<!-- results will be undefined if no query -->
						{#if results}
							<ul class="divide-y">
								{#each results as destination (destination.id)}
									<li class="dark:bg-gray-800 dark:hover:bg-gray-700">
										<button
											class="flex w-full cursor-pointer items-center justify-between p-4 text-left"
											onclick={() => {
												destinations.push(destination);
												query = "";
											}}
										>
											<div>
												<p>{destination.name}</p>
												<p>{destination.shortName ?? " "}</p>
											</div>
											<p class="text-2xl">+</p>
										</button>
									</li>
								{:else}
									<li>No results found.</li>
								{/each}
							</ul>
						{/if}
					{/await}
				</div>

				<!-- actual destination list for trip -->
				<ol class="">
					{#each destinations as destination, i (destination.id)}
						<li
							class={draggedOverIndex === i ? "bg-blue-100 dark:bg-blue-900" : "dark:bg-gray-800"}
							draggable={true}
							ondragstart={() => handleDragStart(destination.id)}
							ondragover={(e) => handleDragOver(e, destination.id)}
							ondragleave={handleDragLeave}
							ondrop={() => handleDrop()}
						>
							<div class="flex w-full items-center justify-between p-4 text-left">
								<div class="flex items-center gap-4">
									<p class="space-x-2 text-xl font-semibold select-none">
										<span>⋮⋮</span>
										<span>{i + 1}</span>
									</p>
									<div>
										<p>{destination.name}</p>
										<p>{destination.shortName}</p>
									</div>
								</div>
								<button class="cursor-pointer text-xl" onclick={() => destinations.splice(i, 1)}>
									✕
								</button>
							</div>
							<input name="destinationIds[]" type="hidden" value={destination.id} />
						</li>
					{:else}
						<p class="italic">No destinations selected.</p>
					{/each}
				</ol>
			</div>

			<div class="space-y-2">
				<h2 class="text-3xl font-semibold">Note</h2>

				<Input {...checkout.fields.note.as("text")} helperText="Optional" />
			</div>

			<Button type="submit">Submit</Button>
		</form>
	</section>
</div>
