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

	const versesPromise = query.then(({ data }) => data || []);
	const countPromise = query.then(({ count }) => count || 0);

	// Get distinct class numbers for filter
	const classNumbersPromise = supabase
		.from('verses')
		.select('class_number')
		.eq('is_published', true)
		.then(({ data }) => {
			return data
				? [...new Set(data.map((v) => v.class_number))].sort((a, b) => a - b)
				: [];
		});

	return {
		streamed: {
			verses: versesPromise,
			totalCount: countPromise,
			classNumbers: classNumbersPromise
		},
		currentPage: page,
		activeClass: classFilter ? parseInt(classFilter) : null
	};
};
