<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { createDestination } from "./createDestination.remote";
</script>

<WindowTitle title="Create Destination" description="Create a new destination." />
<PageTitle title="Create Destination" />

<form {...createDestination} class="max-w-md space-y-4">
	<Input
		{...createDestination.fields.name.as("text")}
		label="Name"
		helperText="Must be unique"
		issues={createDestination.fields.name.issues()}
	/>

	<Input
		{...createDestination.fields.shortName.as("text")}
		label="Short Name"
		helperText="Another identifier for the destination (building number)"
		issues={createDestination.fields.shortName.issues()}
	/>

	<Input
		{...createDestination.fields.address.as("text")}
		label="Address"
		issues={createDestination.fields.address.issues()}
	/>

	<Button type="submit">Submit</Button>
</form>
