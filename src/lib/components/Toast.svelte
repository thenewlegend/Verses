<script lang="ts">
	import type { ToastMessage } from '$lib/stores/toast';
	import { toasts } from '$lib/stores/toast';
	import { fly } from 'svelte/transition';
	import { CheckCircle, XCircle, Info, X } from '@lucide/svelte';

	const iconMap = {
		success: CheckCircle,
		error: XCircle,
		info: Info
	};

	const colorMap = {
		success: 'bg-green-50 border-green-200 text-green-800   ',
		error: 'bg-red-50 border-red-200 text-red-800   ',
		info: 'bg-primary-50 border-primary-200 text-primary-800   '
	};
</script>

<div class="pointer-events-none fixed top-4 right-4 left-4 z-[100] flex flex-col items-center gap-2">
	{#each $toasts as toast (toast.id)}
		{@const Icon = iconMap[toast.type]}
		<div
			class="pointer-events-auto w-full max-w-sm rounded-xl border px-4 py-3 shadow-elevated {colorMap[toast.type]}"
			role="alert"
			transition:fly={{ y: -20, duration: 250 }}
		>
			<div class="flex items-center gap-3">
				<Icon size={18} />
				<span class="flex-1 text-sm font-medium">{toast.message}</span>
				<button
					onclick={() => toasts.dismiss(toast.id)}
					class="rounded-lg p-1 opacity-60 transition-opacity hover:opacity-100"
					aria-label="Dismiss"
				>
					<X size={14} />
				</button>
			</div>
		</div>
	{/each}
</div>
