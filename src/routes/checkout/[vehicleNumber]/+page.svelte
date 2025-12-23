<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import type { Destination } from "$lib/types/db";
	import { checkout } from "./checkout.remote";
	import { createDestinationSimple } from "./createDestinationSimple.remote";
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

	let creatingDestination = $state(false);
</script>

<WindowTitle {title} description="Check out a vehicle." />

<div class="justify-around space-y-4 md:flex">
	<section class="max-w-md space-y-2">
		{#if !creatingDestination}
			<PageTitle title="Check Out" />

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
		{:else}
			<h2 class="text-3xl font-semibold">Create Destination</h2>
			<form
				class="space-y-4"
				{...createDestinationSimple.enhance(async (e) => {
					await e.submit();
					if (!createDestinationSimple.fields.allIssues()?.length) {
						e.form.reset();
						creatingDestination = false;
					}
				})}
			>
				<Input
					{...createDestinationSimple.fields.name.as("text")}
					label="Name"
					helperText="Must be unique"
					issues={createDestinationSimple.fields.name.issues()}
				/>

				<Input
					{...createDestinationSimple.fields.shortName.as("text")}
					label="Short Name"
					helperText="Another identifier for the destination (building number)"
					issues={createDestinationSimple.fields.shortName.issues()}
				/>

				<Input
					{...createDestinationSimple.fields.address.as("text")}
					label="Address"
					issues={createDestinationSimple.fields.address.issues()}
				/>

				<div class="flex gap-2">
					<Button type="submit">Submit</Button>
					<Button type="button" onclick={() => (creatingDestination = false)}>Cancel</Button>
				</div>
			</form>
		{/if}
	</section>
	<section class="container max-w-md">
		<form {...checkout} class="space-y-4">
			<input {...checkout.fields.vehicleId.as("hidden", data.vehicle.id)} />

			<div class="space-y-2">
				<h2 class="text-3xl font-semibold">Destinations</h2>
				<div class="flex items-end gap-2">
					<div class="grow">
						<Input
							label="Search"
							issues={checkout.fields.destinationIds.issues()}
							bind:value={query}
						/>
					</div>
					<button
						class="h-9.5 w-9.5 cursor-pointer border border-gray-300 px-3 dark:border-gray-600 dark:bg-gray-800"
						type="button"
						onclick={() => (creatingDestination = !creatingDestination)}
					>
						{#if !creatingDestination}
							+
						{:else}
							-
						{/if}
					</button>
				</div>

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
													<p>{destination.name}</p>
													<p>{destination.shortName ?? " "}</p>
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

				<Input {...checkout.fields.note.as("text")} helperText="Optional" />
			</div>

			<Button type="submit">Submit</Button>
		</form>
	</section>
</div>
