'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const stats = [
  { value: 150, label: "PRODUCOES", suffix: "+" },
  { value: 200, label: "VIDEOS PRODUZIDOS", suffix: "+" },
  { value: 5, label: "ANOS DE EXPERIENCIA", suffix: "" },
  { value: 50, label: "EVENTOS POR ANO", suffix: "+" },
];

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-5xl mx-auto">
        {stats.map((stat, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
            className="text-center"
          >
            <p className="text-5xl md:text-6xl lg:text-7xl font-light mb-2">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} isInView={isInView} />
            </p>
            <p className="text-xs md:text-sm font-light tracking-[0.15em] text-gray-400 uppercase">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
