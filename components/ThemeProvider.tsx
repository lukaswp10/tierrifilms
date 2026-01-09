'use client';

import { useEffect } from 'react';
import { useConfigs } from '@/lib/useConfigs';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { configs, loading } = useConfigs();

  useEffect(() => {
    if (loading) return;

    const root = document.documentElement;

    // Cores do tema
    const cores = {
      '--background': configs['cor_fundo'] || '#000000',
      '--foreground': configs['cor_texto'] || '#FFFFFF',
      '--white': configs['cor_texto'] || '#FFFFFF',
      '--black': configs['cor_fundo'] || '#000000',
      '--gray': configs['cor_texto_secundario'] || '#888888',
      '--gray-dark': configs['cor_borda'] || '#333333',
      '--accent': configs['cor_destaque'] || '#FFFFFF',
      '--bg-alt': configs['cor_fundo_alt'] || '#FFFFFF',
      '--text-alt': configs['cor_texto_alt'] || '#000000',
    };

    // Aplicar variaveis CSS
    Object.entries(cores).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Aplicar cor de fundo no body
    document.body.style.backgroundColor = cores['--background'];
    document.body.style.color = cores['--foreground'];

  }, [configs, loading]);

  return <>{children}</>;
}

