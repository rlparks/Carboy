<script lang="ts">
	import type { RemoteFormIssue } from "@sveltejs/kit";

	type Option = {
		value: string;
		label: string;
	};

	type OptionGroups = {
		label: string;
		options: Option[];
	};

	type Props = {
		name?: string;
		label?: string;
		value?: string | number;
		placeholder?: string;
		helperText?: string;
		options?: Option[];
		optionGroups?: OptionGroups[];
		issues?: RemoteFormIssue[];
	};
	let {
		name,
		label,
		value = $bindable(""),
		placeholder = "",
		helperText = "",
		options = [],
		optionGroups = [],
		issues,
	}: Props = $props();

	const id = $props.id();
</script>

<div>
	{#if label}
		<label for={id} class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
			{label}
		</label>
	{/if}

	<select
		{id}
		{name}
		bind:value
		class="block w-full border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-800"
	>
		{#if placeholder}
			<option value="" disabled selected={value === ""}>{placeholder}</option>
		{/if}

		{#if optionGroups.length > 0}
			{#each optionGroups as group (group.label)}
				<optgroup label={group.label}>
					{#each group.options as option (option.value)}
						<option value={option.value}>{option.label || "<blank>"}</option>
					{/each}
				</optgroup>
			{/each}
		{:else}
			{#each options as option (option.value)}
				<option value={option.value}>{option.label || "<blank>"}</option>
			{/each}
		{/if}
	</select>

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
