<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { createDashboardKey } from "./createDashboardKey.remote";
</script>

<WindowTitle title="Create Dashboard Key" description="Create a new dashboard key." />
<PageTitle title="Create Dashboard Key" />

<form {...createDashboardKey} class="max-w-md space-y-4">
	<Input
		{...createDashboardKey.fields.name.as("text")}
		label="Name"
		issues={createDashboardKey.fields.name.issues()}
	/>

	<Button type="submit">Submit</Button>
</form>
