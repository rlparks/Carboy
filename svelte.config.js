import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		experimental: {
			remoteFunctions: true,
		},
		csp: {
			directives: {
				"script-src": [
					"self",
					"https://frog.ugaesdit.com/api/script.js",
					"https://frog.ugaesdit.com/api/replay.js",
				],
				"object-src": ["none"],
				"style-src": ["self", "unsafe-inline"],
				"default-src": ["none"],
				"base-uri": ["none"],
				"form-action": ["self"],
				"frame-ancestors": ["none"],
				"font-src": ["self"],
				"img-src": ["self", "data:"],
				"connect-src": ["self", "https://frog.ugaesdit.com"],
				"upgrade-insecure-requests": true,
				"manifest-src": ["self"],
			},
		},
	},
	compilerOptions: {
		runes: true,
		experimental: {
			async: false,
		},
	},
};

export default config;
