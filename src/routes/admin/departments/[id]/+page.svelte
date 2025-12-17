<script lang="ts">
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const title = $derived(data.department.name || "<blank>");
</script>

<WindowTitle {title} description="View department details." />
<PageTitle {title} />
