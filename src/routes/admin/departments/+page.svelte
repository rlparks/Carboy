<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { resolve } from "$app/paths";
	import Button from "$lib/components/Button.svelte";
	import Link from "$lib/components/Link.svelte";
	import Table from "$lib/components/table/Table.svelte";
	import TableCell from "$lib/components/table/TableCell.svelte";
	import TableRow from "$lib/components/table/TableRow.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import type { Department } from "$lib/types/db";
	import { reorderDepartments } from "./reorderDepartment.remote";

	let { data } = $props();

	const headers = ["", "Name"];

	let departments: Department[] = $derived(data.departments);
	let draggedDepartmentId: string | null = $state(null);
	let draggedOverIndex: number | null = $state(null);

	function handleDragStart(id: string) {
		draggedDepartmentId = id;
	}

	function handleDragOver(event: DragEvent, overId: string) {
		event.preventDefault();

		const fromIndex = departments.findIndex((dept) => dept.id === draggedDepartmentId);
		const toIndex = departments.findIndex((dept) => dept.id === overId);
		draggedOverIndex = toIndex;

		const updated = [...departments];
		const [movedItem] = updated.splice(fromIndex, 1);
		if (!movedItem) return;
		updated.splice(toIndex, 0, movedItem);
		departments = updated;
	}

	function handleDragLeave() {
		draggedOverIndex = null;
	}

	async function handleDrop() {
		if (!draggedDepartmentId) return;

		draggedDepartmentId = null;
		draggedOverIndex = null;

		const departmentIds = departments.map((dept) => dept.id);
		await reorderDepartments({ departmentIds });
		await invalidateAll();
	}
</script>

<WindowTitle title="Departments" description="Manage the departments within your organization." />

<header class="flex justify-end">
	<Button href="/admin/departments/create">Create</Button>
</header>

<Table {headers}>
	{#each departments as department, index (department.id)}
		<TableRow
			draggable={true}
			ondragstart={() => handleDragStart(department.id)}
			ondragover={(e) => handleDragOver(e, department.id)}
			ondragleave={handleDragLeave}
			ondrop={() => handleDrop()}
			class={draggedOverIndex === index ? "bg-blue-100 dark:bg-blue-900" : ""}
		>
			<TableCell class="w-4">
				<span class="select-none">⋮⋮</span>
			</TableCell>
			<TableCell>
				<Link href={resolve("/admin/departments/[id]", { id: department.id })}>
					{#if department.name}
						{department.name}
					{:else}
						<span class="italic">&lt;blank&gt;</span>
					{/if}
				</Link>
			</TableCell>
		</TableRow>
	{:else}
		<TableRow>
			<TableCell colspan={headers.length} class="text-center italic">
				No departments found.
			</TableCell>
		</TableRow>
	{/each}
</Table>
