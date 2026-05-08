import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const verseSchema = z.object({
	verse: z.string().min(5, 'Verse text must be at least 5 characters'),
	reference: z.string().min(3, 'Reference must be at least 3 characters'),
	class_number: z.number().int().min(1, 'Class number must be at least 1'),
	is_published: z.boolean().default(false)
});

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(verseSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(verseSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { verse, reference, class_number, is_published } = form.data;

		// Lightweight duplicate check on reference
		const { data: existing } = await supabase
			.from('verses')
			.select('id, reference')
			.eq('reference', reference)
			.limit(1);

		if (existing && existing.length > 0) {
			return message(form, 'A verse with this reference already exists. Save anyway by submitting again.', { status: 400 });
		}

		const { error } = await supabase.from('verses').insert({
			verse,
			reference,
			class_number,
			is_published
		});

		if (error) {
			return message(form, 'Failed to create verse. Please try again.', { status: 500 });
		}

		throw redirect(303, '/admin/dashboard');
	}
};
