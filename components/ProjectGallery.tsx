'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { SanityProject, urlFor } from '@/lib/sanity';

interface ProjectGalleryProps {
  project: SanityProject;
}

export default function ProjectGallery({ project }: ProjectGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  // Extrai video ID do YouTube
  const getYoutubeId = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const youtubeId = getYoutubeId(project.videoUrl);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            href="/#cases" 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
          <span className="text-sm text-gray-500 tracking-widest uppercase">
            {project.category?.title || 'Projeto'}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-gray-400 mb-8">
              {project.eventDate && (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(project.eventDate)}
                </span>
              )}
              {project.gallery && (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {project.gallery.length} fotos
                </span>
              )}
            </div>

            {project.description && (
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
                {project.description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      {youtubeId && (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900"
            >
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-light tracking-widest uppercase text-gray-400 mb-8">
              Galeria
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.gallery.map((image, index) => (
                <motion.div
                  key={image._key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative aspect-[4/3] cursor-pointer group overflow-hidden rounded-lg"
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={urlFor(image.asset).width(800).height(600).url()}
                    alt={image.caption || `${project.title} - Foto ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <svg 
                      className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm text-white">{image.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {selectedImage !== null && project.gallery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(selectedImage > 0 ? selectedImage - 1 : project.gallery!.length - 1);
            }}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(selectedImage < project.gallery!.length - 1 ? selectedImage + 1 : 0);
            }}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div className="relative max-w-5xl max-h-[80vh] w-full h-full m-4">
            <Image
              src={urlFor(project.gallery[selectedImage].asset).width(1600).height(1200).url()}
              alt={project.gallery[selectedImage].caption || `Foto ${selectedImage + 1}`}
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70">
            {selectedImage + 1} / {project.gallery.length}
          </div>
        </motion.div>
      )}

      {/* Footer CTA */}
      <section className="py-20 px-6 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">
            Gostou do que viu?
          </h2>
          <p className="text-gray-400 mb-8">
            Entre em contato para fazermos algo incrivel juntos
          </p>
          <Link
            href="/#contato"
            className="inline-block px-8 py-4 bg-white text-black font-medium tracking-wider uppercase hover:bg-gray-200 transition-colors"
          >
            Fale Conosco
          </Link>
        </div>
      </section>
    </main>
  );
}

