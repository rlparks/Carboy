<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import Button from "$lib/components/Button.svelte";
	import Link from "$lib/components/Link.svelte";
	import Table from "$lib/components/table/Table.svelte";
	import TableCell from "$lib/components/table/TableCell.svelte";
	import TableRow from "$lib/components/table/TableRow.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const headers = ["Name", "URL", "Created At"];
</script>

<WindowTitle title="Dashboard Keys" description="View and manage dashboard keys." />

<header class="flex items-center justify-between">
	<aside class="italic">
		Keys are specific to each organization and can help with digital signage authentication.
	</aside>
	<Button href={resolve("/admin/dashboard/create")}>Create</Button>
</header>

<Table {headers}>
	{#await data.dashboardKeys}
		<TableRow>
			<TableCell colspan={headers.length} class="text-center italic">Loading...</TableCell>
		</TableRow>
	{:then dashboardKeys}
		{#each dashboardKeys as dashboardKey (dashboardKey.id)}
			{@const url = page.url.origin + "/dashboard?key=" + dashboardKey.key}
			<TableRow>
				<TableCell>
					<Link href={resolve("/admin/dashboard/[id]", { id: dashboardKey.id })}>
						{#if dashboardKey.name}
							{dashboardKey.name}
						{:else}
							<span class="italic">&lt;blank&gt;</span>
						{/if}
					</Link>
				</TableCell>
				<TableCell>
					<Link href={url}>{url}</Link>
				</TableCell>
				<TableCell>{dashboardKey.createdAt.toLocaleString()}</TableCell>
			</TableRow>
		{:else}
			<TableRow>
				<TableCell colspan={headers.length} class="text-center italic">
					No dashboard keys found.
				</TableCell>
			</TableRow>
		{/each}
	{/await}
</Table>
