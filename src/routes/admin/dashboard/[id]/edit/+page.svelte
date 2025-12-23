<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { editDashboardKey } from "./editDashboardKey.remote";

	let { data } = $props();

	const title = $derived(`Edit Dashboard Key ${data.dashboardKey.name ?? "Unnamed"}`);
</script>

<WindowTitle {title} description={`Edit dashboard key: ${data.dashboardKey.name ?? "Unnamed"}`} />
<PageTitle {title} />

<form {...editDashboardKey} class="max-w-md space-y-4">
	<input {...editDashboardKey.fields.id.as("hidden", data.dashboardKey.id)} />

	<Input
		name="name"
		type="text"
		label="Name"
		value={data.dashboardKey.name ?? ""}
		issues={editDashboardKey.fields.name.issues()}
	/>

	<Button type="submit">Submit</Button>
</form>
