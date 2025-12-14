<script lang="ts">
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();
</script>

<WindowTitle title={`Account: ${data.account.username}`} description="View account information." />
