'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Play, ArrowRight, X } from 'lucide-react';
import { useConfigs } from '@/lib/useConfigs';
import Image from 'next/image';

export default function Showreel() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { configs } = useConfigs();
  const [showVideo, setShowVideo] = useState(false);

  // Textos editaveis pelo admin
  const titulo = configs['showreel_titulo'] || 'SHOWREEL';
  const subtitulo = configs['showreel_subtitulo'] || 'TIERRIFILMS';
  const texto = configs['showreel_texto'] || 'Eternize o Real,';
  const local = configs['showreel_local'] || 'SP (BR)';
  const imagemUrl = configs['showreel_imagem'] || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop';
  const videoUrl = configs['showreel_video_url'] || '';

  const handlePlayClick = () => {
    if (videoUrl) {
      setShowVideo(true);
    }
  };

  return (
    <section className="w-full py-12 md:py-20 px-4 md:px-8 lg:px-16 bg-black" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Video Player / Imagem */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative aspect-video bg-gray-900 mb-8 overflow-hidden group cursor-pointer"
          onClick={handlePlayClick}
        >
          {/* Imagem de fundo */}
          <Image
            src={imagemUrl}
            alt={titulo}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 border-2 border-white rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white">
              <Play className="w-8 h-8 md:w-10 md:h-10 text-white group-hover:text-black ml-1" />
            </div>
          </div>
          
          {/* Texto sobre o video */}
          <div className="absolute bottom-0 right-0 p-6 md:p-10 text-right">
            <p className="text-3xl md:text-5xl lg:text-6xl font-normal uppercase">{titulo}</p>
            <p className="text-2xl md:text-4xl lg:text-5xl font-normal uppercase">{subtitulo}</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-light italic mt-2">{texto}</p>
            <p className="text-lg md:text-xl font-light tracking-wider mt-1">{local}</p>
          </div>
          
          {/* Logo */}
          <div className="absolute top-6 right-6 md:top-10 md:right-10">
            <span className="text-xl md:text-2xl font-light tracking-widest">TF</span>
          </div>
        </motion.div>

        {/* Modal de Video */}
        {showVideo && videoUrl && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowVideo(false)}
          >
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-400 transition-colors"
              onClick={() => setShowVideo(false)}
            >
              <X size={32} />
            </button>
            <div 
              className="relative w-full max-w-5xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              {videoUrl.includes('youtube') || videoUrl.includes('youtu.be') ? (
                <iframe
                  src={videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : videoUrl.includes('vimeo') ? (
                <iframe
                  src={videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/')}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                />
              ) : (
                <video
                  src={videoUrl}
                  className="w-full h-full"
                  controls
                  autoPlay
                />
              )}
            </div>
          </div>
        )}

        {/* Botao Orcamento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <a href="#contato" className="btn-outline">
            <span>Orcamento</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
