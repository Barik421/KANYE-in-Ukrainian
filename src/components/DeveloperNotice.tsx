import { hasSupabaseConfig } from '../lib/config';

export function DeveloperNotice() {
  if (hasSupabaseConfig) return null;

  return (
    <p className="developer-notice" role="status">
      Supabase env не налаштовано. Показано ізольовані демо-дані для локальної розробки.
    </p>
  );
}
