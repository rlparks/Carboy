<script lang="ts">
	import type { ResolvedPathname } from "$app/types";
	import type { Snippet } from "svelte";

	type Props = {
		href: ResolvedPathname;
		children: Snippet;
	};

	let { href, children }: Props = $props();
</script>

<a class="text-blue-600 hover:text-blue-700 hover:underline" {href}>
	{@render children()}
</a>
