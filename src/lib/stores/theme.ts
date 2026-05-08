import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

function createThemeStore() {
	const { subscribe, set, update } = writable<Theme>('light');

	if (browser) {
		const stored = localStorage.getItem('theme') as Theme | null;
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const initial = stored || (prefersDark ? 'dark' : 'light');
		set(initial);
		applyTheme(initial);

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			if (!localStorage.getItem('theme')) {
				const newTheme = e.matches ? 'dark' : 'light';
				set(newTheme);
				applyTheme(newTheme);
			}
		});
	}

	function applyTheme(theme: Theme) {
		if (!browser) return;
		document.documentElement.classList.toggle('dark', theme === 'dark');
		const metaTheme = document.querySelector('meta[name="theme-color"]');
		if (metaTheme) {
			metaTheme.setAttribute('content', theme === 'dark' ? '#0f0a1a' : '#1e1b4b');
		}
	}

	return {
		subscribe,
		toggle: () => {
			update((current) => {
				const next = current === 'light' ? 'dark' : 'light';
				if (browser) {
					localStorage.setItem('theme', next);
				}
				applyTheme(next);
				return next;
			});
		},
		set: (theme: Theme) => {
			set(theme);
			if (browser) {
				localStorage.setItem('theme', theme);
			}
			applyTheme(theme);
		}
	};
}

export const theme = createThemeStore();
