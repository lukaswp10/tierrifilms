'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useConfigs } from '@/lib/useConfigs';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { configs } = useConfigs();

  // Textos editaveis (sem fallbacks - vazio = nao aparece)
  const paragrafo1 = configs['about_paragrafo1'] || '';
  const destaque = configs['about_destaque'] || '';
  const paragrafo2 = configs['about_paragrafo2'] || '';

  return (
    <section id="sobre" className="w-full py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-black" ref={ref}>
      <div className="max-w-3xl mx-auto text-center">
        {paragrafo1 && (
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0 }}
            className="text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-12"
          >
            {paragrafo1}
          </motion.p>
        )}
        
        {destaque && (
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white text-xl md:text-2xl font-normal mb-12"
          >
            {destaque}
          </motion.p>
        )}
        
        {paragrafo2 && (
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-gray-400 text-lg md:text-xl font-light leading-relaxed"
          >
            {paragrafo2}
          </motion.p>
        )}
      </div>
    </section>
  );
}
