<script lang="ts">
	import { page } from "$app/state";
	import Button from "$lib/components/Button.svelte";
	import PageTitle from "$lib/components/PageTitle.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { idpLogout } from "./idpLogout.remote";

	const title = "No Account Found";

	const username = $derived(page.url.searchParams.get("username"));
	const id_token = $derived(page.url.searchParams.get("id_token"));
</script>

<WindowTitle {title} description="You have logged in, but no account was found." />
<PageTitle {title} />

<p>
	You have successfully logged in to SSO as <strong>{username}</strong>, but no account was found in
	Carboy for this user.
</p>
<p>
	If you believe this is an error, please contact your system administrator to have an account
	created for you.
</p>
<p>Alternatively, you can log out of SSO and try a different account.</p>

<form {...idpLogout}>
	<input type="hidden" name="id_token" value={id_token} />
	<Button type="submit">SSO Logout</Button>
</form>
