import { createClient } from '@supabase/supabase-js';

// Cliente de Supabase SOLO PARA SERVIDOR, con privilegios de administrador (Service Role).
// ATENCIÓN: NUNCA usar este cliente en componentes de React que se renderizan en el navegador.

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Falta PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno. El panel de Superadmin no funcionará.");
}

export const supabaseAdmin = createClient(
  supabaseUrl as string,
  supabaseServiceKey as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
