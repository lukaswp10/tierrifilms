'use client';

import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export function useConfigs() {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfigs() {
      const { data } = await supabase
        .from('configuracoes')
        .select('chave, valor');

      if (data) {
        const configMap = data.reduce((acc, item) => {
          acc[item.chave] = item.valor || '';
          return acc;
        }, {} as Record<string, string>);
        setConfigs(configMap);
      }
      setLoading(false);
    }

    loadConfigs();
  }, []);

  return { configs, loading };
}

// Para Server Components
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

