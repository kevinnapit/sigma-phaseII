import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import type { PWAAssetsOptions } from 'vite-plugin-pwa';
import getStrategies from './pwa-strategies.config';
import { readFileSync } from 'fs';

const pwaAssets: PWAAssetsOptions = { image: 'static/favicon.svg' };
const strategies = getStrategies(process.env.INJECT_MANIFEST == 'true');
const isInjectManifest = process.env.INJECT_MANIFEST == 'true';
const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			...strategies,
			registerType: 'autoUpdate',
			injectRegister: false,
			includeAssets: ['favicon.svg'],
			pwaAssets,
			manifest: {
				name: 'Sigma Enterprise',
				short_name: 'Sigma',
				description: 'Sigma Enterprise ERP',
				display: 'standalone',
				scope: '/',
				start_url: '/',
				id: '/',
				screenshots: [
					{
						src: '/images/landing-page-wide.webp',
						type: 'image/webp',
						form_factor: 'wide',
						label: 'Desktop',
						platform: 'windows',
						sizes: '1918x977'
					},
					{
						src: '/images/landing-page-narrow.webp',
						type: 'image/webp',
						form_factor: 'narrow',
						label: 'Mobile',
						platform: 'android',
						sizes: '398x853'
					}
				]
			},
			devOptions: {
				enabled: process.env.SW_DEV == 'true',
				type: 'module',
				suppressWarnings: true,
				navigateFallback: isInjectManifest ? '/' : undefined
			},
			kit: {
				// adapterFallback: '200.html',
				spa: true,
				includeVersionFile: true,
				trailingSlash: 'never'
			}
		})
	],

	server: {
		proxy: {
			'/api': {
				target: 'https://apisigma.iwkapps.com/hrm',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '/api')
			}
		}
	},

	test: {
		expect: { requireAssertions: true },

		projects: [
			{
				extends: './vite.config.ts',

				test: {
					name: 'client',

					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},

					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',

				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	},

	define: {
		'import.meta.env.APP_VERSION': JSON.stringify(pkg.version)
	}
});
