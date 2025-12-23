<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import type { Destination } from "$lib/types/db";
	import { searchDestinations } from "../../checkout/[vehicleNumber]/searchDestinations.remote";
	import { checkin } from "./checkin.remote";

	let { data } = $props();

	const title = $derived(`Check In ${data.vehicle.number}`);

	let query = $state("");
	const searchPromise = $derived(query ? searchDestinations(query) : undefined);

	// this just starts with the value from data
	// svelte-ignore state_referenced_locally
	let destinations: Destination[] = $state(data.trip.destinations);

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

	function handleTouchStart(id: string) {
		if (typeof document === "undefined") return;
		draggedDestinationId = id;

		// prevent page scrolling during touch drag
		document.addEventListener("touchmove", handleTouchMove, { passive: false });
		document.addEventListener("touchend", handleTouchEnd);
		document.body.style.touchAction = "none";
	}

	function handleTouchMove(event: TouchEvent) {
		if (typeof document === "undefined") return;
		event.preventDefault();

		const touch = event.touches && event.touches[0];
		if (!touch) return;

		const el = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
		const li = el?.closest("li") as HTMLElement | null;
		if (!li) return;

		const overId = li.dataset.destinationId;
		if (!overId) return;

		const fromIndex = destinations.findIndex((d) => d.id === draggedDestinationId);
		const toIndex = destinations.findIndex((d) => d.id === overId);
		draggedOverIndex = toIndex;

		if (fromIndex === -1 || toIndex === -1) return;

		const updated = [...destinations];
		const [movedItem] = updated.splice(fromIndex, 1);
		if (!movedItem) return;
		updated.splice(toIndex, 0, movedItem);
		destinations = updated;
	}

	function handleTouchEnd() {
		// remove listeners and restore touch-action
		document.removeEventListener("touchmove", handleTouchMove);
		document.removeEventListener("touchend", handleTouchEnd);
		document.body.style.touchAction = "";

		handleDrop();
	}
</script>

<WindowTitle {title} description="Check in a vehicle." />

<div class="justify-around space-y-4 md:flex">
	<section class="w-md space-y-4">
		<div class="space-y-2">
			<PageTitle title="Check In" />

			{#if data.vehicle.hasImage}
				<img alt="Vehicle {data.vehicle.number}" src="/api/images/vehicles/{data.vehicle.number}" />
			{/if}

			<h2 class="text-3xl font-semibold">{data.vehicle.number}</h2>
			<p class="text-xl">{data.vehicle.name}</p>
			{#if data.vehicle.mileage !== null}
				<p class="text-xl">
					{data.vehicle.mileage.toLocaleString()}
					{data.vehicle.mileage === 1 ? "mile" : "miles"}
				</p>
			{/if}
		</div>

		<div class="space-y-2">
			<h2 class="text-3xl font-semibold">Trip</h2>
			<aside>
				<h3 class="text-2xl">Start time</h3>
				<p>{data.trip.startTime.toLocaleString()}</p>
			</aside>
			<aside>
				<h3 class="text-2xl">Started by</h3>
				<p>{data.trip.startedByName}</p>
			</aside>
		</div>

		{#if data.trip.notes.length}
			<div class="space-y-2">
				<h2 class="text-3xl font-semibold">Notes</h2>
				<ol class="space-y-2">
					{#each data.trip.notes as note (note.id)}
						<li class="p-4 dark:bg-gray-800">
							<p class="text-xl">{note.text}</p>
							<p class="text-lg">{note.authorName}</p>
							<p>{new Date(note.createdAt).toLocaleString()}</p>
						</li>
					{/each}
				</ol>
			</div>
		{/if}
	</section>

	<section class="container max-w-md">
		<form
			{...checkin.enhance((e) => {
				if (data.distanceWarningStart) {
					const tripDistance =
						data.vehicle.mileage &&
						e.data.endMileage !== undefined &&
						parseInt(e.data.endMileage) &&
						parseInt(e.data.endMileage) - data.vehicle.mileage;

					if (typeof tripDistance === "number" && tripDistance >= data.distanceWarningStart) {
						const userConfirmed = confirm(
							`Trip distance is ${data.distanceWarningStart} miles or greater. Are you sure this is correct?`,
						);

						if (!userConfirmed) {
							return;
						}
					}
				}

				e.submit();
			})}
			class="space-y-4"
		>
			<input {...checkin.fields.tripId.as("hidden", data.trip.id)} />

			{#if data.vehicle.mileage !== null && data.trip.startMileage !== null}
				<div class="space-y-2">
					<h2 class="text-3xl font-semibold">Ending Mileage</h2>
					<Input
						type="number"
						name="endMileage"
						value={data.trip.startMileage}
						issues={checkin.fields.endMileage.issues()}
					/>
				</div>
			{/if}

			<div class="space-y-2">
				<h2 class="text-3xl font-semibold">Destinations</h2>
				<Input label="Search" issues={checkin.fields.destinationIds.issues()} bind:value={query} />

				<!-- search results -->
				<div>
					{#await searchPromise}
						<p aria-live="polite">Loading...</p>
					{:then results}
						<!-- results will be undefined if no query -->
						{#if results}
							<ul class="divide-y">
								{#each results as destination (destination.id)}
									{#if !destinations.find((d) => d.id === destination.id)}
										<li class="dark:bg-gray-800 dark:hover:bg-gray-700">
											<button
												type="button"
												class="flex w-full cursor-pointer items-center justify-between p-4 text-left"
												onclick={() => {
													destinations.push(destination);
													query = "";
												}}
											>
												<div>
													<p class="font-semibold">{destination.name}</p>
													{#if destination.shortName}
														<p class="text-sm text-gray-600 dark:text-gray-400">
															{destination.shortName}
														</p>
													{/if}
													{#if destination.address}
														<p class="text-sm text-gray-600 dark:text-gray-400">
															{destination.address}
														</p>
													{/if}
												</div>
												<p class="text-2xl">+</p>
											</button>
										</li>
									{/if}
								{:else}
									<li class="italic">No results found.</li>
								{/each}
							</ul>
						{/if}
					{/await}
				</div>

				<!-- actual destination list for trip -->
				<ol class="space-y-2">
					{#each destinations as destination, i (destination.id)}
						<li
							data-destination-id={destination.id}
							class={draggedOverIndex === i ? "bg-blue-100 dark:bg-blue-900" : "dark:bg-gray-800"}
							draggable={true}
							ondragstart={() => handleDragStart(destination.id)}
							ondragover={(e) => handleDragOver(e, destination.id)}
							ondragleave={handleDragLeave}
							ondrop={() => handleDrop()}
							ontouchstart={() => handleTouchStart(destination.id)}
							ontouchmove={handleTouchMove}
							ontouchend={handleTouchEnd}
						>
							<div class="flex w-full cursor-grab items-center justify-between p-4 text-left">
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
								<button
									type="button"
									class="cursor-pointer text-xl text-red-600 hover:text-red-800"
									onclick={() => destinations.splice(i, 1)}
								>
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

				<Input {...checkin.fields.note.as("text")} helperText="Optional" />
			</div>

			<Button type="submit">Submit</Button>
		</form>
	</section>
</div>
