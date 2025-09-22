<script lang="ts">
	import NavLink from "$lib/components/header/NavLink.svelte";

	let { children } = $props();
</script>

<div class="mb-4 flex justify-center">
	<nav class="space-x-4">
		<NavLink href="/admin/vehicles" text="Vehicles" mode="exact" />
		<NavLink href="/admin/destinations" text="Destinations" mode="exact" />
		<NavLink href="/admin/accounts" text="Accounts" mode="exact" />
	</nav>
</div>

{@render children()}
