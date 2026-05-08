import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { data: verse, error: dbError } = await supabase
		.from('verses')
		.select('*')
		.eq('id', params.id)
		.single();

	if (dbError || !verse) {
		throw error(404, 'Verse not found');
	}

	return { verse };
};
