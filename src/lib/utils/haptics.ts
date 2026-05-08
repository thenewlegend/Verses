/**
 * Triggers haptic feedback using the Vibration API.
 * Optimized for Android Chrome.
 */
export function triggerHaptic(intensity: 'light' | 'medium' | 'strong' = 'medium') {
	if (typeof navigator !== 'undefined' && navigator.vibrate) {
		switch (intensity) {
			case 'light':
				navigator.vibrate(10);
				break;
			case 'medium':
				navigator.vibrate(25);
				break;
			case 'strong':
				navigator.vibrate(50);
				break;
		}
	}
}
