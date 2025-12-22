<script lang="ts">
	import TableHead from "$lib/components/table/TableHead.svelte";
	import TableHeadCell from "$lib/components/table/TableHeadCell.svelte";
	import type { Snippet } from "svelte";

	type Props = {
		headers: string[];
		children: Snippet;
	};
	let { headers, children }: Props = $props();
</script>

<div class="w-full overflow-x-auto">
	<table class="w-full min-w-max divide-y border">
		{#if headers.length > 0}
			<TableHead>
				<tr>
					{#each headers as header (header)}
						<TableHeadCell>
							{header}
						</TableHeadCell>
					{/each}
				</tr>
			</TableHead>
		{/if}

		<tbody class="divide-y">
			{@render children()}
		</tbody>
	</table>
</div>
