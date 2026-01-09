'use client';

import { useConfigs } from '@/lib/useConfigs';

export default function Marquee() {
  const { configs } = useConfigs();
  
  // Textos editaveis (sem fallbacks - vazio = nao aparece)
  const text = configs['marquee_texto1'] || '';
  const text2 = configs['marquee_texto2'] || '';
  
  // Se ambos vazios, nao renderiza a secao
  if (!text && !text2) return null;
  
  return (
    <section className="w-full py-6 bg-black border-y border-gray-800/50 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center">
            {text && (
              <>
                <span className="text-base md:text-lg font-light tracking-[0.15em] uppercase text-white/80 px-8">
                  {text}
                </span>
                <span className="text-white/40 text-2xl px-4">/</span>
              </>
            )}
            {text2 && (
              <>
                <span className="text-base md:text-lg font-light tracking-[0.15em] uppercase text-white/80 px-8">
                  {text2}
                </span>
                <span className="text-white/40 text-2xl px-4">/</span>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
