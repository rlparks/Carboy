<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { editOrganization } from "./editOrganization.remote";

	let { data } = $props();

	const title = $derived(`Edit Organization ${data.organization.name}`);
</script>

<WindowTitle {title} description={`Edit organization: ${data.organization.name}`} />
<PageTitle {title} />

<form {...editOrganization} class="max-w-md space-y-4">
	<input {...editOrganization.fields.id.as("hidden", data.organization.id)} />

	<Input
		name="name"
		type="text"
		label="Name"
		value={data.organization.name}
		issues={editOrganization.fields.name.issues()}
	/>

	<Button type="submit">Submit</Button>
</form>
