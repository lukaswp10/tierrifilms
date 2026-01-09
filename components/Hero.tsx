'use client';

import { motion } from 'framer-motion';
import { LogoText } from './Logo';
import { useConfigs } from '@/lib/useConfigs';

export default function Hero() {
  const { configs, loading } = useConfigs();

  const titleLines = [
    { text: configs['hero_linha1'] || 'ESPECIALISTAS', style: "text-outline" },
    { text: configs['hero_linha2'] || 'EM CAPTAR', style: "text-white" },
    { text: configs['hero_linha3'] || 'MOMENTOS', style: "text-white text-italic" },
    { text: configs['hero_linha4'] || 'REAIS', style: "text-outline text-italic" },
  ];

  return (
    <section className="w-full min-h-[70vh] md:min-h-screen flex flex-col justify-center items-center px-4 md:px-8 lg:px-16 py-8 md:py-20 bg-black overflow-hidden">
      {/* Video de fundo (opcional) */}
      {configs['video_fundo'] && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          <source src={configs['video_fundo']} type="video/mp4" />
        </video>
      )}

      {/* Titulo Principal - Cada linha aparece em sequencia */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center relative z-10"
      >
        <h1 className="title-giant">
          {titleLines.map((line, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: loading ? 0 : 1, y: loading ? 50 : 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2 + index * 0.15,
                ease: "easeOut"
              }}
              className={`${line.style} block`}
            >
              {line.text}
            </motion.span>
          ))}
        </h1>
      </motion.div>

      {/* Logo estilizado T\F */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mt-4 md:mt-12 text-center relative z-10"
      >
        <LogoText size="lg" />
      </motion.div>
    </section>
  );
}
