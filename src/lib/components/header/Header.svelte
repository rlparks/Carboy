<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import { logout } from "$lib/components/header/account.remote";
	import NavLink from "$lib/components/header/NavLink.svelte";
	import OrganizationSwitcher from "$lib/components/header/org-switcher/OrganizationSwitcher.svelte";
	import Title from "$lib/components/header/Title.svelte";
	import type { FriendlyAccount } from "$lib/types/bonus";
	import type { Organization } from "$lib/types/db";

	type Props = {
		account: FriendlyAccount | null;
		organizations: Organization[];
		selectedOrganizationId: string | null;
	};

	let { account, organizations, selectedOrganizationId }: Props = $props();
</script>

<header class="mb-2 flex justify-between border-b-4 border-bulldog">
	<nav class="flex items-center space-x-4">
		<Title />
		<ul class="flex items-center space-x-4 py-4">
			{#if account}
				<li>
					<NavLink href="/" text="Home" mode="exact" />
				</li>
				<li>
					<NavLink href="/trips" text="Trips" mode="exact" />
				</li>
				<!-- TODO: dashboard -->
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
		</ul>
	</nav>

	<div class="flex items-center space-x-4 p-4">
		{#if !account}
			<Button href="/login/oidc">Login</Button>
		{:else}
			<OrganizationSwitcher {organizations} {selectedOrganizationId} />
			<p>{account.name}</p>
			<form {...logout}>
				<Button type="submit">Logout</Button>
			</form>
		{/if}
	</div>
</header>
