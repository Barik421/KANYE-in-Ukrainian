export const siteConfig = {
  name: 'KANYE in Ukrainian',
  url:
    (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
    'https://barik421.github.io/KANYE-in-Ukrainian',
  homeTitle: 'KANYE in Ukrainian — переклади пісень Kanye West українською',
  homeDescription:
    'Українські переклади пісень Kanye West із поясненням сленгу, гри слів, відсилок і культурного контексту.',
};

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
  enableMockFallback: import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true',
};

export const hasSupabaseConfig = Boolean(supabaseConfig.url && supabaseConfig.anonKey);

export const analyticsConfig = {
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined,
  dashboardUrl: import.meta.env.VITE_ANALYTICS_DASHBOARD_URL as string | undefined,
};

export const contactConfig = {
  email: import.meta.env.VITE_CONTACT_EMAIL as string | undefined,
  donateUrl: import.meta.env.VITE_DONATE_URL as string | undefined,
};
