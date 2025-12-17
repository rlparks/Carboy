<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Input from "$lib/components/Input.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { createInitialSuperadmin } from "./setup.remote";
</script>

<WindowTitle title="Carboy Setup" description="Set up the initial superadmin account." />

<form
	{...createInitialSuperadmin}
	oninput={() => createInitialSuperadmin.validate()}
	class="max-w-md space-y-4"
>
	<Input
		label="Username"
		{...createInitialSuperadmin.fields.username.as("text")}
		issues={createInitialSuperadmin.fields.username.issues()}
	/>

	<Input
		label="Email"
		{...createInitialSuperadmin.fields.email.as("email")}
		issues={createInitialSuperadmin.fields.email.issues()}
	/>

	<Input
		label="Name"
		{...createInitialSuperadmin.fields.name.as("text")}
		issues={createInitialSuperadmin.fields.name.issues()}
	/>

	<Input
		label="Password"
		{...createInitialSuperadmin.fields.password.as("password")}
		issues={createInitialSuperadmin.fields.password.issues()}
	/>

	<Button type="submit">Create Initial Admin</Button>
</form>
