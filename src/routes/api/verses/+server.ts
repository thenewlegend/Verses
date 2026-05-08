import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
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

	return json({
		verses: verses || [],
		totalCount: count || 0,
		currentPage: page,
		totalPages: Math.ceil((count || 0) / limit)
	});
};
