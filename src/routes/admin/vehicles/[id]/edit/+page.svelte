<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Checkbox from "$lib/components/Checkbox.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import Select from "$lib/components/Select.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { editVehicle } from "./editVehicle.remote";

	let { data } = $props();

	const title = $derived(`Edit Vehicle ${data.vehicle.number}`);
</script>

<WindowTitle {title} description={`Edit vehicle: ${data.vehicle.number} (${data.vehicle.name})`} />
<PageTitle {title} />

<form {...editVehicle} class="max-w-md space-y-4" enctype="multipart/form-data">
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

	{#if data.departments}
		<Select
			name="departmentId"
			label="Department"
			options={data.departments.map((dept) => ({ value: dept.id, label: dept.name }))}
			value={data.vehicle.departmentId}
			placeholder="Select a department"
			issues={editVehicle.fields.departmentId.issues()}
		/>
	{:else}
		<Select
			name="departmentId"
			label="Department"
			optionGroups={data.departmentGroups}
			value={data.vehicle.departmentId}
			placeholder="Select a department"
			issues={editVehicle.fields.departmentId.issues()}
		/>
	{/if}

	<Input
		name="mileage"
		type="text"
		label="Mileage"
		helperText="Leave blank if not applicable. The next trip will begin with this mileage."
		value={data.vehicle.mileage ?? ""}
		issues={editVehicle.fields.mileage.issues()}
	/>

	<Checkbox name="b:archived" label="Archived" checked={data.vehicle.archived} />

	<Checkbox {...editVehicle.fields.updateImage.as("checkbox")} label="Update Image" />

	{#if editVehicle.fields.updateImage.value()}
		<Input
			name="image"
			type="file"
			label="Image"
			issues={editVehicle.fields.image.issues()}
			accept="image/jpeg, image/png, image/webp"
			helperText="Leaving this blank will remove the vehicle's image."
		/>
	{/if}

	<Button type="submit">Submit</Button>
</form>
