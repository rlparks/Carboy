<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import type { Destination } from "$lib/types/db";
	import { checkout } from "./checkout.remote";

	let { data } = $props();

	const title = $derived(`Check Out ${data.vehicle.number}`);

	const destinations: Destination[] = $state([]);
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
				<Input label="Search" issues={checkout.fields.destinationIds.issues()} />
				{#each destinations as destination (destination.id)}{:else}
					<p class="italic">No destinations selected.</p>
				{/each}
			</div>

			<div class="space-y-2">
				<h2 class="text-3xl font-semibold">Note</h2>

				<Input {...checkout.fields.note.as("text")} helperText="Optional" />
			</div>

			<Button type="submit">Submit</Button>
		</form>
	</section>
</div>
