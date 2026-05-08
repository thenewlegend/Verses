import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			injectRegister: 'auto',
			includeAssets: ['favicon.png', 'apple-touch-icon.png'],
			manifest: {
				name: 'Verses',
				short_name: 'Verses',
				description: 'Browse, search, and save Bible verses',
				theme_color: '#fcfcff',
				background_color: '#fcfcff',
				display: 'standalone',
				orientation: 'portrait',
				start_url: '/',
				scope: '/',
				icons: [
					{
						src: '/icon-192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/icon-512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/icon-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}'],
				runtimeCaching: [
					{
						urlPattern: /\/rest\/v1\/verses/,
						handler: 'StaleWhileRevalidate',
						options: {
							cacheName: 'verse-api-cache',
							expiration: {
								maxEntries: 200,
								maxAgeSeconds: 86400
							}
						}
					}
				]
			},
			devOptions: {
				enabled: false
			}
		})
	]
});
