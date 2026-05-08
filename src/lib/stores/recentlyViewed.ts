import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'bible-recently-viewed';
const MAX_ITEMS = 10;

function createRecentlyViewedStore() {
	const initial: string[] = browser
		? JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
		: [];

	const { subscribe, update } = writable<string[]>(initial);

	function persist(ids: string[]) {
		if (browser) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
		}
	}

	return {
		subscribe,
		add: (id: string) => {
			update((ids) => {
				const filtered = ids.filter((i) => i !== id);
				const next = [id, ...filtered].slice(0, MAX_ITEMS);
				persist(next);
				return next;
			});
		},
		clear: () => {
			update(() => {
				persist([]);
				return [];
			});
		}
	};
}

export const recentlyViewed = createRecentlyViewedStore();
