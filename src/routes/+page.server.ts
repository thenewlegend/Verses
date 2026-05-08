import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const excludeId = url.searchParams.get('exclude');

	// Get total count promise
	const totalCountPromise = supabase
		.from('verses')
		.select('*', { count: 'exact', head: true })
		.eq('is_published', true)
		.then(({ count }) => count || 0);

	// Get verse of the day promise (Streaming)
	const verseOfDayPromise = (async () => {
		// Get all published IDs
		let query = supabase.from('verses').select('id').eq('is_published', true);
		if (excludeId) {
			query = query.neq('id', excludeId);
		}
		const { data: allIds } = await query;

		if (allIds && allIds.length > 0) {
			const randomIndex = Math.floor(Math.random() * allIds.length);
			const randomId = allIds[randomIndex].id;
			const { data } = await supabase.from('verses').select('*').eq('id', randomId).single();
			return data;
		} else if (excludeId) {
			const { data } = await supabase.from('verses').select('*').eq('id', excludeId).single();
			return data;
		}
		return null;
	})();

	// Get distinct class numbers promise
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
			verseOfDay: verseOfDayPromise,
			totalCount: totalCountPromise,
			classNumbers: classNumbersPromise
		}
	};
};
