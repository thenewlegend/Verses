<script lang="ts">
	import "../app.css";
	import { invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import BottomNav from "$lib/components/BottomNav.svelte";
	import Toast from "$lib/components/Toast.svelte";
	import InstallPrompt from "$lib/components/InstallPrompt.svelte";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";
	import { theme } from "$lib/stores/theme";
	import { page } from "$app/stores";

	let { data, children } = $props();
	let { supabase, session } = $derived(data);

	// Check if we're on an admin route
	let isAdminRoute = $derived($page.url.pathname.startsWith("/admin"));

	onMount(() => {
		const { data: authData } = supabase.auth.onAuthStateChange(
			(_event, _session) => {
				if (_session?.expires_at !== session?.expires_at) {
					invalidate("supabase:auth");
				}
			},
		);

		return () => authData.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>Bible Verse App</title>
	<meta
		name="description"
		content="Browse, search, and save beautiful Bible verses. Discover your verse of the day."
	/>
	<meta
		name="theme-color"
		content={$theme === "dark" ? "#0f0a1a" : "#1e1b4b"}
	/>
	<meta name="mobile-web-app-capable" content="yes" />
	<meta
		name="apple-mobile-web-app-status-bar-style"
		content="black-translucent"
	/>
	<link rel="apple-touch-icon" href="/icon-192.png" />
</svelte:head>

<div class="flex min-h-dvh flex-col">
	<!-- Top bar -->
	{#if !isAdminRoute}
		<header
			class="sticky top-0 z-40 border-b border-surface-200/60 bg-white/80 backdrop-blur-xl dark:border-surface-800/60 dark:bg-surface-950/80"
		>
			<div
				class="mx-auto flex max-w-2xl items-center justify-between px-4 py-3"
			>
				<a href="/" class="flex items-center gap-2">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-lg"
					>
						✝️
					</div>
					<span
						class="text-lg font-bold tracking-tight text-surface-900 dark:text-surface-100"
						>Hi, Jinija!</span
					>
				</a>
				<div class="flex items-center gap-1">
					<ThemeToggle />
				</div>
			</div>
		</header>
	{/if}

	<!-- Main content -->
	<main
		class="mx-auto w-full max-w-2xl flex-1 px-4 pt-4 {isAdminRoute
			? ''
			: 'pb-24'}"
	>
		{@render children()}
	</main>

	<!-- Bottom nav (public only) -->
	{#if !isAdminRoute}
		<BottomNav />
	{/if}
</div>

<Toast />
<InstallPrompt />
