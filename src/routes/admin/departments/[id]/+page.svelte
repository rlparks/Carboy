<script lang="ts">
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();
</script>

<WindowTitle title={data.department.name} description="View department details." />
<PageTitle title={data.department.name} />
