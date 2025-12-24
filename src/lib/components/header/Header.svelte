<script lang="ts">
	import { onNavigate } from "$app/navigation";
	import Button from "$lib/components/Button.svelte";
	import { logout } from "$lib/components/header/account.remote";
	import NavLink from "$lib/components/header/NavLink.svelte";
	import OrganizationSwitcher from "$lib/components/header/org-switcher/OrganizationSwitcher.svelte";
	import Title from "$lib/components/header/Title.svelte";
	import type { FriendlyAccount } from "$lib/types/bonus";
	import type { Organization } from "$lib/types/db";
	import { slide } from "svelte/transition";
	import { stopImpersonating } from "../../../routes/admin/accounts/[username]/impersonate.remote";

	type Props = {
		account: FriendlyAccount | null;
		organizations: Organization[];
		selectedOrganizationId: string | null;
		isImpersonating: boolean;
	};

	let { account, organizations, selectedOrganizationId, isImpersonating }: Props = $props();

	let mobileNavOpen = $state(false);

	onNavigate(() => {
		mobileNavOpen = false;
	});
</script>

<header class="mb-2 border-b-4 border-bulldog">
	<div class="flex items-center justify-between">
		<nav class="flex items-center space-x-4">
			<Title />
			<ul class="hidden items-center space-x-4 py-4 md:flex">
				{@render navItems()}
			</ul>
		</nav>

		<div class="hidden items-center space-x-4 p-4 md:flex">
			{@render accountManagement()}
		</div>

		<button
			class="cursor-pointer md:hidden"
			title="Toggle mobile navigation"
			onclick={() => (mobileNavOpen = !mobileNavOpen)}
		>
			<!-- https://fonts.google.com/icons -->
			<!-- menu -->
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="mr-4 w-10 text-white">
				<path
					fill="currentColor"
					d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"
				/>
			</svg>
		</button>
	</div>

	{#if mobileNavOpen}
		<!-- hidden in case someone is having fun resizing their browser -->
		<!-- or maybe rotates a mobile device -->
		<nav transition:slide class="space-y-2 p-4 md:hidden">
			<ul class="space-y-2">
				{@render navItems()}
			</ul>

			<div class="flex w-full justify-end">
				<div class="flex items-center space-x-4 text-xs">
					{@render accountManagement()}
				</div>
			</div>
		</nav>
	{/if}
</header>

{#snippet navItems()}
	{#if account}
		<li>
			<NavLink href="/" text="Home" mode="exact" />
		</li>
		<li>
			<NavLink href="/trips" text="Trips" mode="startsWith" />
		</li>
		<li>
			<NavLink href="/dashboard" text="Dashboard" mode="exact" />
		</li>
	{/if}

	{#if account?.role === "admin" || account?.role === "superadmin"}
		<li>
			<NavLink href="/admin/vehicles" comparePath="/admin" text="Admin" mode="startsWith" />
		</li>
	{/if}

	{#if account?.role === "superadmin"}
		<li>
			<NavLink
				href="/super/organizations"
				comparePath="/super"
				text="Superadmin"
				mode="startsWith"
			/>
		</li>
	{/if}
{/snippet}

{#snippet accountManagement()}
	{#if !account}
		<Button href="/login/oidc">Login</Button>
	{:else}
		{#if isImpersonating}
			<form {...stopImpersonating}>
				<Button type="submit">Stop Impersonating</Button>
			</form>
		{/if}
		<OrganizationSwitcher {organizations} {selectedOrganizationId} />
		<p>{account.name}</p>
		<form {...logout}>
			<Button type="submit">Logout</Button>
		</form>
	{/if}
{/snippet}
