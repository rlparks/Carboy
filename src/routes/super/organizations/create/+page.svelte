<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import MainBody from "$lib/components/MainBody.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { createOrganization } from "./createOrganization.remote";
</script>

<WindowTitle title="Create Organization" description="Create a new organization." />

<MainBody>
	<form {...createOrganization} class="max-w-125 space-y-4">
		<Input
			{...createOrganization.fields.name.as("text")}
			label="Name"
			helperText="Displayed in the UI and must be unique"
			issues={createOrganization.fields.name.issues()}
		/>

		<Input
			{...createOrganization.fields.slug.as("text")}
			label="Slug"
			helperText="Used in URLs and must be unique"
			issues={createOrganization.fields.slug.issues()}
		/>

		<Button type="submit">Submit</Button>
	</form>
</MainBody>
