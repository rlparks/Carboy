<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Checkbox from "$lib/components/Checkbox.svelte";
	import Input from "$lib/components/Input.svelte";
	import { setConfig } from "./config.remote";

	let { data } = $props();

	setConfig.fields.set({
		oidcClientId: data.config.clientId ?? "",
		oidcClientSecret: data.config.clientSecret ?? "",
		oidcDiscoveryUrl: data.config.discoveryUrl ?? "",
		oidcUsernameClaim: data.config.usernameClaim ?? "",
		signOutOfIdp: data.config.signOutOfIdp,
	});
</script>

<form {...setConfig} class="max-w-[500px] space-y-4">
	<Input
		{...setConfig.fields.oidcDiscoveryUrl.as("text")}
		label="OIDC Discovery URL"
		issues={setConfig.fields.oidcDiscoveryUrl.issues()}
	/>

	<Input
		{...setConfig.fields.oidcClientId.as("text")}
		label="OIDC Client ID"
		issues={setConfig.fields.oidcClientId.issues()}
	/>

	<Input
		{...setConfig.fields.oidcClientSecret.as("text")}
		label="OIDC Client Secret"
		issues={setConfig.fields.oidcClientId.issues()}
	/>

	<Input
		{...setConfig.fields.oidcUsernameClaim.as("text")}
		label="OIDC Username Claim"
		issues={setConfig.fields.oidcUsernameClaim.issues()}
	/>

	<Checkbox
		{...setConfig.fields.signOutOfIdp.as("checkbox")}
		label="Sign out of identity provider on logout"
	/>

	<Button type="submit">Save</Button>
</form>
