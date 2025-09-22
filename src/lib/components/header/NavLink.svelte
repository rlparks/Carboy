<script lang="ts">
	import { page } from "$app/state";
	import type { RouteId } from "$app/types";

	type Props = {
		href: RouteId;
		comparePath?: string;
		text: string;
		mode: "exact" | "startsWith";
	};
	let { href, text, mode, comparePath = href }: Props = $props();

	const pageIsExact = $derived(page.url.pathname === href);
	const pageStartsWith = $derived(page.url.pathname.startsWith(comparePath));

	const pageIsActive = $derived(mode === "exact" ? pageIsExact : pageStartsWith);
</script>

<a
	{href}
	aria-current={pageIsActive ? "page" : undefined}
	class={[
		"text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
		pageIsActive ? "font-bold underline underline-offset-8" : "font-medium",
	]}
>
	{text}
</a>
