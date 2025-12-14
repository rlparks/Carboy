<script lang="ts">
	import { page } from "$app/state";
	import PageTitle from "$lib/components/PageTitle.svelte";
</script>

<PageTitle title="{page.status}: {page.error?.message}" />
