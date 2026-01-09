'use client';

import { useState, useEffect } from 'react';

// Breakpoints padrao (baseados em Tailwind)
const BREAKPOINTS = {
  mobile: 768,   // max-width para mobile
  tablet: 1024,  // max-width para tablet
};

interface MediaQueryResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
}

export function useMediaQuery(): MediaQueryResult {
  const [state, setState] = useState<MediaQueryResult>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  });

  useEffect(() => {
    // Funcao para atualizar o estado baseado na largura
    const updateState = () => {
      const width = window.innerWidth;
      setState({
        isMobile: width < BREAKPOINTS.mobile,
        isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
        isDesktop: width >= BREAKPOINTS.tablet,
        width,
      });
    };

    // Inicializa com o valor correto
    updateState();

    // Listener para resize
    window.addEventListener('resize', updateState);

    // Cleanup
    return () => window.removeEventListener('resize', updateState);
  }, []);

  return state;
}

// Hook simplificado para apenas checar mobile
export function useIsMobile(): boolean {
  const { isMobile } = useMediaQuery();
  return isMobile;
}

export default useMediaQuery;

