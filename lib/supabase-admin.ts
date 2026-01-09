import { createClient } from '@supabase/supabase-js';

// Cliente Supabase com service_role key para operacoes administrativas
// Este cliente ignora RLS e deve ser usado APENAS em API routes do servidor

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY nao configurada. Operacoes admin podem falhar.');
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Funcao helper para verificar se esta configurado corretamente
export function isAdminConfigured(): boolean {
  return !!supabaseServiceKey;
}
