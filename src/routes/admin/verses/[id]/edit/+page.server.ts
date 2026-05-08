import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, error } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const verseSchema = z.object({
	verse: z.string().min(5, 'Verse text must be at least 5 characters'),
	reference: z.string().min(3, 'Reference must be at least 3 characters'),
	class_number: z.number().int().min(1, 'Class number must be at least 1'),
	is_published: z.boolean().default(true)
});

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { data: verse, error: dbError } = await supabase
		.from('verses')
		.select('*')
		.eq('id', params.id)
		.single();

	if (dbError || !verse) {
		throw error(404, 'Verse not found');
	}

	const form = await superValidate(
		{
			verse: verse.verse,
			reference: verse.reference,
			class_number: verse.class_number,
			is_published: verse.is_published
		},
		zod(verseSchema)
	);

	return { form, verse };
};

export const actions: Actions = {
	update: async ({ request, params, locals: { supabase } }) => {
		const form = await superValidate(request, zod(verseSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { verse, reference, class_number, is_published } = form.data;

		const { error: updateError } = await supabase
			.from('verses')
			.update({ verse, reference, class_number, is_published })
			.eq('id', params.id);

		if (updateError) {
			return message(form, 'Failed to update verse.', { status: 500 });
		}

		return message(form, 'Verse updated successfully!');
	},

	delete: async ({ params, locals: { supabase } }) => {
		const { error: deleteError } = await supabase
			.from('verses')
			.delete()
			.eq('id', params.id);

		if (deleteError) {
			return fail(500, { error: 'Failed to delete verse.' });
		}

		throw redirect(303, '/admin/dashboard');
	}
};
