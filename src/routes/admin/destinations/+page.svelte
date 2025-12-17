<script lang="ts">
	import { resolve } from "$app/paths";
	import Button from "$lib/components/Button.svelte";
	import Link from "$lib/components/Link.svelte";
	import Table from "$lib/components/table/Table.svelte";
	import TableCell from "$lib/components/table/TableCell.svelte";
	import TableRow from "$lib/components/table/TableRow.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const headers = ["Name", "Short Name", "Address"];
	// TODO: trip count
</script>

<WindowTitle title="Destinations" description="View and manage destinations." />

<header class="flex items-center justify-between">
	<aside class="italic">Note: destinations are shared across all organizations.</aside>
	<Button href={resolve("/admin/destinations/create")}>Create</Button>
</header>

<Table {headers}>
	{#await data.destinations}
		<TableRow>
			<TableCell colspan={headers.length} class="text-center italic">Loading...</TableCell>
		</TableRow>
	{:then destinations}
		{#each destinations as destination (destination.id)}
			<TableRow>
				<TableCell>
					<Link href={resolve("/admin/destinations/[id]", { id: destination.id })}>
						{destination.name}
					</Link>
				</TableCell>
				<TableCell>{destination.shortName}</TableCell>
				<TableCell>{destination.address}</TableCell>
			</TableRow>
		{:else}
			<TableRow>
				<TableCell colspan={headers.length} class="text-center italic">
					No destinations found.
				</TableCell>
			</TableRow>
		{/each}
	{/await}
</Table>
