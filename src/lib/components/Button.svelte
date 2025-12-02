<script lang="ts">
	import type { RouteId } from "$app/types";
	import { resolve } from "path";
	import type { Snippet } from "svelte";

	type Props = {
		href?: RouteId;
		onclick?: () => void;
		children: Snippet;
		type?: "button" | "submit" | "reset";
	};

	let { href, onclick, children, type = "button" }: Props = $props();

	const standardButtonClasses = "rounded border px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700";
</script>

{#if href}
	<a href={resolve(href)} {onclick} class={standardButtonClasses}>
		{@render children?.()}
	</a>
{:else}
	<button {onclick} class={[standardButtonClasses, "cursor-pointer"]} {type}>
		{@render children?.()}
	</button>
{/if}
