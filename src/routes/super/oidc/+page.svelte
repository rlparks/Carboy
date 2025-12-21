<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Checkbox from "$lib/components/Checkbox.svelte";
	import Input from "$lib/components/Input.svelte";
	import WindowTitle from "$lib/components/WindowTitle.svelte";
	import { setOidcConfig } from "./oidcConfig.remote";

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	const initialConfig = data.config;

	setOidcConfig.fields.set({
		oidcClientId: initialConfig.clientId ?? "",
		oidcClientSecret: initialConfig.clientSecret ?? "",
		oidcDiscoveryUrl: initialConfig.discoveryUrl ?? "",
		oidcUsernameClaim: initialConfig.usernameClaim ?? "",
		signOutOfIdp: initialConfig.signOutOfIdp,
	});
</script>

<WindowTitle title="Configuration" description="View and manage system configuration." />

<form {...setOidcConfig} class="max-w-md space-y-4">
	<Input
		{...setOidcConfig.fields.oidcDiscoveryUrl.as("text")}
		label="OIDC Discovery URL"
		issues={setOidcConfig.fields.oidcDiscoveryUrl.issues()}
	/>

	<Input
		{...setOidcConfig.fields.oidcClientId.as("text")}
		label="OIDC Client ID"
		issues={setOidcConfig.fields.oidcClientId.issues()}
	/>

	<Input
		{...setOidcConfig.fields.oidcClientSecret.as("text")}
		label="OIDC Client Secret"
		issues={setOidcConfig.fields.oidcClientId.issues()}
	/>

	<Input
		{...setOidcConfig.fields.oidcUsernameClaim.as("text")}
		label="OIDC Username Claim"
		issues={setOidcConfig.fields.oidcUsernameClaim.issues()}
	/>

	<Checkbox
		{...setOidcConfig.fields.signOutOfIdp.as("checkbox")}
		label="Sign out of identity provider on logout"
	/>

	<Button type="submit">Save</Button>
</form>
