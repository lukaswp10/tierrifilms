'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase';

type ConfigsContextType = {
  configs: Record<string, string>;
  loading: boolean;
};

const ConfigsContext = createContext<ConfigsContextType>({
  configs: {},
  loading: true,
});

export function ConfigsProvider({ children }: { children: ReactNode }) {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('configuracoes')
        .select('chave, valor');
      
      if (data) {
        const map = data.reduce((acc, item) => {
          acc[item.chave] = item.valor || '';
          return acc;
        }, {} as Record<string, string>);
        setConfigs(map);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <ConfigsContext.Provider value={{ configs, loading }}>
      {children}
    </ConfigsContext.Provider>
  );
}

export const useConfigs = () => useContext(ConfigsContext);

