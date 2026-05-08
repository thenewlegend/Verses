import { browser } from '$app/environment';
import { writable, derived } from 'svelte/store';

const STORAGE_KEY = 'bible-favorites';

function createFavoritesStore() {
	const initial: string[] = browser
		? JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
		: [];

	const { subscribe, set, update } = writable<string[]>(initial);

	function persist(ids: string[]) {
		if (browser) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
		}
	}

	return {
		subscribe,
		toggle: (id: string) => {
			update((ids) => {
				const next = ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
				persist(next);
				return next;
			});
		},
		isFavorite: (id: string) => {
			let result = false;
			const unsubscribe = derived({ subscribe }, ($fav) => $fav.includes(id)).subscribe(
				(val) => (result = val)
			);
			unsubscribe();
			return result;
		},
		clear: () => {
			set([]);
			persist([]);
		}
	};
}

export const favorites = createFavoritesStore();
