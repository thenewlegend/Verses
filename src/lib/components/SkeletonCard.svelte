<script lang="ts">
	interface Props {
		count?: number;
	}

	let { count = 3 }: Props = $props();
</script>

{#each Array(count) as _, i}
	<div
		class="rounded-[var(--radius-card)] border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900"
	>
		<div class="mb-3 flex items-center justify-between">
			<div class="skeleton h-6 w-16"></div>
			<div class="flex gap-1">
				<div class="skeleton h-8 w-8 rounded-lg"></div>
				<div class="skeleton h-8 w-8 rounded-lg"></div>
				<div class="skeleton h-8 w-8 rounded-lg"></div>
			</div>
		</div>
		<div class="mb-2 skeleton h-4 w-full"></div>
		<div class="mb-2 skeleton h-4 w-11/12"></div>
		<div class="mb-4 skeleton h-4 w-3/4"></div>
		<div class="skeleton h-4 w-32"></div>
	</div>
{/each}
