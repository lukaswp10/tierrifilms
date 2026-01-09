'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useConfigs } from '@/lib/useConfigs';

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeSlide, setActiveSlide] = useState(0);
  const { configs } = useConfigs();

  // Diferenciais sem fallbacks - filtra os que tem pelo menos titulo
  const diferenciais = [
    {
      id: 1,
      title: configs['diferencial1_titulo'] || '',
      subtitle: configs['diferencial1_subtitulo'] || '',
      description: configs['diferencial1_descricao'] || ''
    },
    {
      id: 2,
      title: configs['diferencial2_titulo'] || '',
      subtitle: configs['diferencial2_subtitulo'] || '',
      description: configs['diferencial2_descricao'] || ''
    },
    {
      id: 3,
      title: configs['diferencial3_titulo'] || '',
      subtitle: configs['diferencial3_subtitulo'] || '',
      description: configs['diferencial3_descricao'] || ''
    }
  ].filter(d => d.title || d.subtitle || d.description); // Filtra vazios

  // Titulo da secao (sem fallback)
  const titulo = configs['servicos_titulo'] || '';
  const tituloParts = titulo.split(' ');
  const linha1 = tituloParts[0] || '';
  const linha2 = tituloParts.slice(1).join(' ') || '';

  // Se nao tem titulo e nem diferenciais, nao renderiza a secao
  if (!titulo && diferenciais.length === 0) return null;

  // Garante que activeSlide esta dentro do range
  const safeActiveSlide = Math.min(activeSlide, Math.max(0, diferenciais.length - 1));
  const currentDiferencial = diferenciais[safeActiveSlide];

  return (
    <section id="servicos" className="w-full py-12 md:py-16 px-4 md:px-8 lg:px-16 bg-black" ref={ref}>
      {/* Titulo em outline gigante (so renderiza se tiver) */}
      {titulo && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          {linha1 && <h2 className="title-large text-outline leading-none">{linha1}</h2>}
          {linha2 && (
            <motion.h2
              className="title-large text-outline leading-none"
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {linha2}
            </motion.h2>
          )}
        </motion.div>
      )}

      {/* Conteudo do slide ativo com animacao */}
      {currentDiferencial && (
        <div className="max-w-2xl mb-12 min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={safeActiveSlide}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
            >
              {currentDiferencial.title && (
                <h3 className="text-sm md:text-base font-normal tracking-[0.2em] uppercase mb-4">
                  {currentDiferencial.title}
                </h3>
              )}
              {currentDiferencial.subtitle && (
                <p className="text-xl md:text-2xl font-normal mb-6">
                  {currentDiferencial.subtitle}
                </p>
              )}
              {currentDiferencial.description && (
                <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed">
                  {currentDiferencial.description}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Navegacao do carrossel (so mostra se tiver mais de 1) */}
      {diferenciais.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex gap-6"
        >
          {diferenciais.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`relative text-sm font-light transition-all duration-300 ${
                safeActiveSlide === index ? 'text-white' : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              0{index + 1}
              {safeActiveSlide === index && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-2 left-0 right-0 h-px bg-white"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </motion.div>
      )}
    </section>
  );
}
