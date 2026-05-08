<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { ArrowLeft, Save, Loader2, AlertTriangle } from '@lucide/svelte';
	import { triggerHaptic } from '$lib/utils/haptics';

	let { data } = $props();

	const { form, errors, enhance, delayed, message: formMessage } = superForm(() => data.form, {
		resetForm: false
	});
</script>

<svelte:head>
	<title>Add New Verse — Admin</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<a
			href="/admin/dashboard"
			onclick={() => triggerHaptic('strong')}
			class="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 transition-colors hover:text-surface-700  "
		>
			<ArrowLeft size={16} />
			Back to dashboard
		</a>
		<h1 class="text-xl font-bold text-surface-900 ">Add New Verse</h1>
	</div>

	{#if $formMessage}
		<div class="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700   ">
			<AlertTriangle size={16} />
			{$formMessage}
		</div>
	{/if}

	<form method="POST" use:enhance class="space-y-5">
		<!-- Verse text -->
		<div>
			<label for="verse" class="mb-1.5 block text-sm font-medium text-surface-700 ">
				Verse Text <span class="text-red-500">*</span>
			</label>
			<textarea
				id="verse"
				name="verse"
				bind:value={$form.verse}
				rows="5"
				required
				class="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-base text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none     "
				placeholder="Enter the verse text..."
			></textarea>
			{#if $errors.verse}
				<p class="mt-1 text-xs text-red-500">{$errors.verse}</p>
			{/if}
		</div>

		<!-- Reference -->
		<div>
			<label for="reference" class="mb-1.5 block text-sm font-medium text-surface-700 ">
				Reference <span class="text-red-500">*</span>
			</label>
			<input
				id="reference"
				name="reference"
				type="text"
				bind:value={$form.reference}
				required
				class="touch-target w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-base text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none     "
				placeholder="e.g., John 3:16"
			/>
			{#if $errors.reference}
				<p class="mt-1 text-xs text-red-500">{$errors.reference}</p>
			{/if}
		</div>

		<!-- Class number -->
		<div>
			<label for="class_number" class="mb-1.5 block text-sm font-medium text-surface-700 ">
				Class Number <span class="text-red-500">*</span>
			</label>
			<input
				id="class_number"
				name="class_number"
				type="number"
				bind:value={$form.class_number}
				min="1"
				required
				class="touch-target w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-base text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none     "
				placeholder="1"
			/>
			{#if $errors.class_number}
				<p class="mt-1 text-xs text-red-500">{$errors.class_number}</p>
			{/if}
		</div>

		<!-- Published toggle -->
		<div class="flex items-center gap-3">
			<input
				id="is_published"
				name="is_published"
				type="checkbox"
				bind:checked={$form.is_published}
				class="h-5 w-5 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
			/>
			<label for="is_published" class="text-sm font-medium text-surface-700 ">
				Publish immediately
			</label>
		</div>

		<!-- Submit -->
		<button
			type="submit"
			disabled={$delayed}
			onclick={() => triggerHaptic('strong')}
			class="touch-target flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-base font-semibold text-white transition-all hover:bg-primary-700 disabled:opacity-60 active:scale-[0.98]"
		>
			{#if $delayed}
				<Loader2 size={18} class="animate-spin" />
				Saving...
			{:else}
				<Save size={18} />
				Create Verse
			{/if}
		</button>
	</form>
</div>
