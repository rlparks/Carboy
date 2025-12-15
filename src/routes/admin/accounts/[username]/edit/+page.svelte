<script lang="ts">
	import { resolve } from "$app/paths";
	import Button from "$lib/components/Button.svelte";
	import Checkbox from "$lib/components/Checkbox.svelte";
	import Input from "$lib/components/Input.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import Select from "$lib/components/Select.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { editAccount } from "./editAccount.remote";

	let { data } = $props();

	const title = $derived(`Edit ${data.editAccount.name} (${data.editAccount.username})`);

	const roleOptions = [
		{ value: "", label: "None" },
		{ value: "admin", label: "Admin" },
	];

	// svelte-ignore state_referenced_locally
	if (data.account?.role === "superadmin") {
		roleOptions.push({ value: "superadmin", label: "Superadmin" });
	}

	// feel like there's a better way to do this?
	// svelte-ignore state_referenced_locally
	editAccount.fields.username.set(data.editAccount.username);
	// svelte-ignore state_referenced_locally
	editAccount.fields.name.set(data.editAccount.name);
	// svelte-ignore state_referenced_locally
	editAccount.fields.email.set(data.editAccount.email);
	// svelte-ignore state_referenced_locally
	editAccount.fields.role.set(data.editAccount.role ?? "");
	// svelte-ignore state_referenced_locally
	editAccount.fields.archived.set(data.editAccount.archived);
	// svelte-ignore state_referenced_locally
	editAccount.fields.passwordEnabled.set(data.editAccount.passwordEnabled);
</script>

<WindowTitle {title} description="Edit account information." />

<header class="flex justify-between">
	<PageTitle {title} />
	<Button href={resolve("/admin/accounts/[username]", { username: data.editAccount.username })}>
		Cancel
	</Button>
</header>

<form {...editAccount} class="max-w-md space-y-4">
	<input {...editAccount.fields.id.as("hidden", data.editAccount.id)} />

	<Input
		{...editAccount.fields.username.as("text")}
		label="Username"
		issues={editAccount.fields.username.issues()}
	/>

	<Input
		{...editAccount.fields.name.as("text")}
		label="Name"
		issues={editAccount.fields.name.issues()}
	/>

	<Input
		{...editAccount.fields.email.as("text")}
		label="Email"
		issues={editAccount.fields.email.issues()}
	/>

	<Select
		{...editAccount.fields.role.as("select")}
		label="Role"
		options={roleOptions}
		issues={editAccount.fields.role.issues()}
	/>

	<Checkbox {...editAccount.fields.archived.as("checkbox")} label="Archived" />

	<Checkbox {...editAccount.fields.passwordEnabled.as("checkbox")} label="Password Enabled" />

	<Button type="submit">Submit</Button>
</form>
