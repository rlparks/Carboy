<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import { logout, me } from "$lib/components/header/account.remote";
	import NavLink from "$lib/components/header/NavLink.svelte";
	import Title from "$lib/components/header/Title.svelte";

	const { account } = $derived(await me());
</script>

<header class="mb-2 flex justify-between border-b border-gray-500 p-4 dark:border-gray-300">
	<nav class="flex items-center space-x-4">
		<Title />
		<NavLink href="/" text="Home" mode="exact" />
		<NavLink href="/trips" text="Trips" mode="exact" />
		<NavLink href="/admin" text="Admin" mode="startsWith" />
		<NavLink href="/super" text="Superadmin" mode="startsWith" />
	</nav>

	<div class="flex items-center space-x-4">
		{#if !account}
			<Button href="/login/oidc">Login</Button>
		{:else}
			<p>{account.name}</p>
			<form {...logout}>
				<Button type="submit">Logout</Button>
			</form>
		{/if}
	</div>
</header>
