<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import type { Organization } from "$lib/types/db";
	import { switchOrganization } from "./switchOrganization.remote";

	type Props = {
		organizations: Organization[];
		selectedOrganizationId: string | null;
	};
	let { organizations, selectedOrganizationId }: Props = $props();
</script>

{#if organizations.length !== 1}
	<select
		name="organizationId"
		onchange={(e) =>
			switchOrganization({ organizationId: e.currentTarget.value }).then(invalidateAll)}
		class="cursor-pointer items-center bg-transparent px-2 py-1 text-right text-gray-500 dark:text-gray-400"
	>
		{#if !selectedOrganizationId}
			<option value="" disabled selected>Select Organization</option>
		{/if}
		{#each organizations as org (org.id)}
			<option value={org.id} selected={org.id === selectedOrganizationId}>
				{org.name}
			</option>
		{/each}
	</select>
{:else}
	<p class="text-gray-500 dark:text-gray-400">{organizations[0]?.name}</p>
{/if}
