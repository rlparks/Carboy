<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
</script>

<WindowTitle title="Organizations" description="View and manage organizations." />

<div class="flex justify-center">
	<Button href="/super/organizations/create">Create</Button>
</div>
