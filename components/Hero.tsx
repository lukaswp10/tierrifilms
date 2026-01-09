'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogoText } from './Logo';
import { useConfigs } from '@/lib/useConfigs';
import Image from 'next/image';

export default function Hero() {
  const { configs, loading } = useConfigs();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Linhas do titulo (sem fallbacks - vazio = nao aparece)
  const titleLines = [
    { text: configs['hero_linha1'] || '', style: "text-outline" },
    { text: configs['hero_linha2'] || '', style: "text-white" },
    { text: configs['hero_linha3'] || '', style: "text-white text-italic" },
    { text: configs['hero_linha4'] || '', style: "text-outline text-italic" },
  ].filter(line => line.text); // Remove linhas vazias

  // Fundo: prioridade video > imagem > preto
  const videoUrl = configs['video_fundo'] || '';
  const imagemUrl = configs['hero_imagem_fundo'] || '';
  
  // Determina qual fundo usar
  const hasVideo = !!videoUrl;
  const hasImage = !!imagemUrl && !hasVideo; // So usa imagem se nao tiver video

  return (
    <section className="w-full min-h-[70vh] md:min-h-screen flex flex-col justify-center items-center px-4 md:px-8 lg:px-16 py-8 md:py-20 bg-black overflow-hidden relative">
      
      {/* Fallback enquanto carrega (gradiente escuro) */}
      {(hasVideo && !videoLoaded) || (hasImage && !imageLoaded) ? (
        <div 
          className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-50"
          aria-hidden="true"
        />
      ) : null}

      {/* Video de fundo (prioridade maxima) */}
      {hasVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-30' : 'opacity-0'
          }`}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Imagem de fundo (se nao tiver video) */}
      {hasImage && (
        <Image
          src={imagemUrl}
          alt="Background"
          fill
          priority
          onLoad={() => setImageLoaded(true)}
          className={`object-cover transition-opacity duration-1000 ${
            imageLoaded ? 'opacity-30' : 'opacity-0'
          }`}
          sizes="100vw"
        />
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
