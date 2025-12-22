<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		href?: string;
		onclick?: () => void;
		children: Snippet;
		type?: "button" | "submit" | "reset";
		disabled?: boolean;
	};

	let { href, onclick, children, type = "button", disabled }: Props = $props();

	const standardButtonClasses =
		"flex items-center border px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50";
</script>

{#if href}
	<a {href} {onclick} class={standardButtonClasses + " w-fit"}>
		{@render children?.()}
	</a>
{:else}
	<button {onclick} class={[standardButtonClasses, "cursor-pointer"]} {disabled} {type}>
		{@render children?.()}
	</button>
{/if}
