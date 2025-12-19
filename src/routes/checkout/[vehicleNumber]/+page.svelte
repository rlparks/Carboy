<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { checkout } from "./checkout.remote";

	let { data } = $props();

	const title = $derived(`Check Out ${data.vehicle.number}`);
</script>

<WindowTitle {title} description="Check out a vehicle." />
<PageTitle title="Check Out" />

<div class="flex justify-around">
	<section class="w-md space-y-2">
		<h2 class="text-3xl font-semibold">{data.vehicle.number}</h2>
		<p class="text-xl">{data.vehicle.name}</p>
		{#if data.vehicle.mileage !== null}
			<p class="text-xl">
				{data.vehicle.mileage}
				{data.vehicle.mileage === 1 ? "mile" : "miles"}
			</p>
		{/if}
	</section>
	<section class="w-md">
		<form {...checkout} class="space-y-4">
			<input {...checkout.fields.vehicleId.as("hidden", data.vehicle.id)} />

			<h2>Destinations</h2>
			<Input {...checkout.fields.note.as("text")} label="Note (optional)" />

			<Button type="submit">Submit</Button>
		</form>
	</section>
</div>
