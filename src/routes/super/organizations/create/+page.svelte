<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { createOrganization } from "./createOrganization.remote";
</script>

<WindowTitle title="Create Organization" description="Create a new organization." />

<form {...createOrganization} class="max-w-[500px] space-y-4">
	<Input
		{...createOrganization.fields.name.as("text")}
		label="Name"
		helperText="Displayed in the UI and must be unique"
	/>

	<Input
		{...createOrganization.fields.slug.as("text")}
		label="Slug"
		helperText="Used in URLs and must be unique"
	/>

	<Button type="submit">Submit</Button>
</form>
