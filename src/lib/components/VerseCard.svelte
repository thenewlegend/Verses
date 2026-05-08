<script lang="ts">
	import { Heart, Copy, Share2 } from '@lucide/svelte';
	import { favorites } from '$lib/stores/favorites';
	import { copyToClipboard } from '$lib/utils/clipboard';
	import { shareVerse } from '$lib/utils/share';

	interface Props {
		id: string;
		verse: string;
		reference: string;
		classNumber: number;
		compact?: boolean;
	}

	let { id, verse, reference, classNumber, compact = false }: Props = $props();

	let isFav = $derived($favorites.includes(id));
	let displayText = $derived(compact && verse.length > 120 ? verse.slice(0, 120) + '…' : verse);
</script>

<article
	class="group relative rounded-[var(--radius-card)] border border-surface-200 bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] active:scale-[0.98] dark:border-surface-800 dark:bg-surface-900"
>
	<a href="/verses/{id}" class="absolute inset-0 z-0 rounded-[var(--radius-card)]" aria-label="View verse {reference}">
		<span class="sr-only">View {reference}</span>
	</a>

	<div class="relative z-10">
		<!-- Class badge -->
		<div class="mb-3 flex items-center justify-between">
			<span
				class="rounded-lg bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
			>
				Class {classNumber}
			</span>

			<div class="flex items-center gap-1">
				<button
					onclick={(e) => { e.stopPropagation(); copyToClipboard(`"${verse}" — ${reference}`); }}
					class="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800 dark:hover:text-surface-300"
					aria-label="Copy verse"
				>
					<Copy size={16} />
				</button>
				<button
					onclick={(e) => { e.stopPropagation(); shareVerse(verse, reference); }}
					class="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800 dark:hover:text-surface-300"
					aria-label="Share verse"
				>
					<Share2 size={16} />
				</button>
				<button
					onclick={(e) => { e.stopPropagation(); favorites.toggle(id); }}
					class="rounded-lg p-2 transition-colors {isFav
						? 'text-red-500 hover:text-red-600'
						: 'text-surface-400 hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800 dark:hover:text-surface-300'}"
					aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
				>
					<Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
				</button>
			</div>
		</div>

		<!-- Verse text -->
		<p class="verse-text mb-3 text-base leading-relaxed text-surface-800 dark:text-surface-200">
			"{displayText}"
		</p>

		<!-- Reference -->
		<p class="text-sm font-semibold text-primary-600 dark:text-primary-400">
			— {reference}
		</p>
	</div>
</article>
