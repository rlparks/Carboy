<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { editTrip } from "./editTrip.remote";

	let { data } = $props();

	const title = $derived(`Edit Trip`);
</script>

<WindowTitle {title} description="Edit trip details" />
<PageTitle {title} />

<form {...editTrip} class="max-w-md space-y-4">
	<input {...editTrip.fields.id.as("hidden", data.trip.id)} />

	<Input
		name="startMileage"
		type="text"
		label="Starting Mileage"
		helperText="Leave blank if not applicable."
		value={data.trip.startMileage ?? ""}
		issues={editTrip.fields.startMileage.issues()}
	/>

	<Input
		name="endMileage"
		type="text"
		label="Ending Mileage"
		helperText="Leave blank if not applicable."
		value={data.trip.endMileage ?? ""}
		issues={editTrip.fields.endMileage.issues()}
	/>

	<Button type="submit">Submit</Button>
</form>
