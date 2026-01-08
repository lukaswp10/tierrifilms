'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Video, 
  Clapperboard, 
  Plane, 
  PartyPopper, 
  Building2, 
  Music,
  ArrowRight 
} from 'lucide-react';

const services = [
  {
    icon: <Video className="w-10 h-10" />,
    title: "Filmagem de Eventos",
    description: "Cobertura completa de casamentos, formaturas, aniversarios e celebracoes especiais com equipe profissional.",
    features: ["Multiplas cameras", "Captacao de audio", "Edicao completa"]
  },
  {
    icon: <Building2 className="w-10 h-10" />,
    title: "Video Institucional",
    description: "Apresente sua empresa de forma profissional com videos que transmitem sua essencia e valores.",
    features: ["Roteiro personalizado", "Entrevistas", "Animacoes"]
  },
  {
    icon: <Clapperboard className="w-10 h-10" />,
    title: "Edicao e Pos-Producao",
    description: "Transformamos seu material bruto em uma obra-prima com tecnicas avancadas de edicao.",
    features: ["Color grading", "Efeitos visuais", "Motion graphics"]
  },
  {
    icon: <Plane className="w-10 h-10" />,
    title: "Filmagem com Drone",
    description: "Imagens aereas impressionantes que adicionam uma perspectiva unica ao seu projeto.",
    features: ["4K Ultra HD", "Voos autorizados", "Estabilizacao"]
  },
  {
    icon: <Music className="w-10 h-10" />,
    title: "Videoclipes Musicais",
    description: "Producoes criativas que traduzem a energia e a mensagem da sua musica em imagens.",
    features: ["Direcao criativa", "Locacoes unicas", "Efeitos especiais"]
  },
  {
    icon: <PartyPopper className="w-10 h-10" />,
    title: "Conteudo para Redes",
    description: "Videos otimizados para Instagram, TikTok, YouTube e outras plataformas.",
    features: ["Formato vertical", "Legendas", "Entregas rapidas"]
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="servicos" className="w-full py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[#c9a227] text-sm tracking-[0.3em] uppercase mb-4 block">
            Servicos
          </span>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            O que <span className="text-[#c9a227]">Fazemos</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Oferecemos solucoes completas em producao audiovisual para todos os tipos de projeto.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group relative bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8 hover:border-[#c9a227]/50 transition-all duration-500"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#c9a227]/20 to-transparent rounded-2xl flex items-center justify-center mb-6 text-[#c9a227] group-hover:from-[#c9a227]/30 transition-all">
                {service.icon}
              </div>
              
              <h3 className="text-2xl font-semibold mb-3 group-hover:text-[#c9a227] transition-colors">
                {service.title}
              </h3>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-[#c9a227] rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 text-[#c9a227] font-medium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span>Saiba mais</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#c9a227]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">
            Nao encontrou o que procura? Entre em contato e conte sobre seu projeto.
          </p>
          <a 
            href="#contato"
            className="inline-flex items-center gap-2 bg-[#c9a227] hover:bg-[#e6b82e] text-black font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
          >
            Falar com Especialista
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
