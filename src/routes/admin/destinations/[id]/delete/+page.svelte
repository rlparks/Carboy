<script lang="ts">
	import { resolve } from "$app/paths";
	import Button from "$lib/components/Button.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { deleteDestination } from "./deleteDestination.remote";

	let { data } = $props();

	const title = $derived(`Delete Destination ${data.destination.name}`);
</script>

<WindowTitle {title} description={`Delete destination: ${data.destination.name}`} />
<PageTitle {title} />

<div class="max-w-md space-y-4">
	<p class="text-lg">
		Are you sure you want to delete destination
		<span class="font-bold">{data.destination.name}</span>?
	</p>

	<p class="text-sm text-gray-600 dark:text-gray-400">
		This action cannot be undone. The destination will be permanently removed from the system.
	</p>

	<form {...deleteDestination} class="flex gap-2">
		<input type="hidden" name="id" value={data.destination.id} />
		<Button type="submit">Delete</Button>
		<Button href={resolve("/admin/destinations/[id]", { id: data.destination.id })}>Cancel</Button>
	</form>
</div>
