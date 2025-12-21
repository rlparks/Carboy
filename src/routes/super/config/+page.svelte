<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { setDistanceConfig } from "./config.remote";

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	const initialConfig = data.config;

	setDistanceConfig.fields.set({
		distanceWarningStart: initialConfig.warningStart?.toString() ?? "",
		distanceErrorStart: initialConfig.errorStart?.toString() ?? "",
	});
</script>

<WindowTitle
	title="Distance Configuration"
	description="Configure distance thresholds for check-in warnings and errors."
/>

<form {...setDistanceConfig} class="max-w-md space-y-4">
	<Input
		{...setDistanceConfig.fields.distanceWarningStart.as("text")}
		label="Distance Warning Threshold (miles)"
		helperText="Mileage at which to show a warning during check-in"
		issues={setDistanceConfig.fields.distanceWarningStart.issues()}
	/>

	<Input
		{...setDistanceConfig.fields.distanceErrorStart.as("text")}
		label="Distance Error Threshold (miles)"
		helperText="Mileage at which to show an error during check-in"
		issues={setDistanceConfig.fields.distanceErrorStart.issues()}
	/>

	<Button type="submit">Save</Button>
</form>
