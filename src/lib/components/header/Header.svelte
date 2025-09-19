<script lang="ts">
	import NavLink from "$lib/components/header/NavLink.svelte";
	import Title from "$lib/components/header/Title.svelte";
</script>

<header class="flex justify-between p-4">
	<nav class="flex items-center space-x-4">
		<Title />
		<NavLink href="/" text="Home" mode="exact" />
		<NavLink href="/trips" text="Trips" mode="exact" />
		<NavLink href="/admin" text="Admin" mode="startsWith" />
	</nav>
</header>
