<script lang="ts">
	import { resolve } from "$app/paths";
	import Button from "$lib/components/Button.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { deleteDepartment } from "./deleteDepartment.remote";

	let { data } = $props();

	const title = $derived(`Delete Department ${data.department.name}`);
</script>

<WindowTitle {title} description={`Delete department: ${data.department.name}`} />
<PageTitle {title} />

<div class="max-w-md space-y-4">
	<p class="text-lg">
		Are you sure you want to delete department
		<span class="font-bold">{data.department.name} </span>?
	</p>

	<p class="text-sm text-gray-600 dark:text-gray-400">
		This action cannot be undone. The department will be permanently removed from the system.
	</p>

	<form {...deleteDepartment} class="flex gap-2">
		<input type="hidden" name="id" value={data.department.id} />
		<Button type="submit">Delete</Button>
		<Button href={resolve("/admin/departments/[id]", { id: data.department.id })}>Cancel</Button>
	</form>
</div>
