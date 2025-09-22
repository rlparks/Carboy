<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import NavLink from "$lib/components/header/NavLink.svelte";
	import Title from "$lib/components/header/Title.svelte";
</script>

<header class="flex justify-between border-b border-gray-500 p-4 dark:border-gray-300">
	<nav class="flex items-center space-x-4">
		<Title />
		<NavLink href="/" text="Home" mode="exact" />
		<NavLink href="/trips" text="Trips" mode="exact" />
		<NavLink href="/admin" text="Admin" mode="startsWith" />
		<NavLink href="/config" text="Config" mode="exact" />
	</nav>

	<div class="flex items-center space-x-4">
		<Button href="/login/oidc">Login</Button>
	</div>
</header>
