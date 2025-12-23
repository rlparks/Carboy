<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { setPassword } from "./setPassword.remote";

	let { data } = $props();

	const title = $derived(`Set Password for ${data.editAccount.name}`);
</script>

<WindowTitle {title} description="Set account password." />
<PageTitle {title} />

<form class="max-w-md space-y-4" {...setPassword}>
	<input {...setPassword.fields.username.as("hidden", data.editAccount.username)} />
	<Input label="Password" {...setPassword.fields.password.as("password")} />
	<Button type="submit">Submit</Button>
</form>
