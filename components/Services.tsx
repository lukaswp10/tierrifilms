'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const diferenciais = [
  {
    id: 1,
    title: "EXCELENCIA NO PROCESSO",
    subtitle: "O Parceiro que Resolve.",
    description: "Nos entregamos excelencia no resultado e na jornada. Nossa especializacao nos permite operar com velocidade e eficiencia inigualaveis, refletidas em nosso altissimo indice de aprovacao de primeira. Para nossos clientes, isso significa menos retrabalho e a tranquilidade de ter um parceiro que resolve."
  },
  {
    id: 2,
    title: "ESPECIALIZACAO OBSESSIVA",
    subtitle: "O Especialista em Momentos.",
    description: "Enquanto outros fazem de tudo, nos so fazemos isso. Somos especialistas com dedicacao obsessiva a um unico campo: a energia de momentos reais, casamentos e eventos que merecem ser eternizados com qualidade cinematografica."
  },
  {
    id: 3,
    title: "QUALIDADE CINEMATOGRAFICA",
    subtitle: "O Padrao TIERRIFILMS.",
    description: "Nos acreditamos que a emocao nasce da qualidade, nao apesar dela. Nossa obsessao pela excelencia visual, a qualidade cinematografica e a narrativa que arrepia, e nossa principal ferramenta para entregar resultados que superam expectativas."
  }
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section id="servicos" className="w-full py-16 md:py-20 px-4 md:px-8 lg:px-16 bg-black" ref={ref}>
      {/* Titulo PORQUE A TIERRIFILMS em outline gigante */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <h2 className="title-large text-outline leading-none">PORQUE</h2>
        <h2 className="title-large text-outline leading-none">A TIERRIFILMS</h2>
      </motion.div>

      {/* Conteudo do slide ativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-2xl mb-12"
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

      {/* Navegacao do carrossel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex gap-4"
      >
        {diferenciais.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`text-sm font-light transition-colors duration-300 ${
              activeSlide === index ? 'text-white' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            0{index + 1}
          </button>
        ))}
      </motion.div>
    </section>
  );
}
