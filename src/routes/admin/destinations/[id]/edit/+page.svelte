<script lang="ts">
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const title = $derived(`Edit ${data.destination.name}`);
</script>

<WindowTitle {title} description={`Edit destination: ${data.destination.name}`} />
<PageTitle {title} />
