<script lang="ts">
	import { resolve } from "$app/paths";
	import NavLink from "$lib/components/header/NavLink.svelte";

	let { children } = $props();
</script>

<div class="mb-4 flex justify-center">
	<nav class="space-x-4">
		<NavLink href="/super/organizations" text="Organizations" mode="startsWith" />
		<!-- decorative mode -->
		<NavLink
			href={resolve("/admin/accounts") + "?all=true"}
			text="All Accounts"
			mode="startsWith"
		/>
		<NavLink href="/super/config" text="OIDC Config" mode="startsWith" />
	</nav>
</div>

{@render children()}
