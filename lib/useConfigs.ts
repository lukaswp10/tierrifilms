'use client';

// Re-exporta o hook do ConfigsContext para manter compatibilidade
export { useConfigs } from './ConfigsContext';

// Funcao para Server Components (nao usa context)
import { supabase } from './supabase';

export async function getConfigs(): Promise<Record<string, string>> {
  const { data } = await supabase
    .from('configuracoes')
    .select('chave, valor');

  if (data) {
    return data.reduce((acc, item) => {
      acc[item.chave] = item.valor || '';
      return acc;
    }, {} as Record<string, string>);
  }

  return {};
}
