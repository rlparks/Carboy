<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<tr class="hover:bg-black/10 dark:hover:bg-white/20">
	{@render children()}
</tr>
