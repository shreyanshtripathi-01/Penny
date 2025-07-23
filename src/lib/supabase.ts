import { createClient } from '@supabase/supabase-js';

// These environment variables will need to be set in a .env.local file.
// We use generic placeholders for now so the build doesn't fail if they are missing.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
