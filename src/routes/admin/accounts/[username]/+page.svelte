<script lang="ts">
	import { resolve } from "$app/paths";
	import Button from "$lib/components/Button.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const title = $derived(`${data.editAccount.name} (${data.editAccount.username})`);
</script>

<WindowTitle {title} description="View account information." />

<header class="flex justify-between">
	<PageTitle {title} />
	<Button
		href={resolve("/admin/accounts/[username]/edit", { username: data.editAccount.username })}
	>
		Edit
	</Button>
</header>
