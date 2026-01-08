'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Camera, Film, Sparkles } from 'lucide-react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Filmagem Profissional",
      description: "Equipamentos de ultima geracao para capturar cada momento com qualidade cinematografica."
    },
    {
      icon: <Film className="w-8 h-8" />,
      title: "Edicao Criativa",
      description: "Transformamos horas de material bruto em historias envolventes e emocionantes."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Pos-Producao",
      description: "Color grading, efeitos visuais e finalizacao que elevam seu video ao proximo nivel."
    }
  ];

  return (
    <section id="sobre" className="w-full py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[#c9a227] text-sm tracking-[0.3em] uppercase mb-4 block">
            Sobre Nos
          </span>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Especialistas em <span className="text-[#c9a227]">Captar Emocoes</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Com anos de experiencia no mercado audiovisual, a TIERRIFILMS nasceu da paixao 
            por contar historias atraves das lentes. Cada projeto e unico, e tratamos 
            cada momento como se fosse irrepetivel - porque e.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="group relative bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8 hover:border-[#c9a227]/50 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-6 text-[#c9a227] group-hover:bg-[#c9a227]/20 transition-colors">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-semibold mb-3 group-hover:text-[#c9a227] transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              <div className="absolute inset-0 rounded-2xl bg-[#c9a227]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative text-center py-12 px-8"
        >
          <div className="absolute inset-0 border border-[#2a2a2a] rounded-2xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-4">
            <span className="text-[#c9a227] text-4xl">&quot;</span>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 italic max-w-3xl mx-auto leading-relaxed">
            Nosso objetivo e eternizar os momentos mais importantes da sua vida 
            ou do seu negocio, criando memorias visuais que vao alem do comum.
          </p>
          
          <p className="text-[#c9a227] mt-6 font-semibold">
            - Equipe TIERRIFILMS
          </p>
        </motion.div>
      </div>
    </section>
  );
}
