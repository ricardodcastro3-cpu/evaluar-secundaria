export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL ?? "",
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
};

export function getSupabaseStatus() {
  return {
    configured: Boolean(supabaseConfig.url && supabaseConfig.anonKey),
    message: "Supabase aun no esta conectado. Este modulo queda listo para integrar.",
  };
}
