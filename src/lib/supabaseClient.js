import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isValidHttpUrl = (str) => {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

if (!isValidHttpUrl(supabaseUrl) || !supabaseAnonKey) {
  console.warn('[Supabase] Missing or invalid VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — DB features disabled.');
}

// Only initialize if we have a valid endpoint URL and anon key
export const supabase = isValidHttpUrl(supabaseUrl) && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
