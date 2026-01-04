<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { deleteDashboardKey } from "./deleteDashboardKey.remote";

	let { data } = $props();

	const title = $derived(`Delete Dashboard Key ${data.dashboardKey.name}`);
</script>

<WindowTitle {title} description={`Delete dashboard key: ${data.dashboardKey.name}`} />
<PageTitle {title} />

<div class="max-w-md space-y-4">
	<p class="text-lg">
		Are you sure you want to delete dashboard key
		<span class="font-bold">{data.dashboardKey.name}</span>?
	</p>

	<p class="text-sm text-gray-600 dark:text-gray-400">
		This action cannot be undone. The dashboard key will be permanently removed from the system.
	</p>

	<form {...deleteDashboardKey} class="flex gap-2">
		<input type="hidden" name="id" value={data.dashboardKey.id} />
		<Button type="submit">Delete</Button>
		<Button href={`/admin/dashboard/${data.dashboardKey.id}`}>Cancel</Button>
	</form>
</div>
