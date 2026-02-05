import { createClient } from '@supabase/supabase-js';

// --- Supabase Client Setup ---
// The Supabase URL and public API key have been updated to connect the application
// to your new Supabase project as requested.
const supabaseUrl = 'https://fsrpiqzsodyobmapwucn.supabase.co';
const supabaseAnonKey = 'sb_publishable_dl2qAlvw81JQEFtY5qWjCA_OzFri_UO';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);