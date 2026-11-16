'use client';

import { createContext, useContext, ReactNode } from 'react';

type ConfigsContextType = {
  configs: Record<string, string>;
  loading: boolean;
};

const ConfigsContext = createContext<ConfigsContextType>({
  configs: {},
  loading: false,
});

// Os textos/cores do site chegam prontos do servidor (app/layout.tsx).
export function ConfigsProvider({ initialConfigs, children }: { initialConfigs: Record<string, string>; children: ReactNode }) {
  return (
    <ConfigsContext.Provider value={{ configs: initialConfigs, loading: false }}>
      {children}
    </ConfigsContext.Provider>
  );
}

export const useConfigs = () => useContext(ConfigsContext);
