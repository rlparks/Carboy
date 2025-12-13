<script lang="ts">
	import { page } from "$app/state";
	import MainBody from "$lib/components/MainBody.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
</script>

<MainBody>
	<PageTitle title="{page.status}: {page.error?.message}" />
</MainBody>
