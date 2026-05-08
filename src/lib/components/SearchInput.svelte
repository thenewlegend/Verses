<script lang="ts">
	import { Search, X } from '@lucide/svelte';

	interface Props {
		value: string;
		placeholder?: string;
		loading?: boolean;
		oninput?: (value: string) => void;
	}

	let { value = $bindable(''), placeholder = 'Search verses...', loading = false, oninput }: Props = $props();

	let debounceTimer: ReturnType<typeof setTimeout>;

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;

		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			oninput?.(value);
		}, 300);
	}

	function clear() {
		value = '';
		oninput?.('');
	}
</script>

<div class="relative">
	<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
		{#if loading}
			<div class="h-5 w-5 animate-spin rounded-full border-2 border-primary-300 border-t-primary-600"></div>
		{:else}
			<Search size={20} class="text-surface-400" />
		{/if}
	</div>

	<input
		type="search"
		{placeholder}
		{value}
		oninput={handleInput}
		class="touch-target w-full rounded-2xl border border-surface-200 bg-surface-50 py-3.5 pr-12 pl-12 text-base text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:outline-none       "
		aria-label="Search"
	/>

	{#if value}
		<button
			onclick={clear}
			class="absolute inset-y-0 right-0 flex items-center pr-4 text-surface-400 hover:text-surface-600 "
			aria-label="Clear search"
		>
			<X size={20} />
		</button>
	{/if}
</div>
