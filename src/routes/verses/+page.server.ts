import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const classFilter = url.searchParams.get('class');
	const limit = 20;
	const offset = (page - 1) * limit;

	let query = supabase
		.from('verses')
		.select('*', { count: 'exact' })
		.eq('is_published', true)
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1);

	if (classFilter) {
		query = query.eq('class_number', parseInt(classFilter));
	}

	const { data: verses, count } = await query;

	// Get distinct class numbers for filter
	const { data: classData } = await supabase
		.from('verses')
		.select('class_number')
		.eq('is_published', true);

	const classNumbers = classData
		? [...new Set(classData.map((v) => v.class_number))].sort((a, b) => a - b)
		: [];

	return {
		verses: verses || [],
		totalCount: count || 0,
		currentPage: page,
		totalPages: Math.ceil((count || 0) / limit),
		classNumbers,
		activeClass: classFilter ? parseInt(classFilter) : null
	};
};
