<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { login } from "./login.remote";
</script>

<WindowTitle title="Login" description="Access your Carboy account." />

<form {...login} class="max-w-125 space-y-4">
	<Input label="Username or Email" {...login.fields.usernameOrEmail.as("text")} />

	<Input
		label="Password"
		{...login.fields.password.as("password")}
		issues={login.fields.allIssues()}
	/>

	<Button type="submit">Login</Button>
</form>
