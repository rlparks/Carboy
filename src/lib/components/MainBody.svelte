<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();
</script>

<main class="m-4 space-y-4">
	{@render children()}
</main>
