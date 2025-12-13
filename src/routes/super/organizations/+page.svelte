<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import MainBody from "$lib/components/MainBody.svelte";
	import Table from "$lib/components/table/Table.svelte";
	import TableCell from "$lib/components/table/TableCell.svelte";
	import TableRow from "$lib/components/table/TableRow.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const headers = ["Name", "Slug", "Created At"];
</script>

<WindowTitle title="Organizations" description="View and manage organizations." />

<MainBody>
	<div class="flex justify-center">
		<Button href="/super/organizations/create">Create</Button>
	</div>

	<Table {headers}>
		{#each data.organizations as org (org.id)}
			<TableRow>
				<TableCell>{org.name}</TableCell>
				<TableCell>{org.slug}</TableCell>
				<TableCell>{org.createdAt}</TableCell>
			</TableRow>
		{/each}
	</Table>
</MainBody>
