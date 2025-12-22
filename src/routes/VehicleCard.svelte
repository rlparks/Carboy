<script lang="ts">
	import { resolve } from "$app/paths";
	import noImageImage from "$lib/assets/noimage.webp";
	import Button from "$lib/components/Button.svelte";
	import type { VehicleWithDepartment } from "$lib/types/bonus";

	type Props = {
		vehicle: VehicleWithDepartment;
	};

	let { vehicle }: Props = $props();
</script>

<div class={["border", vehicle.isCheckedOut ? "border-blue-500" : "border-green-500"]}>
	<img
		alt={vehicle.hasImage ? `Vehicle ${vehicle.number}` : "Solid black placeholder"}
		src={vehicle.hasImage ? `/api/images/vehicles/${vehicle.number}` : noImageImage}
	/>
	<section class="space-y-2 p-4">
		<p class="truncate text-xl text-ellipsis">{vehicle.number}</p>
		<p class="truncate text-ellipsis">{vehicle.name}</p>

		{#if !vehicle.isCheckedOut}
			<div class="text-green-500">
				<Button href={resolve("/checkout/[vehicleNumber]", { vehicleNumber: vehicle.number })}>
					Check Out
				</Button>
			</div>
		{:else}
			<div class="text-blue-500">
				<Button href={resolve("/checkin/[vehicleNumber]", { vehicleNumber: vehicle.number })}>
					Check In
				</Button>
			</div>
		{/if}
	</section>
	{#if vehicle.destinations}
		<section
			class="truncate border-t border-blue-500 px-4 py-2 text-nowrap"
			title={vehicle.destinations}
		>
			{vehicle.destinations}
		</section>
	{/if}
	{#if vehicle.startedByName}
		<section
			class="truncate border-t border-blue-500 px-4 py-2 text-nowrap"
			title={vehicle.startedByName}
		>
			{vehicle.startedByName}
		</section>
	{/if}
</div>
