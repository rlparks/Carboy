<script lang="ts">
	import NavLink from "$lib/components/header/NavLink.svelte";

	let { children } = $props();
</script>

<div class="mb-4 flex justify-center">
	<nav class="space-x-4">
		<NavLink href="/super/organizations" text="Organizations" mode="startsWith" />
		<NavLink href="/super/config" text="OIDC Config" mode="startsWith" />
	</nav>
</div>

{@render children()}
