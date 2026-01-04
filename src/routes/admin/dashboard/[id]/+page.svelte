<script lang="ts">
	import { resolve } from "$app/paths";
	import Button from "$lib/components/Button.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";

	let { data } = $props();

	const title = $derived(`Dashboard Key ${data.dashboardKey.name}`);
</script>

<WindowTitle {title} description="View dashboard key {data.dashboardKey.name}" />

<header class="flex justify-between">
	<PageTitle {title} />
	<div class="flex gap-2">
		<Button href={resolve("/admin/dashboard/[id]/edit", { id: data.dashboardKey.id })}>Edit</Button>
		<Button href={resolve("/admin/dashboard/[id]/delete", { id: data.dashboardKey.id })}>
			Delete
		</Button>
	</div>
</header>

<div class="grid max-w-md grid-cols-2 gap-4">
	<p class="font-semibold">Name:</p>
	<p>{data.dashboardKey.name}</p>

	<p class="font-semibold">Key:</p>
	<p>{data.dashboardKey.key}</p>

	<p class="font-semibold">Created At:</p>
	<p>{data.dashboardKey.createdAt.toLocaleString()}</p>

	<p class="font-semibold">Updated At:</p>
	<p>{data.dashboardKey.updatedAt?.toLocaleString() ?? "Never"}</p>
</div>
