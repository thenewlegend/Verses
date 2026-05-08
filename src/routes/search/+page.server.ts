import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const query = url.searchParams.get('q') || '';

	if (!query.trim()) {
		return { verses: [], query: '', totalCount: 0 };
	}

	// Use ilike for simple search across verse and reference
	const searchTerm = `%${query.trim()}%`;

	const { data: verses, count } = await supabase
		.from('verses')
		.select('*', { count: 'exact' })
		.eq('is_published', true)
		.or(`verse.ilike.${searchTerm},reference.ilike.${searchTerm}`)
		.order('created_at', { ascending: false })
		.limit(50);

	return {
		verses: verses || [],
		query,
		totalCount: count || 0
	};
};
