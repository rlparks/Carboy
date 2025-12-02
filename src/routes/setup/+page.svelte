<script lang="ts">
	import { createInitialSuperadmin } from "./setup.remote";
</script>

<form {...createInitialSuperadmin} oninput={() => createInitialSuperadmin.validate()}>
	<input {...createInitialSuperadmin.fields.username.as("text")} />
	<input {...createInitialSuperadmin.fields.email.as("email")} />
	<input {...createInitialSuperadmin.fields.name.as("text")} />
	<button type="submit">Create Initial Admin</button>
</form>
