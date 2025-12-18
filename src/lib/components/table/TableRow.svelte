<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		children: Snippet;
		draggable?: boolean;
		ondragstart?: (event: DragEvent) => void;
		ondragover?: (event: DragEvent) => void;
		ondragleave?: (event: DragEvent) => void;
		ondrop?: (event: DragEvent) => void;
		class?: string;
	};

	let {
		children,
		draggable = false,
		ondragstart,
		ondragover,
		ondragleave,
		ondrop,
		class: className = "",
	}: Props = $props();
</script>

<tr
	class="hover:bg-black/10 dark:hover:bg-white/20 {className}"
	{draggable}
	{ondragstart}
	{ondragover}
	{ondragleave}
	{ondrop}
>
	{@render children()}
</tr>
