<script lang="ts">
	import { Sun, Moon } from '@lucide/svelte';
	import { theme } from '$lib/stores/theme';
</script>

<button
	onclick={() => theme.toggle()}
	class="touch-target flex items-center justify-center rounded-xl p-2.5 text-surface-600 transition-all duration-200 hover:bg-surface-100 active:scale-95 dark:text-surface-300 dark:hover:bg-surface-800"
	aria-label="Toggle dark mode"
>
	{#if $theme === 'dark'}
		<Sun size={20} />
	{:else}
		<Moon size={20} />
	{/if}
</button>
