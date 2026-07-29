export const siteConfig = {
  name: 'KANYE in Ukrainian',
  url: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://example.com',
  homeTitle: 'KANYE in Ukrainian — переклади пісень Kanye West українською',
  homeDescription:
    'Авторські українські переклади пісень Kanye West із поясненням сленгу, гри слів, відсилок і культурного контексту.',
};

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
};

export const hasSupabaseConfig = Boolean(supabaseConfig.url && supabaseConfig.anonKey);

export const analyticsConfig = {
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined,
};
