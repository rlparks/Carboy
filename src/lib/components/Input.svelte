<script lang="ts">
	import type { RemoteFormIssue } from "@sveltejs/kit";

	type Props = {
		name?: string;
		label?: string;
		type?: "text" | "password" | "email" | "number" | "file";
		placeholder?: string;
		value?: string | number;
		helperText?: string;
		accept?: string;
		issues?: RemoteFormIssue[];
		autofocus?: boolean;
	};
	let {
		name,
		label,
		type = "text",
		placeholder = "",
		helperText = "",
		value = $bindable(""),
		accept,
		issues,
		autofocus = undefined,
	}: Props = $props();

	const id = $props.id();
</script>

<div>
	{#if label}
		<label for={id} class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
			{label}
		</label>
	{/if}

	<!-- svelte-ignore a11y_autofocus -->
	<!-- only used on deliberate trigger -->
	<input
		{id}
		{name}
		{type}
		{placeholder}
		{accept}
		bind:value
		{autofocus}
		class="block w-full border border-gray-300 px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-500"
	/>

	{#if helperText}
		<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
	{/if}

	{#if issues && issues.length > 0}
		<ul class="mt-1 text-sm text-red-600">
			{#each issues as issue (issue.message + issue.path)}
				<li>{issue.message}</li>
			{/each}
		</ul>
	{/if}
</div>
