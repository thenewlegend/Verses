import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const statusFilter = url.searchParams.get('status');
	const searchQuery = url.searchParams.get('q');

	// Total counts (for tiles)
	const { count: totalCount } = await supabase
		.from('verses')
		.select('*', { count: 'exact', head: true });

	const { count: publishedCount } = await supabase
		.from('verses')
		.select('*', { count: 'exact', head: true })
		.eq('is_published', true);

	const { count: draftCount } = await supabase
		.from('verses')
		.select('*', { count: 'exact', head: true })
		.eq('is_published', false);

	// Fetch filtered verses
	let query = supabase.from('verses').select('*');

	if (statusFilter === 'published') {
		query = query.eq('is_published', true);
	} else if (statusFilter === 'draft') {
		query = query.eq('is_published', false);
	}

	if (searchQuery) {
		query = query.or(`verse.ilike.%${searchQuery}%,reference.ilike.%${searchQuery}%`);
	}

	const { data: verses, error: fetchError } = await query
		.order('created_at', { ascending: false })
		.limit(50);

	if (fetchError) {
		console.error('Dashboard Fetch Error:', fetchError);
	}

	// Class breakdown (remains for stats)
	const { data: classData } = await supabase.from('verses').select('class_number');
	const classBreakdown: Record<number, number> = {};
	if (classData) {
		classData.forEach((v) => {
			classBreakdown[v.class_number] = (classBreakdown[v.class_number] || 0) + 1;
		});
	}

	return {
		totalCount: totalCount || 0,
		publishedCount: publishedCount || 0,
		draftCount: draftCount || 0,
		verses: verses || [],
		classBreakdown,
		activeStatus: statusFilter,
		searchQuery
	};
};
