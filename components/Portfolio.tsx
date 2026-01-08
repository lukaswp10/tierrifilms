'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Casamento Ana & Pedro",
    category: "Casamento",
    description: "Um dia magico capturado em cada detalhe",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Evento Corporativo XYZ",
    category: "Corporativo",
    description: "Cobertura completa do evento anual",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Casamento Julia & Marcos",
    category: "Casamento",
    description: "Amor eternizado em imagens",
    thumbnail: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Festa de Formatura",
    category: "Evento",
    description: "Celebracao de uma conquista",
    thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Aniversario de 15 Anos",
    category: "Evento",
    description: "Uma noite inesquecivel",
    thumbnail: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Casamento Praia",
    category: "Casamento",
    description: "Pe na areia, amor no ar",
    thumbnail: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function Portfolio() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  return (
    <section id="portfolio" className="w-full py-24 bg-black" ref={ref}>
      {/* Titulo CASES em outline gigante */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="px-4 md:px-8 lg:px-16 mb-16"
      >
        <h2 className="title-large text-outline">CASES</h2>
      </motion.div>

      {/* Grid de projetos - estilo masonry */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="masonry-grid"
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="relative aspect-[4/3] overflow-hidden cursor-pointer group"
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            {/* Imagem de fundo */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${project.thumbnail}')` }}
            />
            
            {/* Overlay escuro - sempre visivel no mobile, hover no desktop */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 md:opacity-0 md:bg-black md:via-transparent ${
              hoveredProject === project.id ? 'md:opacity-60' : ''
            }`} />
            
            {/* Conteudo - sempre visivel no mobile, hover no desktop */}
            <div className={`absolute inset-0 p-6 flex flex-col justify-end transition-opacity duration-300 md:opacity-0 ${
              hoveredProject === project.id ? 'md:opacity-100' : ''
            }`}>
              <h3 className="text-lg md:text-xl lg:text-2xl font-normal uppercase mb-2">
                {project.title}
              </h3>
              <p className="text-gray-300 text-xs md:text-sm font-light">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
