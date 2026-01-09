'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase, Equipe } from '@/lib/supabase';

export default function Crew() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [equipe, setEquipe] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEquipe() {
      const { data } = await supabase
        .from('equipe')
        .select('*')
        .order('ordem', { ascending: true });
      
      if (data) setEquipe(data);
      setLoading(false);
    }
    loadEquipe();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-12 md:py-20 bg-black" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="px-4 md:px-8 lg:px-16 mb-4 md:mb-8"
        >
          <h2 className="title-large text-outline">CREW</h2>
        </motion.div>
        <div className="text-center text-gray-500 py-20">Carregando equipe...</div>
      </section>
    );
  }

  if (equipe.length === 0) {
    return (
      <section className="w-full py-12 md:py-20 bg-black" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="px-4 md:px-8 lg:px-16 mb-4 md:mb-8"
        >
          <h2 className="title-large text-outline">CREW</h2>
        </motion.div>
        <div className="text-center text-gray-500 py-20">
          Nenhum membro cadastrado ainda.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 md:py-20 bg-black" ref={ref}>
      {/* Titulo CREW em outline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="px-4 md:px-8 lg:px-16 mb-4 md:mb-8"
      >
        <h2 className="title-large text-outline">CREW</h2>
      </motion.div>

      {/* Grid de fotos da equipe */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-0"
      >
        {equipe.map((membro, index) => (
          <motion.div
            key={membro.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
            className="relative aspect-[3/4] overflow-hidden group cursor-pointer"
          >
            {/* Foto com next/image otimizado */}
            {membro.foto_url ? (
              <Image
                src={membro.foto_url}
                alt={membro.nome}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <span className="text-6xl text-gray-600">?</span>
              </div>
            )}
            
            {/* Overlay gradient - sempre visivel no mobile, hover no desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Info - sempre visivel no mobile, hover no desktop */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 md:transform md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl md:text-2xl font-normal tracking-wide mb-1">
                    {membro.nome.toUpperCase()}
                  </h3>
                  <p className="text-sm font-light text-gray-400 tracking-wider uppercase">
                    {membro.cargo}
                  </p>
                </div>
                {/* Numero no canto direito */}
                <span className="text-2xl md:text-3xl font-light text-white/50 italic">
                  #{String(membro.ordem).padStart(2, '0')}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
