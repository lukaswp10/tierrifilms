'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Play, ArrowRight } from 'lucide-react';

export default function Showreel() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full py-20 px-4 md:px-8 lg:px-16 bg-black" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Video Player Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative aspect-video bg-gray-900 mb-8 overflow-hidden group cursor-pointer"
        >
          {/* Placeholder Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop')`,
            }}
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
            <p className="text-3xl md:text-5xl lg:text-6xl font-normal uppercase">SHOWREEL</p>
            <p className="text-2xl md:text-4xl lg:text-5xl font-normal uppercase">TIERRIFILMS</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-light italic mt-2">Eternize o Real,</p>
            <p className="text-lg md:text-xl font-light tracking-wider mt-1">SP (BR)</p>
          </div>
          
          {/* Logo */}
          <div className="absolute top-6 right-6 md:top-10 md:right-10">
            <span className="text-xl md:text-2xl font-light tracking-widest">TF</span>
          </div>
        </motion.div>

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
