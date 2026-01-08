'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
  { value: "150", label: "PRODUCOES" },
  { value: "200", label: "VIDEOS PRODUZIDOS" },
  { value: "5", label: "ANOS DE EXPERIENCIA" },
  { value: "50", label: "EVENTOS POR ANO" },
];

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const currentYear = new Date().getFullYear();

  return (
    <section className="w-full py-12 md:py-20 px-4 md:px-8 lg:px-16 bg-black" ref={ref}>
      {/* Titulo NUMEROS em outline + ano */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-10 md:mb-16"
      >
        <h2 className="title-large text-outline text-italic">NUMEROS</h2>
        <p className="title-medium text-outline mt-4">{currentYear}</p>
      </motion.div>

      {/* Grid de estatisticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-5xl mx-auto"
      >
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <p className="text-5xl md:text-6xl lg:text-7xl font-light mb-2">
              {stat.value}
            </p>
            <p className="text-xs md:text-sm font-light tracking-[0.15em] text-gray-400 uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
