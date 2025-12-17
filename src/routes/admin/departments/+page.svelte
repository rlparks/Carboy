<script lang="ts">
	import { resolve } from "$app/paths";
	import Button from "$lib/components/Button.svelte";
	import Link from "$lib/components/Link.svelte";
	import Table from "$lib/components/table/Table.svelte";
	import TableCell from "$lib/components/table/TableCell.svelte";
	import TableRow from "$lib/components/table/TableRow.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const headers = ["Name"];
</script>

<WindowTitle title="Departments" description="Manage the departments within your organization." />

<header class="flex justify-end">
	<Button href="/admin/departments/create">Create</Button>
</header>

<Table {headers}>
	{#await data.departments}
		<TableRow>
			<TableCell colspan={headers.length} class="text-center italic">Loading...</TableCell>
		</TableRow>
	{:then departments}
		{#each departments as department (department.id)}
			<TableRow>
				<TableCell>
					<Link href={resolve("/admin/departments/[id]", { id: department.id })}>
						{department.name}
					</Link>
				</TableCell>
			</TableRow>
		{:else}
			<TableRow>
				<TableCell colspan={headers.length} class="text-center italic">
					No departments found.
				</TableCell>
			</TableRow>
		{/each}
	{/await}
</Table>
