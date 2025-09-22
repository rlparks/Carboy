<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import { logout, me } from "$lib/components/header/account.remote";
	import NavLink from "$lib/components/header/NavLink.svelte";
	import Title from "$lib/components/header/Title.svelte";

	const { account } = $derived(await me());
</script>

<header class="mb-2 flex justify-between border-b-4 border-bulldog">
	<nav class="flex items-center space-x-4">
		<Title />
		<ul class="flex items-center space-x-4 py-4">
			<li>
				<NavLink href="/" text="Home" mode="exact" />
			</li>
			<li>
				<NavLink href="/trips" text="Trips" mode="exact" />
			</li>
			<li>
				<NavLink href="/admin" text="Admin" mode="startsWith" />
			</li>
			<li>
				<NavLink href="/super" text="Superadmin" mode="startsWith" />
			</li>
		</ul>
	</nav>

	<div class="flex items-center space-x-4 p-4">
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
