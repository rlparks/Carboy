<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { editDepartment } from "./editDepartment.remote";

	let { data } = $props();

	const title = $derived(`Edit Department ${data.department.name || "<blank>"}`);
</script>

<WindowTitle {title} description={`Edit department: ${data.department.name}`} />
<PageTitle {title} />

<form {...editDepartment} class="max-w-md space-y-4">
	<input {...editDepartment.fields.id.as("hidden", data.department.id)} />

	<Input
		name="name"
		type="text"
		label="Name"
		value={data.department.name}
		issues={editDepartment.fields.name.issues()}
	/>

	<Button type="submit">Submit</Button>
</form>
