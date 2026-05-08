import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, url }) => {
	const { session, user } = await safeGetSession();

	// Allow access to login page without auth
	if (url.pathname === '/admin/login') {
		if (session) {
			throw redirect(303, '/admin/dashboard');
		}
		return { session, user };
	}

	// Protect all other admin routes
	if (!session) {
		throw redirect(303, '/admin/login');
	}

	return { session, user };
};
