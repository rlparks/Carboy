<script lang="ts">
	import { resolve } from "$app/paths";
	import Button from "$lib/components/Button.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const title = $derived(`Destination ${data.destination.name}`);
</script>

<WindowTitle {title} description={`Manage destination: ${data.destination.name}`} />

<header class="flex justify-between">
	<PageTitle {title} />
	<div class="flex gap-2">
		<Button href={resolve("/admin/destinations/[id]/merge", { id: data.destination.id })}>
			Merge
		</Button>
		<Button href={resolve("/admin/destinations/[id]/edit", { id: data.destination.id })}>
			Edit
		</Button>
		{#if data.tripCount === 0}
			<Button href={resolve("/admin/destinations/[id]/delete", { id: data.destination.id })}>
				Delete
			</Button>
		{/if}
	</div>
</header>

<div class="grid max-w-md grid-cols-2 gap-4">
	<p class="font-semibold">Name:</p>
	<p>{data.destination.name}</p>

	<p class="font-semibold">Short Name:</p>
	<p>{data.destination.shortName}</p>

	<p class="font-semibold">Address:</p>
	<p>{data.destination.address}</p>

	<p class="font-semibold">Created At:</p>
	<p>{data.destination.createdAt.toLocaleString()}</p>

	<p class="font-semibold">Updated At:</p>
	<p>{data.destination.updatedAt?.toLocaleString() ?? "Never"}</p>
</div>
