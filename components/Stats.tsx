'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface StatProps {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}

function AnimatedStat({ value, suffix, label, delay }: StatProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        let start = 0;
        const duration = 2000;
        const increment = value / (duration / 16);
        
        const counter = setInterval(() => {
          start += increment;
          if (start >= value) {
            setDisplayValue(value);
            clearInterval(counter);
          } else {
            setDisplayValue(Math.floor(start));
          }
        }, 16);

        return () => clearInterval(counter);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay }}
      className="text-center"
    >
      <div className="relative inline-block">
        <span 
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#c9a227]"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {displayValue}
        </span>
        <span 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#c9a227]"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {suffix}
        </span>
      </div>
      <p className="text-gray-400 text-lg mt-2 tracking-wide uppercase">
        {label}
      </p>
    </motion.div>
  );
}

const stats = [
  { value: 150, suffix: "+", label: "Projetos Realizados" },
  { value: 5, suffix: "+", label: "Anos de Experiencia" },
  { value: 100, suffix: "%", label: "Clientes Satisfeitos" },
  { value: 50, suffix: "+", label: "Eventos por Ano" },
];

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
      </div>

      <div className="absolute top-1/2 left-0 w-32 h-px bg-gradient-to-r from-[#c9a227] to-transparent" />
      <div className="absolute top-1/2 right-0 w-32 h-px bg-gradient-to-l from-[#c9a227] to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[#c9a227] text-sm tracking-[0.3em] uppercase mb-4 block">
            Numeros
          </span>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Nossa <span className="text-[#c9a227]">Trajetoria</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={0.2 + index * 0.15}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center text-gray-500 mt-16 max-w-2xl mx-auto"
        >
          Cada numero representa uma historia unica, um momento eternizado, 
          uma confianca depositada em nosso trabalho.
        </motion.p>
      </div>
    </section>
  );
}
