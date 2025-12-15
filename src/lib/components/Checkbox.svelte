<script lang="ts">
	import type { RemoteFormIssue } from "@sveltejs/kit";

	type Props = {
		name?: string;
		label?: string;
		checked?: boolean;
		issues?: RemoteFormIssue[];
		oninput?: (
			e: Event & {
				currentTarget: EventTarget & HTMLInputElement;
			},
		) => void;
	};
	let { name, label, checked = $bindable(false), issues, oninput }: Props = $props();

	const id = $props.id();
</script>

<div>
	<div class="flex items-center">
		<input
			{id}
			{name}
			type="checkbox"
			bind:checked
			class="mr-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
			{oninput}
		/>

		{#if label}
			<label for={id} class="text-sm font-medium text-gray-700 dark:text-gray-300">
				{label}
			</label>
		{/if}
	</div>

	{#if issues && issues.length > 0}
		<ul class="mt-1 text-sm text-red-600">
			{#each issues as issue (issue.message + issue.path)}
				<li>{issue.message}</li>
			{/each}
		</ul>
	{/if}
</div>
