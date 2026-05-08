<script lang="ts">
	import { page } from '$app/stores';
	import { Home, BookOpen, Search, Heart } from '@lucide/svelte';

	const navItems = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/verses', label: 'Browse', icon: BookOpen },
		{ href: '/search', label: 'Search', icon: Search },
		{ href: '/favorites', label: 'Favorites', icon: Heart }
	];

	let currentPath = $derived($page.url.pathname);
</script>

<nav
	class="fixed bottom-0 left-0 right-0 z-50 border-t border-surface-200 bg-white/90 backdrop-blur-xl safe-bottom dark:border-surface-800 dark:bg-surface-950/90"
	aria-label="Main navigation"
>
	<div class="mx-auto flex max-w-lg items-center justify-around px-2">
		{#each navItems as item}
			{@const isActive =
				item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href)}
			<a
				href={item.href}
				class="touch-target flex flex-1 flex-col items-center gap-0.5 py-2 transition-all duration-200 {isActive
					? 'text-primary-600 dark:text-primary-400'
					: 'text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200'}"
				aria-current={isActive ? 'page' : undefined}
			>
				<div
					class="flex h-8 w-12 items-center justify-center rounded-2xl transition-all duration-200 {isActive
						? 'bg-primary-100 dark:bg-primary-900/40'
						: ''}"
				>
					<item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
				</div>
				<span class="text-[10px] font-medium leading-tight">{item.label}</span>
			</a>
		{/each}
	</div>
</nav>
