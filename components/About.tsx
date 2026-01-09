'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useConfigs } from '@/lib/useConfigs';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { configs } = useConfigs();

  const paragrafo1 = configs['about_paragrafo1'] || 'Momentos reais nos conectam de formas que nenhuma tecnologia pode replicar. Eles nos lembram do que e ser humano, do calor de um abraco e do som do riso, da emocao dos encontros. Eles nos reconectam com a nossa essencia, com o que realmente importa. Te convidamos a reconectar com o autentico, a sentir e viver verdadeiramente.';
  
  const destaque = configs['about_destaque'] || 'TIERRIFILMS, Eternize o Real.';
  
  const paragrafo2 = configs['about_paragrafo2'] || 'Com anos de experiencia no mercado audiovisual, formamos uma equipe de especialistas e criamos em colaboracao com os melhores profissionais. Nos tornamos referencia em captar momentos reais, encontrando a combinacao perfeita entre os movimentos de camera, a dinamica e linguagem de uma nova era da comunicacao.';

  return (
    <section id="sobre" className="w-full py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-black" ref={ref}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0 }}
          className="text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-12"
        >
          {paragrafo1}
        </motion.p>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-white text-xl md:text-2xl font-normal mb-12"
        >
          {destaque}
        </motion.p>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-gray-400 text-lg md:text-xl font-light leading-relaxed"
        >
          {paragrafo2}
        </motion.p>
      </div>
    </section>
  );
}
