import { supabase } from '../lib/supabaseClient';
import type { SuggestionInput } from '../types/content';

export async function submitSuggestion(input: SuggestionInput): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase не налаштовано. Додайте VITE_SUPABASE_URL і VITE_SUPABASE_ANON_KEY.');
  }

  const { error } = await supabase.from('suggestions').insert({
    type: input.type,
    name: input.name || null,
    email: input.email || null,
    song_reference: input.song_reference || null,
    message: input.message,
  });

  if (error) throw new Error(error.message);
}
