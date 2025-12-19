<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import type { VehicleWithDepartment } from "$lib/types/bonus";

	type Props = {
		vehicle: VehicleWithDepartment;
	};

	let { vehicle }: Props = $props();
</script>

<div class="border">
	<section class="space-y-2 p-4">
		<p class="text-xl">{vehicle.number}</p>
		<p>{vehicle.name}</p>

		{#if !vehicle.isCheckedOut}
			<div class="text-green-500">
				<Button>Check Out</Button>
			</div>
		{:else}
			<div class="text-blue-500">
				<Button>Check In</Button>
			</div>
		{/if}
	</section>
</div>
