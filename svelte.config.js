import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const shouldRegisterSW = process.env.INJECT_MANIFEST == 'true';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/sigma-phase2' : ''
		},
		output: {
			bundleStrategy: 'split'
		},
		serviceWorker: {
			register: shouldRegisterSW,
			files: () => []
		}
	},

	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export default config;
