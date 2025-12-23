<script lang="ts">
	import { resolve } from "$app/paths";
	import Button from "$lib/components/Button.svelte";
	import Link from "$lib/components/Link.svelte";
	import Table from "$lib/components/table/Table.svelte";
	import TableCell from "$lib/components/table/TableCell.svelte";
	import TableRow from "$lib/components/table/TableRow.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const headers = ["Number", "Name", "Mileage", "Department", "Archived", "Trip Count"];
</script>

<WindowTitle title="Vehicles" description="View and manage vehicles." />

<header class="flex items-center justify-end">
	<Button href={resolve("/admin/vehicles/create")}>Create</Button>
</header>

<Table {headers}>
	{#await data.vehicles}
		<TableRow>
			<TableCell colspan={headers.length} class="text-center italic">Loading...</TableCell>
		</TableRow>
	{:then vehicles}
		{#each vehicles.toSorted((a, b) => b.tripCount - a.tripCount) as vehicle (vehicle.id)}
			<TableRow>
				<TableCell>
					<Link href={resolve("/admin/vehicles/[id]", { id: vehicle.id })}>
						{vehicle.number}
					</Link>
				</TableCell>
				<TableCell>{vehicle.name}</TableCell>
				<TableCell>{vehicle.mileage ?? "N/A"}</TableCell>
				<TableCell>
					<Link href={resolve("/admin/departments/[id]", { id: vehicle.departmentId })}>
						{#if vehicle.departmentName}
							{vehicle.departmentName}
						{:else}
							<span class="italic">&lt;blank&gt;</span>
						{/if}
					</Link>
				</TableCell>
				<TableCell>{vehicle.archived ? "Yes" : "No"}</TableCell>
				<TableCell>{vehicle.tripCount}</TableCell>
			</TableRow>
		{:else}
			<TableRow>
				<TableCell colspan={headers.length} class="text-center italic">
					No vehicles found.
				</TableCell>
			</TableRow>
		{/each}
	{/await}
</Table>
