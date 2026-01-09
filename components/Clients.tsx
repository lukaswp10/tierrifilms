'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface Parceiro {
  id: string;
  nome: string;
  logo_url?: string;
  ordem: number;
}

export default function Clients() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadParceiros() {
      const { data } = await supabase
        .from('parceiros')
        .select('*')
        .order('ordem', { ascending: true });
      
      if (data) {
        setParceiros(data);
      }
      setLoading(false);
    }
    loadParceiros();
  }, []);

  // Dividir em 3 linhas
  const itemsPerRow = Math.ceil(parceiros.length / 3);
  const row1 = parceiros.slice(0, itemsPerRow);
  const row2 = parceiros.slice(itemsPerRow, itemsPerRow * 2);
  const row3 = parceiros.slice(itemsPerRow * 2);

  if (loading) {
    return (
      <section className="w-full py-12 md:py-20" style={{ backgroundColor: 'var(--bg-alt, #FFFFFF)' }}>
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-gray-400">Carregando parceiros...</div>
        </div>
      </section>
    );
  }

  if (parceiros.length === 0) {
    return null; // Nao mostrar secao se nao houver parceiros
  }

  const renderRow = (partners: Parceiro[], rowIndex: number) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay: rowIndex * 0.2 }}
      className="flex flex-wrap justify-center items-center gap-8 md:gap-16 lg:gap-20 px-4 md:px-8 lg:px-16 mb-16 last:mb-0"
    >
      {partners.map((partner, index) => (
        <motion.div
          key={partner.id}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: rowIndex * 0.2 + index * 0.1 }}
          className="flex items-center justify-center"
        >
          {partner.logo_url ? (
            <div className="relative h-12 w-32 hover:opacity-70 transition-opacity duration-300">
              <Image
                src={partner.logo_url}
                alt={partner.nome}
                fill
                className="object-contain"
                sizes="128px"
              />
            </div>
          ) : (
            <span 
              className="text-sm md:text-lg lg:text-xl font-light tracking-wide hover:opacity-50 transition-opacity duration-300 cursor-default"
              style={{ color: 'var(--text-alt, #000000)' }}
            >
              {partner.nome}
            </span>
          )}
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <section 
      className="w-full py-12 md:py-20" 
      ref={ref}
      style={{ backgroundColor: 'var(--bg-alt, #FFFFFF)' }}
    >
      {row1.length > 0 && renderRow(row1, 0)}
      {row2.length > 0 && renderRow(row2, 1)}
      {row3.length > 0 && renderRow(row3, 2)}
    </section>
  );
}
