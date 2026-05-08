import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export interface ToastMessage {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info';
	duration?: number;
}

function createToastStore() {
	const { subscribe, update } = writable<ToastMessage[]>([]);

	function dismiss(id: string) {
		update((toasts) => toasts.filter((t) => t.id !== id));
	}

	return {
		subscribe,
		show: (message: string, type: ToastMessage['type'] = 'info', duration = 3000) => {
			if (!browser) return;
			const id = crypto.randomUUID();
			update((toasts) => [...toasts, { id, message, type, duration }]);
			if (duration > 0) {
				setTimeout(() => dismiss(id), duration);
			}
		},
		dismiss,
		success: (message: string) => {
			if (!browser) return;
			const id = crypto.randomUUID();
			update((toasts) => [...toasts, { id, message, type: 'success', duration: 3000 }]);
			setTimeout(() => dismiss(id), 3000);
		},
		error: (message: string) => {
			if (!browser) return;
			const id = crypto.randomUUID();
			update((toasts) => [...toasts, { id, message, type: 'error', duration: 5000 }]);
			setTimeout(() => dismiss(id), 5000);
		}
	};
}

export const toasts = createToastStore();
