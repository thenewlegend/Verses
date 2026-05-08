<script lang="ts">
	import { AlertCircle, X } from '@lucide/svelte';
	import { fade, scale } from 'svelte/transition';

	let { 
		show = false, 
		title = 'Are you sure?', 
		message = 'This action cannot be undone.', 
		confirmLabel = 'Delete', 
		cancelLabel = 'Cancel',
		type = 'danger',
		onConfirm, 
		onCancel 
	} = $props();

	function handleConfirm() {
		onConfirm?.();
	}

	function handleCancel() {
		onCancel?.();
	}
</script>

{#if show}
	<!-- Backdrop -->
	<div 
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 z-[100] flex items-center justify-center bg-surface-900/40 p-4 backdrop-blur-sm"
		onclick={handleCancel}
		aria-hidden="true"
	>
		<!-- Modal -->
		<div 
			transition:scale={{ duration: 200, start: 0.95 }}
			class="w-full max-w-sm rounded-3xl bg-white p-6 shadow-elevated"
			onclick={(e) => e.stopPropagation()}
			aria-modal="true"
			role="dialog"
		>
			<div class="mb-4 flex items-center justify-between">
				<div class="flex h-12 w-12 items-center justify-center rounded-2xl {type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-600'}">
					<AlertCircle size={24} />
				</div>
				<button 
					onclick={handleCancel}
					class="rounded-full p-2 text-surface-400 hover:bg-surface-50 hover:text-surface-600"
				>
					<X size={20} />
				</button>
			</div>

			<h3 class="mb-2 text-xl font-bold text-surface-900">{title}</h3>
			<p class="mb-8 text-sm leading-relaxed text-surface-500">{message}</p>

			<div class="flex flex-col gap-2">
				<button
					onclick={handleConfirm}
					class="touch-target w-full rounded-2xl {type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-600 hover:bg-primary-700'} py-3 text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98]"
				>
					{confirmLabel}
				</button>
				<button
					onclick={handleCancel}
					class="touch-target w-full rounded-2xl bg-surface-100 py-3 text-sm font-bold text-surface-700 transition-all hover:bg-surface-200 active:scale-[0.98]"
				>
					{cancelLabel}
				</button>
			</div>
		</div>
	</div>
{/if}
