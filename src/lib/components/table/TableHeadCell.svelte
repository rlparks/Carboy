<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<th class="px-4 py-2 font-bold whitespace-nowrap">
	{@render children()}
</th>
