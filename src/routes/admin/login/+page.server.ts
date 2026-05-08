import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, isRedirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		try {
			const { error } = await supabase.auth.signInWithPassword({ email, password });

			if (error) {
				console.error('Login Error:', error);
				return fail(400, { error: error.message || 'Invalid email or password', email });
			}

			throw redirect(303, '/admin/dashboard');
		} catch (err: any) {
			if (isRedirect(err)) throw err; // SvelteKit redirects are thrown errors
			console.error('Action Exception:', err);
			return fail(500, { error: 'An unexpected error occurred: ' + (err.message || 'Unknown error'), email });
		}
	},

	signout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		throw redirect(303, '/admin/login');
	}
};
