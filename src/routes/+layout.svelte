<script lang="ts">
	import { page } from "$app/state";
	import favicon from "$lib/assets/favicon.svg";
	import Header from "$lib/components/header/Header.svelte";
	import MainBody from "$lib/components/MainBody.svelte";
	import "../app.css";

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if page.route.id !== "/dashboard"}
	<Header
		account={data.account}
		organizations={data.accountOrganizations}
		selectedOrganizationId={data.selectedOrganizationId}
		isImpersonating={data.impersonatedBy !== null}
	/>
{/if}

<MainBody>
	{#if data.account && !data.selectedOrganizationId && !page.route.id?.startsWith("/super")}
		<p>Please select an organization.</p>
	{:else}
		{@render children?.()}
	{/if}
</MainBody>
