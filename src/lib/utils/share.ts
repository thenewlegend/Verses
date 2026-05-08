import { browser } from '$app/environment';
import { toasts } from '$lib/stores/toast';

export async function shareVerse(verse: string, reference: string): Promise<boolean> {
	if (!browser) return false;

	const text = `"${verse}" — ${reference}`;

	if (navigator.share) {
		try {
			await navigator.share({
				title: `Bible Verse — ${reference}`,
				text
			});
			return true;
		} catch (err) {
			if ((err as Error).name !== 'AbortError') {
				toasts.error('Failed to share');
			}
			return false;
		}
	}

	// Fallback: copy to clipboard
	try {
		await navigator.clipboard.writeText(text);
		toasts.success('Copied to clipboard (sharing not supported)');
		return true;
	} catch {
		toasts.error('Failed to share');
		return false;
	}
}
