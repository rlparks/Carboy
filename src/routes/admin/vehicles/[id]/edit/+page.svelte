<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import Select from "$lib/components/Select.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { editVehicle } from "./editVehicle.remote";

	let { data } = $props();

	const title = $derived(`Edit ${data.vehicle.number}`);
</script>

<WindowTitle {title} description={`Edit vehicle: ${data.vehicle.number} (${data.vehicle.name})`} />
<PageTitle {title} />

<form {...editVehicle} class="max-w-md space-y-4">
	<input {...editVehicle.fields.id.as("hidden", data.vehicle.id)} />

	<Input
		name="number"
		type="text"
		label="Number"
		helperText="Must be unique."
		value={data.vehicle.number}
		issues={editVehicle.fields.number.issues()}
	/>

	<Input
		name="name"
		type="text"
		label="Name"
		value={data.vehicle.name}
		issues={editVehicle.fields.name.issues()}
		helperText="e.g. 2016 Ford Explorer"
	/>

	<Select
		name="departmentId"
		label="Department"
		options={data.departments.map((dept) => ({ value: dept.id, label: dept.name }))}
		value={data.vehicle.departmentId}
		placeholder="Select a department"
		issues={editVehicle.fields.departmentId.issues()}
	/>

	<Input
		name="mileage"
		type="text"
		label="Mileage"
		helperText="Leave blank if not applicable. The next trip will begin with this mileage."
		value={data.vehicle.mileage ?? ""}
		issues={editVehicle.fields.mileage.issues()}
	/>

	<Button type="submit">Submit</Button>
</form>
