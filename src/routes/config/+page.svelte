<script lang="ts">
	import Button from "$lib/components/Button.svelte";
	import Checkbox from "$lib/components/Checkbox.svelte";
	import Input from "$lib/components/Input.svelte";
	import { getConfig, setConfig } from "./config.remote";

	const config = $derived(await getConfig());
</script>

<form {...setConfig} class="max-w-[500px] space-y-4">
	<Input
		name={setConfig.field("oidcDiscoveryUrl")}
		label="OIDC Discovery URL"
		issues={setConfig.issues?.oidcDiscoveryUrl}
		value={config?.discoveryUrl}
	/>

	<Input
		name={setConfig.field("oidcClientId")}
		label="OIDC Client ID"
		issues={setConfig.issues?.oidcClientId}
		value={config?.clientId}
	/>

	<Input
		name={setConfig.field("oidcClientSecret")}
		label="OIDC Client Secret"
		issues={setConfig.issues?.oidcClientSecret}
		value={config?.clientSecret}
	/>

	<Input
		name={setConfig.field("oidcUsernameClaim")}
		label="OIDC Username Claim"
		issues={setConfig.issues?.oidcUsernameClaim}
		value={config?.usernameClaim}
	/>

	<Checkbox
		name={setConfig.field("signOutOfIdp")}
		checked={config?.signOutOfIdp}
		label="Sign out of identity provider on logout"
	/>

	<Button type="submit">Save</Button>
</form>
