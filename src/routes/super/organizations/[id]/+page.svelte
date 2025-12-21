<script lang="ts">
	import { resolve } from "$app/paths";
	import Button from "$lib/components/Button.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const title = $derived(`Organization ${data.organization.name}`);
</script>

<WindowTitle {title} description="View organization details." />
<header class="flex justify-between">
	<PageTitle {title} />
	<Button href={resolve("/super/organizations/[id]/edit", { id: data.organization.id })}>
		Edit
	</Button>
</header>

<div class="mt-4 grid max-w-md grid-cols-2 gap-4">
	<p class="font-semibold">Name:</p>
	<p>{data.organization.name}</p>

	<p class="font-semibold">Created At:</p>
	<p>{data.organization.createdAt.toLocaleString()}</p>

	<p class="font-semibold">Updated At:</p>
	<p>{data.organization.updatedAt?.toLocaleString() ?? "Never"}</p>
</div>
