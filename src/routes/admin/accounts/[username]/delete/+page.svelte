<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { deleteAccount } from "./deleteAccount.remote";

	let { data } = $props();

	const title = $derived(`Delete Account ${data.editAccount.name} (${data.editAccount.username})`);
</script>

<WindowTitle
	{title}
	description={`Delete account: ${data.editAccount.name} (${data.editAccount.username})`}
/>
<PageTitle {title} />

<div class="max-w-md space-y-4">
	<p class="text-lg">
		Are you sure you want to delete account <span class="font-bold">{data.editAccount.name}</span>
		({data.editAccount.username})?
	</p>

	<p class="text-sm text-gray-600 dark:text-gray-400">
		This action cannot be undone. The account will be permanently removed from the system.
	</p>

	<form {...deleteAccount} class="flex gap-2">
		<input type="hidden" name="id" value={data.editAccount.id} />
		<Button type="submit">Delete</Button>
		<Button href={`/admin/accounts/${data.editAccount.username}`}>Cancel</Button>
	</form>
</div>
