'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useConfigs } from '@/lib/useConfigs';

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeSlide, setActiveSlide] = useState(0);
  const { configs } = useConfigs();

  const diferenciais = [
    {
      id: 1,
      title: configs['diferencial1_titulo'] || "EXCELENCIA NO PROCESSO",
      subtitle: configs['diferencial1_subtitulo'] || "O Parceiro que Resolve.",
      description: configs['diferencial1_descricao'] || "Nos entregamos excelencia no resultado e na jornada. Nossa especializacao nos permite operar com velocidade e eficiencia inigualaveis, refletidas em nosso altissimo indice de aprovacao de primeira. Para nossos clientes, isso significa menos retrabalho e a tranquilidade de ter um parceiro que resolve."
    },
    {
      id: 2,
      title: configs['diferencial2_titulo'] || "ESPECIALIZACAO OBSESSIVA",
      subtitle: configs['diferencial2_subtitulo'] || "O Especialista em Momentos.",
      description: configs['diferencial2_descricao'] || "Enquanto outros fazem de tudo, nos so fazemos isso. Somos especialistas com dedicacao obsessiva a um unico campo: a energia de momentos reais, casamentos e eventos que merecem ser eternizados com qualidade cinematografica."
    },
    {
      id: 3,
      title: configs['diferencial3_titulo'] || "QUALIDADE CINEMATOGRAFICA",
      subtitle: configs['diferencial3_subtitulo'] || "O Padrao TIERRIFILMS.",
      description: configs['diferencial3_descricao'] || "Nos acreditamos que a emocao nasce da qualidade, nao apesar dela. Nossa obsessao pela excelencia visual, a qualidade cinematografica e a narrativa que arrepia, e nossa principal ferramenta para entregar resultados que superam expectativas."
    }
  ];

  // Titulo da secao
  const titulo = configs['servicos_titulo'] || 'PORQUE A TIERRIFILMS';
  const tituloParts = titulo.split(' ');
  const linha1 = tituloParts[0] || 'PORQUE';
  const linha2 = tituloParts.slice(1).join(' ') || 'A TIERRIFILMS';

  return (
    <section id="servicos" className="w-full py-12 md:py-16 px-4 md:px-8 lg:px-16 bg-black" ref={ref}>
      {/* Titulo em outline gigante */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <h2 className="title-large text-outline leading-none">{linha1}</h2>
        <motion.h2
          className="title-large text-outline leading-none"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {linha2}
        </motion.h2>
      </motion.div>

      {/* Conteudo do slide ativo com animacao */}
      <div className="max-w-2xl mb-12 min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-sm md:text-base font-normal tracking-[0.2em] uppercase mb-4">
              {diferenciais[activeSlide].title}
            </h3>
            <p className="text-xl md:text-2xl font-normal mb-6">
              {diferenciais[activeSlide].subtitle}
            </p>
            <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed">
              {diferenciais[activeSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navegacao do carrossel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex gap-6"
      >
        {diferenciais.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`relative text-sm font-light transition-all duration-300 ${
              activeSlide === index ? 'text-white' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            0{index + 1}
            {activeSlide === index && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute -bottom-2 left-0 right-0 h-px bg-white"
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </motion.div>
    </section>
  );
}
