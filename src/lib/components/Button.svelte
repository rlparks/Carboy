<script lang="ts">
	import type { ResolvedPathname } from "$app/types";
	import type { Snippet } from "svelte";

	type Props = {
		href?: ResolvedPathname;
		onclick?: () => void;
		children: Snippet;
		type?: "button" | "submit" | "reset";
	};

	let { href, onclick, children, type = "button" }: Props = $props();

	const standardButtonClasses =
		"flex items-center border px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700";
</script>

{#if href}
	<a {href} {onclick} class={standardButtonClasses + " w-fit"}>
		{@render children?.()}
	</a>
{:else}
	<button {onclick} class={[standardButtonClasses, "cursor-pointer"]} {type}>
		{@render children?.()}
	</button>
{/if}
