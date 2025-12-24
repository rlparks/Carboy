<script lang="ts">
	import { resolve } from "$app/paths";

	let { data } = $props();
</script>

<header class="border-b-4 border-bulldog">
	<a class="p-0.5 text-center" href={resolve("/")}>
		<h1 class="mb-1 font-[Oswald] text-3xl font-bold">Carboy</h1>
	</a>
</header>
