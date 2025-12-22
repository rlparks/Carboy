<script lang="ts">
	import { resolve } from "$app/paths";
	import Link from "$lib/components/Link.svelte";
	import Table from "$lib/components/table/Table.svelte";
	import TableCell from "$lib/components/table/TableCell.svelte";
	import TableRow from "$lib/components/table/TableRow.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const headers = ["", "Vehicle", "Driver", "Start Time", "End Time", "Distance", "Notes"];
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
				<TableCell>
					<Link href={resolve("/trips/[id]", { id: trip.id })}>View</Link>
				</TableCell>
				<TableCell>{trip.vehicleNumber}</TableCell>
				<TableCell>{trip.startedByName}</TableCell>
				<TableCell>{trip.startTime.toLocaleString()}</TableCell>
				<TableCell>{trip.endTime?.toLocaleString() ?? ""}</TableCell>
				<TableCell>{trip.distance !== null ? trip.distance.toLocaleString() : "N/A"}</TableCell>
				<TableCell>{trip.noteCount}</TableCell>
			</TableRow>
		{:else}
			<TableRow>
				<TableCell colspan={headers.length} class="text-center italic">No trips found.</TableCell>
			</TableRow>
		{/each}
	{/await}
</Table>
