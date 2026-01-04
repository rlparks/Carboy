<script lang="ts">
	import { resolve } from "$app/paths";
	import Button from "$lib/components/Button.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { impersonate } from "./impersonate.remote";

	let { data } = $props();

	const title = $derived(`Account ${data.editAccount.name} (${data.editAccount.username})`);

	const isImpersonating = $derived(data.impersonatedBy !== null);
	const canImpersonate = $derived(data.account?.role === "superadmin");
</script>

<WindowTitle {title} description="View account information." />

<header class="flex justify-between">
	<PageTitle {title} />
	<div class="flex gap-2">
		{#if canImpersonate && !isImpersonating}
			<form {...impersonate}>
				<input {...impersonate.fields.accountId.as("hidden", data.editAccount.id)} />
				<Button type="submit">Impersonate</Button>
			</form>
		{/if}
		{#if data.account?.role === "superadmin" && data.editAccount.passwordEnabled}
			<Button
				href={resolve("/admin/accounts/[username]/setpassword", {
					username: data.editAccount.username,
				})}
			>
				Set Password
			</Button>
		{/if}
		{#if data.account?.role === "superadmin" || data.editAccount.role !== "superadmin"}
			<Button
				href={resolve("/admin/accounts/[username]/edit", { username: data.editAccount.username })}
			>
				Edit
			</Button>
		{/if}
		{#if data.tripCount === 0 && data.editAccount.id !== data.account?.id && (data.account?.role === "superadmin" || data.editAccount.role !== "superadmin")}
			<Button
				href={resolve("/admin/accounts/[username]/delete", { username: data.editAccount.username })}
			>
				Delete
			</Button>
		{/if}
	</div>
</header>

<div class="grid max-w-md grid-cols-2 gap-4">
	<p class="font-semibold">Username:</p>
	<p>{data.editAccount.username}</p>

	<p class="font-semibold">Name:</p>
	<p>{data.editAccount.name}</p>

	<p class="font-semibold">Email:</p>
	<p>{data.editAccount.email}</p>

	<p class="font-semibold">Role:</p>
	<p>{data.editAccount.role ?? "None"}</p>

	<p class="font-semibold">Archived:</p>
	<p>{data.editAccount.archived ? "Yes" : "No"}</p>

	{#if data.account?.role === "superadmin"}
		<p class="font-semibold">Password Enabled:</p>
		<p>{data.editAccount.passwordEnabled ? "Yes" : "No"}</p>
	{/if}

	<p class="font-semibold">Created At:</p>
	<p>{data.editAccount.createdAt.toLocaleString()}</p>

	<p class="font-semibold">Updated At:</p>
	<p>{data.editAccount.updatedAt?.toLocaleString() ?? "Never"}</p>

	<p class="font-semibold">Organizations:</p>
	<p>
		{#if data.editAccount.organizations.length > 0}
			{data.editAccount.organizations.map((org) => org.name).join(", ")}
		{:else}
			<span class="italic">None</span>
		{/if}
	</p>
</div>
