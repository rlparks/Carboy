<script lang="ts">
	import { resolve } from "$app/paths";
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import type { TripNoteWithAuthor } from "$lib/types/bonus";
	import { addNote } from "./addNote.remote";

	let { data } = $props();

	const title = "Trip Details";

	function getNoteType(note: TripNoteWithAuthor) {
		const noteTime = new Date(note.createdAt).getTime();
		const startTime = data.trip.startTime.getTime();
		const endTime = data.trip.endTime?.getTime();

		if (noteTime === startTime) return "checkout";
		if (endTime && noteTime === endTime) return "checkin";
		return null;
	}

	let addingNote = $state(false);
</script>

<WindowTitle {title} description="View trip details." />

<div class="justify-around space-y-4 md:flex">
	<section class="w-md space-y-4">
		<div class="space-y-2">
			<header class="flex justify-between">
				<PageTitle {title} />
				{#if data.account?.role === "superadmin"}
					<Button href={resolve("/trips/[id]/edit", { id: data.trip.id })}>Edit</Button>
				{/if}
			</header>

			{#if data.trip.vehicleHasImage}
				<img
					alt="Vehicle {data.trip.vehicleNumber}"
					src="/api/images/vehicles/{data.trip.vehicleNumber}"
				/>
			{/if}

			<h2 class="text-3xl font-semibold">{data.trip.vehicleNumber}</h2>
			<p class="text-xl">{data.trip.vehicleName}</p>
			{#if data.trip.departmentName}
				<aside>
					<h3 class="text-2xl">Department</h3>
					<p>{data.trip.departmentName}</p>
				</aside>
			{/if}
		</div>

		<div class="space-y-2">
			<h2 class="text-3xl font-semibold">Trip</h2>
			<div class="md:flex md:space-x-8">
				<div class="flex-1 space-y-2">
					<aside>
						<h3 class="text-2xl">Starting Time</h3>
						<p>{data.trip.startTime.toLocaleString()}</p>
					</aside>
					<aside>
						<h3 class="text-2xl">Started By</h3>
						<p>{data.trip.startedByName}</p>
					</aside>
					{#if data.trip.startMileage !== null}
						<aside>
							<h3 class="text-2xl">Starting Mileage</h3>
							<p>{data.trip.startMileage.toLocaleString()} miles</p>
						</aside>
					{/if}
				</div>
				{#if data.trip.endTime}
					<div class="flex-1 space-y-2">
						<aside>
							<h3 class="text-2xl">Ending Time</h3>
							<p>{data.trip.endTime.toLocaleString()}</p>
						</aside>
						<aside>
							<h3 class="text-2xl">Ended By</h3>
							<p>{data.trip.endedByName}</p>
						</aside>
						{#if data.trip.endMileage !== null}
							<aside>
								<h3 class="text-2xl">Ending Mileage</h3>
								<p>{data.trip.endMileage.toLocaleString()} miles</p>
							</aside>
						{/if}
					</div>
				{/if}
			</div>

			{#if data.trip.distance !== null}
				<aside>
					<h3 class="text-2xl">Distance</h3>
					<p>
						{data.trip.distance.toLocaleString()}
						{data.trip.distance === 1 ? "mile" : "miles"}
					</p>
				</aside>
			{/if}
		</div>
	</section>

	<section class="w-md space-y-4">
		{#if data.trip.destinations.length}
			<div class="space-y-2">
				<h2 class="text-3xl font-semibold">Destinations</h2>
				<ol class="space-y-2">
					{#each data.trip.destinations as destination, i (destination.id)}
						<li class="p-4 dark:bg-gray-800">
							<div class="flex items-center gap-4">
								<p class="text-xl font-semibold">{i + 1}</p>
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
						</li>
					{/each}
				</ol>
			</div>
		{/if}

		<div class="space-y-2">
			<h2 class="text-3xl font-semibold">Notes</h2>
			{#if data.trip.notes.length}
				<ol class="space-y-2">
					{#each data.trip.notes as note (note.id)}
						{@const noteType = getNoteType(note)}
						<li class="relative p-4 dark:bg-gray-800">
							{#if noteType}
								<span
									class="absolute top-2 right-2 rounded bg-bulldog px-2 py-1 text-xs text-white"
								>
									{noteType}
								</span>
							{/if}
							<p class="pr-16 text-xl">{note.text}</p>
							<p class="text-lg">{note.authorName}</p>
							<p>{new Date(note.createdAt).toLocaleString()}</p>
						</li>
					{/each}
				</ol>
			{/if}

			{#if addingNote}
				<form
					{...addNote.enhance(async (e) => {
						await e.submit();
						addingNote = false;
					})}
					class="space-y-2"
				>
					<input {...addNote.fields.tripId.as("hidden", data.trip.id)} />
					<Input
						label="Note"
						{...addNote.fields.note.as("text")}
						issues={addNote.fields.note.issues()}
						autofocus
					/>

					<div class="flex gap-2">
						<Button type="submit">Submit</Button>
						<Button type="button" onclick={() => (addingNote = false)}>Cancel</Button>
					</div>
				</form>
			{:else}
				<Button onclick={() => (addingNote = true)}>Add Note</Button>
			{/if}
		</div>
	</section>
</div>
