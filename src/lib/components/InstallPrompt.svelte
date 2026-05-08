<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { X, Download } from '@lucide/svelte';

	let deferredPrompt: any = null;
	let showPrompt = $state(false);
	let dismissed = $state(false);

	onMount(() => {
		if (!browser) return;

		// Check if already dismissed
		if (localStorage.getItem('pwa-install-dismissed') === 'true') {
			dismissed = true;
			return;
		}

		// Check if already installed
		if (window.matchMedia('(display-mode: standalone)').matches) {
			return;
		}

		window.addEventListener('beforeinstallprompt', (e: Event) => {
			e.preventDefault();
			deferredPrompt = e;
			// Show after meaningful engagement (2 seconds)
			setTimeout(() => {
				if (!dismissed) showPrompt = true;
			}, 2000);
		});
	});

	async function install() {
		if (!deferredPrompt) return;
		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === 'accepted') {
			showPrompt = false;
		}
		deferredPrompt = null;
	}

	function dismiss() {
		showPrompt = false;
		dismissed = true;
		if (browser) {
			localStorage.setItem('pwa-install-dismissed', 'true');
		}
	}
</script>

{#if showPrompt}
	<div
		class="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-sm animate-[slideUp_0.3s_ease-out] rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 to-primary-100 p-4 shadow-elevated dark:border-primary-800 dark:from-primary-950/80 dark:to-primary-900/80"
	>
		<div class="flex items-start gap-3">
			<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white">
				<Download size={20} />
			</div>
			<div class="flex-1">
				<h3 class="text-sm font-semibold text-surface-900 dark:text-surface-100">
					Install Bible Verses
				</h3>
				<p class="mt-0.5 text-xs text-surface-600 dark:text-surface-400">
					Add to home screen for quick access & offline reading
				</p>
				<div class="mt-3 flex gap-2">
					<button
						onclick={install}
						class="rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-700 active:scale-95"
					>
						Install
					</button>
					<button
						onclick={dismiss}
						class="rounded-xl px-4 py-2 text-xs font-medium text-surface-600 transition-colors hover:bg-surface-200 dark:text-surface-400 dark:hover:bg-surface-800"
					>
						Not now
					</button>
				</div>
			</div>
			<button onclick={dismiss} class="text-surface-400 hover:text-surface-600" aria-label="Dismiss">
				<X size={16} />
			</button>
		</div>
	</div>
{/if}

<style>
	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(1rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
