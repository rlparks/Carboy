<script lang="ts">
	import NavLink from "$lib/components/header/NavLink.svelte";

	let { children } = $props();
</script>

<div class="mb-4 flex justify-center">
	<nav class="space-x-4">
		<NavLink href="/admin/vehicles" text="Vehicles" mode="startsWith" />
		<NavLink href="/admin/destinations" text="Destinations" mode="startsWith" />
		<NavLink href="/admin/departments" text="Departments" mode="startsWith" />
		<NavLink href="/admin/accounts" text="Accounts" mode="startsWith" />
		<NavLink href="/admin/dashboard" text="Dashboard Keys" mode="startsWith" />
	</nav>
</div>

{@render children()}
