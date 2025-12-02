<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import Header from "$lib/components/header/Header.svelte";
	import "../app.css";

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header account={data.account} />

{@render children?.()}
