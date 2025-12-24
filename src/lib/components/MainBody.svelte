<script lang="ts">
	import { page } from "$app/state";
	import type { Snippet } from "svelte";

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();
</script>

<main class={page.route.id !== "/dashboard" ? "m-4 space-y-4" : "space-y-4"}>
	{@render children()}
</main>
