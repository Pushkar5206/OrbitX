// backend/supabaseClient.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

console.log('[supabase] url loaded:', Boolean(supabaseUrl));
console.log('[supabase] anon key loaded:', Boolean(supabaseAnonKey));
console.log('[supabase] service role key loaded:', Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY));

const authClient = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
		detectSessionInUrl: false,
	},
});

const dbClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
		detectSessionInUrl: false,
	},
});

module.exports = {
	authClient,
	dbClient,
};