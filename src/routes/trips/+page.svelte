<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import Link from "$lib/components/Link.svelte";
	import Table from "$lib/components/table/Table.svelte";
	import TableCell from "$lib/components/table/TableCell.svelte";
	import TableRow from "$lib/components/table/TableRow.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const headers = [
		"",
		"Vehicle",
		"Started By",
		"Starting Time",
		"Ending Time",
		"Distance",
		"Notes",
	];

	let navPage = $derived(parseInt(page.url.searchParams.get("page") ?? "1"));
	const limit = 100;
	const offset = $derived((navPage - 1) * limit);

	const prevPageHref = $derived.by(() => {
		if (navPage <= 1) {
			return null;
		}

		const url = new URL(page.url);
		url.searchParams.set("page", (navPage - 1).toString());
		return url.pathname + url.search;
	});

	const nextPageHref = $derived.by(() => {
		const url = new URL(page.url);
		url.searchParams.set("page", (navPage + 1).toString());
		return url.pathname + url.search;
	});

	const downloadHref = $derived.by(() => {
		const url = new URL(page.url);
		url.searchParams.delete("page");

		const paramString = url.searchParams.toString();
		return paramString ? `/trips/download?${url.searchParams.toString()}` : "/trips/download";
	});

	let showFilter = $state(false);
</script>

<WindowTitle title="Trips" description="View and manage trips." />

<div class="space-y-2">
	<div class="flex items-end justify-between">
		{#await data.totalCount}
			<p>Loading count...</p>
		{:then totalCount}
			{@const startNum = Math.min(offset + 1, totalCount)}
			{@const endNum = Math.min(offset + limit, totalCount)}

			<p>
				{startNum.toLocaleString()} - {endNum.toLocaleString()} of {totalCount.toLocaleString()}
			</p>
		{/await}

		<div class="flex gap-2">
			<div class="h-fit">
				<Button href={downloadHref}>Download</Button>
			</div>
			<div class="flex flex-col items-end gap-2">
				<Button onclick={() => (showFilter = !showFilter)}>
					{#if !showFilter}
						Filter
					{:else}
						Close Filter
					{/if}
				</Button>
				{#if showFilter}
					<form class="space-y-2">
						<Input label="Vehicle Number" name="vehicleNumber" />
						<Button type="submit">Submit</Button>
					</form>
				{/if}
			</div>
		</div>
	</div>

	<Table {headers}>
		{#await data.trips}
			<TableRow>
				<TableCell colspan={headers.length} class="text-center italic">Loading trips...</TableCell>
			</TableRow>
		{:then trips}
			{#each trips as trip (trip.id)}
				<TableRow>
					<TableCell>
						<Link href={resolve("/trips/[id]", { id: trip.id })}>Details</Link>
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

	{#await data.totalCount then totalCount}
		{@const onLastPage = offset + limit >= totalCount}
		<div class="flex items-center justify-center space-x-4">
			<Button href={prevPageHref ?? undefined} disabled={navPage <= 1}>&lt;</Button>
			<p>{navPage}</p>
			<Button href={onLastPage ? undefined : nextPageHref} disabled={onLastPage}>&gt;</Button>
		</div>
	{/await}
</div>
