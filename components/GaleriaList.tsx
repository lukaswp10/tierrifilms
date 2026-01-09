'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Galeria } from '@/lib/supabase';
import Navbar from './Navbar';

interface Props {
  galerias: Galeria[];
}

export default function GaleriaList({ galerias }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Ao passar mouse, cicla entre as fotos
  const handleMouseEnter = (galeriaId: string) => {
    setHoveredId(galeriaId);
    setPreviewIndex(0);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Header com voltar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Voltar</span>
            </Link>
            
            <h1 className="text-3xl md:text-5xl font-light tracking-tight">
              GALERIA
            </h1>
          </motion.div>

          {/* Grid de galerias - mais compacto */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {galerias.map((galeria, index) => (
              <motion.div
                key={galeria.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onMouseEnter={() => handleMouseEnter(galeria.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Link href={`/galeria/${galeria.slug}`}>
                  <div className="group relative aspect-square overflow-hidden rounded-md cursor-pointer bg-gray-900">
                    {/* Imagem principal ou preview */}
                    {galeria.capa_url ? (
                      <Image
                        src={
                          hoveredId === galeria.id && galeria.fotos && galeria.fotos.length > 0
                            ? galeria.fotos[previewIndex % galeria.fotos.length]?.url || galeria.capa_url
                            : galeria.capa_url
                        }
                        alt={galeria.nome}
                        fill
                        className="object-cover transition-all duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-600 text-xs">Sem foto</span>
                      </div>
                    )}
                    
                    {/* Overlay no hover */}
                    <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
                      hoveredId === galeria.id ? 'opacity-100' : 'opacity-0'
                    }`} />
                    
                    {/* Info sempre visivel embaixo */}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                      <h3 className="text-sm font-medium truncate">
                        {galeria.nome}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {galeria.fotos?.length || 0} fotos
                      </span>
                    </div>

                    {/* Indicador de fotos no hover */}
                    {hoveredId === galeria.id && galeria.fotos && galeria.fotos.length > 1 && (
                      <div className="absolute top-2 right-2 flex gap-1">
                        {galeria.fotos.slice(0, 4).map((_, i) => (
                          <button
                            key={i}
                            onClick={(e) => { e.preventDefault(); setPreviewIndex(i); }}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                              previewIndex === i ? 'bg-white' : 'bg-white/40'
                            }`}
                          />
                        ))}
                        {galeria.fotos.length > 4 && (
                          <span className="text-xs text-white/60">+{galeria.fotos.length - 4}</span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {galerias.length === 0 && (
            <div className="text-center text-gray-500 py-20">
              Nenhuma galeria disponivel ainda.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
