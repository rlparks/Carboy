<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		children: Snippet;
		colspan?: number;
		class?: string;
	};

	let { children, colspan, class: additionalClasses }: Props = $props();
</script>

<td class="px-4 py-4 whitespace-nowrap {additionalClasses}" {colspan}>
	{@render children()}
</td>
