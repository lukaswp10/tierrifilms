'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useConfigs } from '@/lib/useConfigs';

// Componente para numero animado
function AnimatedNumber({ value, suffix, isInView }: { value: number; suffix: string; isInView: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (!isInView) return;
    
    const duration = 2000; // 2 segundos
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [isInView, value]);
  
  return (
    <span>
      {displayValue}{suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { configs } = useConfigs();

  const currentYear = new Date().getFullYear();

  // Stats sem fallbacks - filtra os que tem valor ou label
  const stats = [
    { 
      value: parseInt(configs['stat1_valor']) || 0, 
      label: configs['stat1_label'] || '', 
      suffix: "+" 
    },
    { 
      value: parseInt(configs['stat2_valor']) || 0, 
      label: configs['stat2_label'] || '', 
      suffix: "+" 
    },
    { 
      value: parseInt(configs['stat3_valor']) || 0, 
      label: configs['stat3_label'] || '', 
      suffix: "" 
    },
    { 
      value: parseInt(configs['stat4_valor']) || 0, 
      label: configs['stat4_label'] || '', 
      suffix: "+" 
    },
  ].filter(s => s.value > 0 || s.label); // Filtra vazios

  // Se nao tem stats, nao renderiza
  if (stats.length === 0) return null;

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
        <motion.p 
          className="title-medium text-outline mt-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {currentYear}
        </motion.p>
      </motion.div>

      {/* Grid de estatisticas */}
      <div className={`grid gap-8 lg:gap-12 max-w-5xl mx-auto ${
        stats.length === 1 ? 'grid-cols-1' : 
        stats.length === 2 ? 'grid-cols-2' : 
        stats.length === 3 ? 'grid-cols-3' : 
        'grid-cols-2 lg:grid-cols-4'
      }`}>
        {stats.map((stat, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
            className="text-center"
          >
            {stat.value > 0 && (
              <p className="text-5xl md:text-6xl lg:text-7xl font-light mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} isInView={isInView} />
              </p>
            )}
            {stat.label && (
              <p className="text-xs md:text-sm font-light tracking-[0.15em] text-gray-400 uppercase">
                {stat.label}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
