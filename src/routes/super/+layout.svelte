<script lang="ts">
	import NavLink from "$lib/components/header/NavLink.svelte";

	let { children } = $props();
</script>

<div class="mb-2 flex justify-center">
	<nav class="space-x-4">
		<NavLink href="/super/organizations" text="Organizations" mode="exact" />
		<NavLink href="/super/config" text="OIDC Config" mode="exact" />
	</nav>
</div>

{@render children()}
