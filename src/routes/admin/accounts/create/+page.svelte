<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { createAccount } from "./createAccount.remote";
</script>

<WindowTitle title="Create Account" description="Create a new account." />

<form {...createAccount} class="max-w-md space-y-4">
	<Input
		label="Username"
		{...createAccount.fields.username.as("text")}
		issues={createAccount.fields.username.issues()}
	/>

	<Input
		label="Email"
		{...createAccount.fields.email.as("email")}
		issues={createAccount.fields.email.issues()}
	/>

	<Input
		label="Name"
		{...createAccount.fields.name.as("text")}
		issues={createAccount.fields.name.issues()}
	/>

	<Button type="submit">Submit</Button>
</form>
