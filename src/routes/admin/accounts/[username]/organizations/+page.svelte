<script lang="ts">
	import { resolve } from "$app/paths";
	import Button from "$lib/components/Button.svelte";
	import Checkbox from "$lib/components/Checkbox.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { updateAccountOrganizations } from "./updateAccountOrganizations.remote";

	let { data } = $props();

	const title = $derived(`Organizations: ${data.editAccount.name} (${data.editAccount.username})`);

	let selectedOrganizationIds = $derived(
		data.editAccount.organizations.map((org) => org.id).join(","),
	);
</script>

<WindowTitle {title} description="Assign organizations to this account." />

<header class="flex justify-between">
	<PageTitle {title} />
	<Button
		href={resolve("/admin/accounts/[username]/edit", { username: data.editAccount.username })}
	>
		Cancel
	</Button>
</header>

<p class="text-sm text-gray-600 dark:text-gray-400">
	Select the organizations this account should have access to.
</p>

<form {...updateAccountOrganizations} class="max-w-md space-y-4">
	<input {...updateAccountOrganizations.fields.accountId.as("hidden", data.editAccount.id)} />
	<input {...updateAccountOrganizations.fields.username.as("hidden", data.editAccount.username)} />
	<input name="organizationIds" type="hidden" bind:value={selectedOrganizationIds} />

	<div class="space-y-2">
		{#each data.organizations as organization (organization.id)}
			<Checkbox
				checked={data.editAccount.organizations.some((org) => org.id === organization.id)}
				label={organization.name}
				oninput={(e) => {
					const newValue = e.currentTarget.checked;
					let ids = selectedOrganizationIds.split(",").filter((id) => id.length > 0);
					if (newValue) {
						ids.push(organization.id);
					} else {
						ids = ids.filter((id) => id !== organization.id);
					}

					selectedOrganizationIds = ids.join(",");
				}}
			/>
		{/each}
	</div>

	<Button type="submit">Submit</Button>
</form>
