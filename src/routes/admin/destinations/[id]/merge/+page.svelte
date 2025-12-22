<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import type { Destination } from "$lib/types/db";
	import { searchDestinations } from "../../../../checkout/[vehicleNumber]/searchDestinations.remote";
	import { mergeDestinations } from "./mergeDestinations.remote";

	let { data } = $props();

	const title = $derived(`Merge Destinations into ${data.destination.name}`);

	let query = $state("");
	const searchPromise = $derived(query ? searchDestinations(query) : undefined);

	let selectedDestinations: Destination[] = $state([]);

	function addDestination(destination: Destination) {
		if (
			!selectedDestinations.find((d) => d.id === destination.id) &&
			destination.id !== data.destination.id
		) {
			selectedDestinations.push(destination);
			query = "";
		}
	}

	function removeDestination(id: string) {
		selectedDestinations = selectedDestinations.filter((d) => d.id !== id);
	}
</script>

<WindowTitle {title} description="Merge multiple destinations into this one." />

<div class="space-y-4">
	<PageTitle {title} />

	<p class="text-lg">
		Search for destinations to merge into <strong>{data.destination.name}</strong>. The selected
		destinations will be merged and deleted, with all their trips reassigned to this destination.
	</p>

	<form {...mergeDestinations} class="max-w-md space-y-4">
		<input {...mergeDestinations.fields.finalDestinationId.as("hidden", data.destination.id)} />

		<div class="space-y-2">
			<h2 class="text-2xl font-semibold">Search Destinations</h2>
			<Input
				label="Search by name or short name"
				bind:value={query}
				issues={mergeDestinations.fields.oldDestinationIds.issues()}
			/>

			<!-- search results -->
			<div>
				{#await searchPromise}
					<p aria-live="polite">Loading...</p>
				{:then results}
					{#if results}
						<ul class="divide-y">
							{#each results as destination (destination.id)}
								{#if destination.id !== data.destination.id && !selectedDestinations.find((d) => d.id === destination.id)}
									<li class="dark:bg-gray-800 dark:hover:bg-gray-700">
										<button
											type="button"
											class="flex w-full cursor-pointer items-center justify-between p-4 text-left"
											onclick={() => addDestination(destination)}
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
		</div>

		<div class="space-y-2">
			<h2 class="text-2xl font-semibold">Destinations to Merge</h2>
			{#if selectedDestinations.length === 0}
				<p class="italic">No destinations selected.</p>
			{:else}
				<ul class="space-y-2">
					{#each selectedDestinations as destination (destination.id)}
						<li class="flex items-center justify-between p-4 dark:bg-gray-800">
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
							<button
								type="button"
								class="cursor-pointer text-xl text-red-600 hover:text-red-800"
								onclick={() => removeDestination(destination.id)}
							>
								✕
							</button>
							<input name="oldDestinationIds[]" type="hidden" value={destination.id} />
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<Button type="submit">
			Merge {selectedDestinations.length} Destination{selectedDestinations.length === 1 ? "" : "s"}
		</Button>
	</form>
</div>
