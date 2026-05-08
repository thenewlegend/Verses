import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const excludeId = url.searchParams.get('exclude');

	// Get total count
	const { count: totalCount } = await supabase
		.from('verses')
		.select('*', { count: 'exact', head: true })
		.eq('is_published', true);

	// Get all published IDs
	let query = supabase.from('verses').select('id').eq('is_published', true);
	if (excludeId) {
		query = query.neq('id', excludeId);
	}

	const { data: allIds } = await query;

	let verseOfDay = null;
	if (allIds && allIds.length > 0) {
		const randomIndex = Math.floor(Math.random() * allIds.length);
		const randomId = allIds[randomIndex].id;

		const { data } = await supabase
			.from('verses')
			.select('*')
			.eq('id', randomId)
			.single();

		verseOfDay = data;
	} else if (excludeId) {
		// Fallback: if only one verse exists and it was excluded, fetch it anyway
		const { data } = await supabase
			.from('verses')
			.select('*')
			.eq('id', excludeId)
			.single();
		verseOfDay = data;
	}

	// Get distinct class numbers
	const { data: classData } = await supabase
		.from('verses')
		.select('class_number')
		.eq('is_published', true);

	const classNumbers = classData
		? [...new Set(classData.map((v) => v.class_number))].sort((a, b) => a - b)
		: [];

	return {
		verseOfDay,
		totalCount: totalCount || 0,
		classNumbers
	};
};
