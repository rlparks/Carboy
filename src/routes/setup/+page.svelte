<script lang="ts">
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { createInitialSuperadmin } from "./setup.remote";
</script>

<WindowTitle title="Carboy Setup" description="Set up the initial superadmin account." />

<form {...createInitialSuperadmin} oninput={() => createInitialSuperadmin.validate()}>
	<input {...createInitialSuperadmin.fields.username.as("text")} />
	<input {...createInitialSuperadmin.fields.email.as("email")} />
	<input {...createInitialSuperadmin.fields.name.as("text")} />
	<button type="submit">Create Initial Admin</button>
</form>
