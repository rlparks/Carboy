<script lang="ts">
	type Props = {
		title: string;
	};
	let { title }: Props = $props();
</script>

<h1 class="text-3xl leading-tight font-semibold">
	{title}
</h1>
