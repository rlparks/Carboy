<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import Select from "$lib/components/Select.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { createVehicle } from "./createVehicle.remote";

	let { data } = $props();
</script>

<WindowTitle title="Create Vehicle" description="Create a new vehicle." />
<PageTitle title="Create Vehicle" />

<form {...createVehicle} class="max-w-md space-y-4">
	<Input
		{...createVehicle.fields.number.as("text")}
		label="Number"
		helperText="Must be unique."
		issues={createVehicle.fields.number.issues()}
	/>

	<Input
		{...createVehicle.fields.name.as("text")}
		label="Name"
		issues={createVehicle.fields.name.issues()}
		helperText="e.g. 2016 Ford Explorer"
	/>

	<Select
		name="departmentId"
		label="Department"
		options={data.departments.map((dept) => ({ value: dept.id, label: dept.name }))}
		placeholder="Select a department"
		issues={createVehicle.fields.departmentId.issues()}
	/>

	<Input
		{...createVehicle.fields.mileage.as("text")}
		label="Mileage"
		helperText="Leave blank if not applicable."
		issues={createVehicle.fields.mileage.issues()}
	/>

	<Button type="submit">Submit</Button>
</form>
