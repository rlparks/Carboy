<script lang="ts">
	import type { Organization } from "$lib/types/db";

	type Props = {
		organizations: Organization[];
		selectedOrganizationId: string | null;
	};
	let { organizations, selectedOrganizationId }: Props = $props();

	const selectedOrganization = $derived(
		organizations.find((org) => org.id === selectedOrganizationId),
	);
	const buttonText = $derived(
		selectedOrganization ? selectedOrganization.name : "Select Organization",
	);
</script>

<button class="text-gray-500 dark:text-gray-400">{buttonText}</button>
