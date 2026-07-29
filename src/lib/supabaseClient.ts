import { createClient } from '@supabase/supabase-js';
import { hasSupabaseConfig, supabaseConfig } from './config';

export const supabase = hasSupabaseConfig
  ? createClient(supabaseConfig.url!, supabaseConfig.anonKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;
