<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { login } from "./login.remote";
</script>

<WindowTitle title="Login" description="Access your Carboy account." />
<PageTitle title="Login" />

<form {...login} class="max-w-md space-y-4">
	<Input label="Username or Email" {...login.fields.usernameOrEmail.as("text")} />

	<Input
		label="Password"
		{...login.fields.password.as("password")}
		issues={login.fields.allIssues()}
	/>

	<Button type="submit">Login</Button>
</form>
