import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, url, locals: { supabase } }) => {
	const classNumber = parseInt(params.number);
	if (isNaN(classNumber) || classNumber < 1) {
		throw error(400, 'Invalid class number');
	}

	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 20;
	const offset = (page - 1) * limit;

	const versesPromise = supabase
		.from('verses')
		.select('*', { count: 'exact' })
		.eq('is_published', true)
		.eq('class_number', classNumber)
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1)
		.then(({ data, count }) => ({ verses: data || [], totalCount: count || 0 }));

	return {
		streamed: {
			results: versesPromise
		},
		classNumber,
		currentPage: page
	};
};
