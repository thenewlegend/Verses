import { browser } from '$app/environment';
import { toasts } from '$lib/stores/toast';

export async function copyToClipboard(text: string): Promise<boolean> {
	if (!browser) return false;

	try {
		await navigator.clipboard.writeText(text);
		toasts.success('Copied to clipboard');
		return true;
	} catch {
		// Fallback for older browsers
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		document.body.appendChild(textarea);
		textarea.select();
		try {
			document.execCommand('copy');
			toasts.success('Copied to clipboard');
			return true;
		} catch {
			toasts.error('Failed to copy');
			return false;
		} finally {
			document.body.removeChild(textarea);
		}
	}
}
