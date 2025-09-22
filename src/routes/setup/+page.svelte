<script lang="ts">
	import { createInitialSuperadmin } from "./setup.remote";
</script>

<form {...createInitialSuperadmin} oninput={() => createInitialSuperadmin.validate()}>
	<input type="text" name={createInitialSuperadmin.field("username")} />
	<input type="email" name={createInitialSuperadmin.field("email")} />
	<input type="text" name={createInitialSuperadmin.field("name")} />
	<button type="submit">Create Initial Admin</button>
</form>
