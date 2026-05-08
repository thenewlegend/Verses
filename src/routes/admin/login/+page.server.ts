import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

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

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(400, { error: 'Invalid email or password', email });
		}

		throw redirect(303, '/admin/dashboard');
	},

	signout: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		throw redirect(303, '/admin/login');
	}
};
