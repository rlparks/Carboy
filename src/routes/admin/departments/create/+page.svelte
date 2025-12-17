<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { createDepartment } from "./createDepartment.remote";

	const title = "Create Department";
</script>

<WindowTitle {title} description="Create a new department." />
<PageTitle {title} />

<form {...createDepartment} class="max-w-md space-y-4">
	<Input
		label="Name"
		{...createDepartment.fields.name.as("text")}
		issues={createDepartment.fields.name.issues()}
		helperText="Must be unique within the organization."
	/>

	<Button type="submit">Submit</Button>
</form>
