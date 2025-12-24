<script lang="ts">
	import { resolve } from "$app/paths";
	import logo from "$lib/assets/carboy-icon.png";
</script>

<a class="flex h-full w-full items-center gap-1 bg-bulldog p-4" href={resolve("/")}>
	<img src={logo} alt="A small icon of a car" class="w-10" />
	<h1 class="mb-1 font-[Oswald] text-3xl font-bold text-white">Carboy</h1>
</a>
