<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import Button from "$lib/components/Button.svelte";
	import Checkbox from "$lib/components/Checkbox.svelte";
	import FilterChip from "$lib/components/FilterChip.svelte";
	import Input from "$lib/components/Input.svelte";
	import Link from "$lib/components/Link.svelte";
	import Select from "$lib/components/Select.svelte";
	import Table from "$lib/components/table/Table.svelte";
	import TableCell from "$lib/components/table/TableCell.svelte";
	import TableRow from "$lib/components/table/TableRow.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const headers = [
		"",
		"Vehicle",
		"Account",
		"Starting Time",
		"Ending Time",
		"Destinations",
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
					<form class="w-sm space-y-2" onsubmit={() => (showFilter = false)}>
						<Input
							label="Vehicle Number"
							name="vehicleNumber"
							value={page.url.searchParams.get("vehicleNumber") ?? undefined}
						/>
						<Input
							label="Started By"
							name="startedBy"
							value={page.url.searchParams.get("startedBy") ?? undefined}
						/>
						<Input
							label="Ended By"
							name="endedBy"
							value={page.url.searchParams.get("endedBy") ?? undefined}
						/>

						<Checkbox
							label="Ended By Different User"
							name="endedByDifferentUser"
							checked={page.url.searchParams.get("endedByDifferentUser") === "true"}
						/>

						<div>
							<label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
								Start Time
								<div class="flex items-center gap-2">
									<div class="flex-1">
										<Input
											type="date"
											name="startTimeFrom"
											value={page.url.searchParams.get("startTimeFrom") ?? undefined}
										/>
									</div>
									<div class="whitespace-nowrap">to</div>
									<div class="flex-1">
										<Input
											type="date"
											name="startTimeTo"
											value={page.url.searchParams.get("startTimeTo") ?? undefined}
										/>
									</div>
								</div>
							</label>
						</div>

						<div>
							<label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
								End Time
								<div class="flex items-center gap-2">
									<div class="flex-1">
										<Input
											type="date"
											name="endTimeFrom"
											value={page.url.searchParams.get("endTimeFrom") ?? undefined}
										/>
									</div>
									<div class="whitespace-nowrap">to</div>
									<div class="flex-1">
										<Input
											type="date"
											name="endTimeTo"
											value={page.url.searchParams.get("endTimeTo") ?? undefined}
										/>
									</div>
								</div>
							</label>
						</div>

						<div class="flex items-end gap-2">
							<div class="w-28">
								<Select
									label="Distance"
									name="distanceComparator"
									options={[
										{ value: "=", label: "=" },
										{ value: ">", label: ">" },
										{ value: "<", label: "<" },
										{ value: ">=", label: ">=" },
										{ value: "<=", label: "<=" },
									]}
									value={page.url.searchParams.get("distanceComparator") ?? "="}
								/>
							</div>
							<div class="flex-1">
								<Input
									type="number"
									name="distance"
									value={page.url.searchParams.get("distance") ?? undefined}
								/>
							</div>
						</div>

						<div class="flex justify-end">
							<Button type="submit">Submit</Button>
						</div>
					</form>
				{/if}
			</div>
		</div>
	</div>

	{#if data.chips.length > 0}
		<section class="flex gap-2">
			{#each data.chips as chip (chip.name + chip.value)}
				<FilterChip {...chip} />
			{/each}
		</section>
	{/if}

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
					<TableCell>
						{trip.startedByName}
						{#if trip.endedByName && trip.endedBy !== trip.startedBy}
							<span class="text-orange-400" title="Checked in by {trip.endedByName}">
								({trip.endedByName})
							</span>
						{/if}
					</TableCell>
					<TableCell>{trip.startTime.toLocaleString()}</TableCell>
					<TableCell>{trip.endTime?.toLocaleString() ?? ""}</TableCell>
					<TableCell class="max-w-50 truncate text-ellipsis">
						<span title={trip.destinations}>{trip.destinations}</span>
					</TableCell>
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
