<script lang="ts">
	import Table from "$lib/components/table/Table.svelte";
	import TableCell from "$lib/components/table/TableCell.svelte";
	import TableRow from "$lib/components/table/TableRow.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const headers = ["Username", "Name", "Email", "Archived"];
</script>

<WindowTitle title="Accounts" description="View and manage user accounts." />

<Table {headers}>
	{#await data.accounts}
		<TableRow>
			<TableCell colspan={headers.length} class="text-center italic">Loading...</TableCell>
		</TableRow>
	{:then accounts}
		{#each accounts as account (account.id)}
			<TableRow>
				<TableCell>{account.username}</TableCell>
				<TableCell>{account.name}</TableCell>
				<TableCell>{account.email}</TableCell>
				<TableCell>{account.archived}</TableCell>
			</TableRow>
		{/each}
	{/await}
</Table>
