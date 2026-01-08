'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

// EQUIPE - Trocar as imagens e nomes pelos reais depois
// Para trocar: substitua a URL da imagem e o nome/cargo
const team = [
  {
    id: 1,
    name: "TIERRI",
    role: "Founder & Director",
    // Trocar pela foto real
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "LUCAS",
    role: "Cinematographer",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "MARIA",
    role: "Editor",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop",
  },
];

export default function Crew() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full py-20 md:py-28 bg-black" ref={ref}>
      {/* Titulo CREW em outline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="px-4 md:px-8 lg:px-16 mb-8"
      >
        <h2 className="title-large text-outline">CREW</h2>
      </motion.div>

      {/* Grid de fotos da equipe */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-0"
      >
        {team.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
            className="relative aspect-[3/4] overflow-hidden group cursor-pointer"
          >
            {/* Foto */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${member.image}')` }}
            />
            
            {/* Overlay gradient - sempre visivel no mobile, hover no desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Info - sempre visivel no mobile, hover no desktop */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 md:transform md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-xl md:text-2xl font-normal tracking-wide mb-1">
                {member.name}
              </h3>
              <p className="text-sm font-light text-gray-400 tracking-wider uppercase">
                {member.role}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
