<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import Header from "$lib/components/header/Header.svelte";
	import "../app.css";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:boundary>
	<Header />

	{@render children?.()}

	{#snippet pending()}
		Loading... (temp)
	{/snippet}
</svelte:boundary>
