<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";

	type Props = {
		name: string;
		displayName: string;
		value: string;
	};
	let { name, displayName, value }: Props = $props();

	function deleteParam(name: string) {
		const url = new URL(page.url);
		url.searchParams.delete(name);
		goto(url, {
			replaceState: true,
		});
	}
</script>

<div class="flex w-fit border">
	<div class="bg-white px-2 py-1 text-nowrap text-black">
		{displayName}
	</div>
	<div class="px-2 py-1 text-nowrap">
		{#if value === '""'}
			<span class="italic">&lt;empty&gt;</span>
		{:else}
			{value}
		{/if}
	</div>
	<div class="mr-3 flex h-full w-6 flex-col items-center justify-center px-2 pt-[2.5px]">
		<button
			class="cursor-pointer hover:text-gray-300"
			onclick={() => deleteParam(name)}
			aria-label="Remove filter for {displayName}"
		>
			<p class="align-text-top">✕</p>
		</button>
	</div>
</div>
