<script lang="ts">
	import Table from "$lib/components/table/Table.svelte";
	import TableCell from "$lib/components/table/TableCell.svelte";
	import TableRow from "$lib/components/table/TableRow.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const headers = ["Vehicle", "Driver", "Start Time", "End Time", "Distance"];
</script>

<WindowTitle title="Trips" description="View and manage trips." />

<Table {headers}>
	{#await data.trips}
		<TableRow>
			<TableCell colspan={headers.length} class="text-center italic">Loading trips...</TableCell>
		</TableRow>
	{:then trips}
		{#each trips as trip (trip.id)}
			<TableRow>
				<TableCell>{trip.vehicleNumber}</TableCell>
				<TableCell>{trip.startedByName}</TableCell>
				<TableCell>{trip.startTime.toLocaleString()}</TableCell>
				<TableCell>{trip.endTime?.toLocaleString() ?? ""}</TableCell>
				<TableCell>{trip.distance !== null ? trip.distance.toLocaleString() : "N/A"}</TableCell>
			</TableRow>
		{:else}
			<TableRow>
				<TableCell colspan={headers.length} class="text-center italic">No trips found.</TableCell>
			</TableRow>
		{/each}
	{/await}
</Table>
