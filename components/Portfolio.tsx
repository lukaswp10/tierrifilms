'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase, Galeria } from '@/lib/supabase';

export default function Portfolio() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [galerias, setGalerias] = useState<Galeria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGalerias() {
      const { data } = await supabase
        .from('galerias')
        .select('*')
        .eq('is_principal', true)
        .order('ordem', { ascending: true })
        .limit(6);
      
      if (data) setGalerias(data);
      setLoading(false);
    }
    loadGalerias();
  }, []);

  if (loading) {
    return (
      <section id="cases" className="w-full py-12 md:py-20 bg-black" ref={ref}>
        <div className="px-4 md:px-8 lg:px-16 mb-8 md:mb-12">
          <Link href="/galeria" className="group inline-block">
            <h2 className="title-large text-outline transition-all duration-300 group-hover:text-white">CASES</h2>
          </Link>
        </div>
        <div className="text-center text-gray-500 py-20">Carregando...</div>
      </section>
    );
  }

  return (
    <section id="cases" className="w-full py-12 md:py-20 bg-black" ref={ref}>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="px-4 md:px-8 lg:px-16 mb-8 md:mb-12"
      >
        <Link href="/galeria" className="group inline-block">
          <h2 className="title-large text-outline transition-all duration-300 group-hover:text-white">
            CASES
          </h2>
        </Link>
      </motion.div>

      <div className="masonry-grid">
        {galerias.map((galeria, index) => (
          <Link key={galeria.id} href={`/galeria/${galeria.slug}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              className="relative aspect-[4/3] overflow-hidden cursor-pointer group"
              onMouseEnter={() => setHoveredProject(galeria.id)}
              onMouseLeave={() => setHoveredProject(null)}
              whileHover={{ scale: 1.02 }}
            >
              {galeria.capa_url ? (
                <Image
                  src={galeria.capa_url}
                  alt={galeria.nome}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-800" />
              )}
              
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 md:opacity-0 md:bg-black md:via-transparent ${
                hoveredProject === galeria.id ? 'md:opacity-60' : ''
              }`} />
              
              <div className={`absolute inset-0 p-6 flex flex-col justify-end transition-all duration-300 md:opacity-0 md:translate-y-4 ${
                hoveredProject === galeria.id ? 'md:opacity-100 md:translate-y-0' : ''
              }`}>
                <span className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  {galeria.categoria}
                </span>
                <h3 className="text-lg md:text-xl lg:text-2xl font-normal uppercase mb-2">
                  {galeria.nome}
                </h3>
                <p className="text-gray-300 text-xs md:text-sm font-light">
                  {galeria.descricao}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {galerias.length > 0 && (
        <div className="text-center mt-12">
          <Link
            href="/galeria"
            className="inline-block px-8 py-3 border border-white/30 text-white hover:bg-white hover:text-black transition-colors uppercase tracking-wider text-sm"
          >
            Ver Todas as Galerias
          </Link>
        </div>
      )}
    </section>
  );
}
