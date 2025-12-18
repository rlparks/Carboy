<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { editDestination } from "./editDestination.remote";

	let { data } = $props();

	const title = $derived(`Edit ${data.destination.name}`);
</script>

<WindowTitle {title} description={`Edit destination: ${data.destination.name}`} />
<PageTitle {title} />

<form {...editDestination} class="max-w-md space-y-4">
	<input {...editDestination.fields.id.as("hidden", data.destination.id)} />

	<Input
		name="name"
		type="text"
		label="Name"
		value={data.destination.name}
		issues={editDestination.fields.name.issues()}
	/>

	<Input
		name="shortName"
		type="text"
		label="Short Name"
		value={data.destination.shortName ?? ""}
		issues={editDestination.fields.shortName.issues()}
	/>

	<Input
		name="address"
		type="text"
		label="Address"
		value={data.destination.address ?? ""}
		issues={editDestination.fields.address.issues()}
	/>

	<Button type="submit">Submit</Button>
</form>
