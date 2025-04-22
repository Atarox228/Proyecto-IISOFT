import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Creamos un cliente Supabase con opciones explícitas de auth
const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      // Persiste la sesión en localStorage
      persistSession: true,
      // Refresca automáticamente el access token antes de expirar
      autoRefreshToken: true,
      // Evita procesar tokens desde la URL (útil si no usas magic links)
      detectSessionInUrl: false,
    },
  }
);

export default supabase;


