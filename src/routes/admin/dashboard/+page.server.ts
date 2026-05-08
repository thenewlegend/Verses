import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	// Total verses
	const { count: totalCount } = await supabase
		.from('verses')
		.select('*', { count: 'exact', head: true });

	// Published count
	const { count: publishedCount } = await supabase
		.from('verses')
		.select('*', { count: 'exact', head: true })
		.eq('is_published', true);

	// Draft count
	const { count: draftCount } = await supabase
		.from('verses')
		.select('*', { count: 'exact', head: true })
		.eq('is_published', false);

	// Recent verses
	const { data: recentVerses } = await supabase
		.from('verses')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(5);

	// Class breakdown
	const { data: classData } = await supabase
		.from('verses')
		.select('class_number');

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
		recentVerses: recentVerses || [],
		classBreakdown
	};
};
