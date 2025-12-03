<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<thead class="ltr:text-left rtl:text-right">
	{@render children()}
</thead>
