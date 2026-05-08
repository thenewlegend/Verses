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

	const { data: verses, count } = await supabase
		.from('verses')
		.select('*', { count: 'exact' })
		.eq('is_published', true)
		.eq('class_number', classNumber)
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1);

	return {
		verses: verses || [],
		classNumber,
		totalCount: count || 0,
		currentPage: page,
		totalPages: Math.ceil((count || 0) / limit)
	};
};
