<script lang="ts">
	type Props = {
		title: string;
		description: string;
	};

	let { title, description }: Props = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="og:title" content={title} />
	<meta name="description" content={description} />
	<meta name="og:description" content={description} />
</svelte:head>
