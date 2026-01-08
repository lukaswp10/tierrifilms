'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
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
    title: "Clipe Musical - Banda Nova",
    category: "Clipe",
    description: "Videoclipe oficial com direcao criativa",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Documentario Local",
    category: "Documentario",
    description: "Historias reais que inspiram",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Comercial Marca Premium",
    category: "Publicidade",
    description: "Producao publicitaria de alto impacto",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Festa de 15 Anos",
    category: "Evento Social",
    description: "Celebracao inesquecivel eternizada",
    thumbnail: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
  },
];

const categories = ["Todos", "Casamento", "Corporativo", "Clipe", "Documentario", "Publicidade", "Evento Social"];

export default function Portfolio() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const filteredProjects = activeCategory === "Todos" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="portfolio" className="w-full py-24 px-4 relative">
      <div className="absolute inset-0 animated-gradient" />
      
      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-[#c9a227] text-sm tracking-[0.3em] uppercase mb-4 block">
            Portfolio
          </span>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Nossos <span className="text-[#c9a227]">Trabalhos</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Cada projeto conta uma historia unica. Explore alguns dos nossos trabalhos mais recentes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#c9a227] text-black"
                  : "bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${project.thumbnail}')` }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
              
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                hoveredProject === project.id ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}>
                <div className="w-16 h-16 bg-[#c9a227] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Play size={28} className="text-black ml-1" />
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-[#c9a227] text-xs tracking-wider uppercase mb-2 block">
                  {project.category}
                </span>
                <h3 className="text-xl font-semibold mb-1 group-hover:text-[#c9a227] transition-colors">
                  {project.title}
                </h3>
                <p className={`text-gray-400 text-sm transition-all duration-300 ${
                  hoveredProject === project.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}>
                  {project.description}
                </p>
              </div>

              <div className={`absolute top-4 right-4 transition-all duration-300 ${
                hoveredProject === project.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
              }`}>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <ExternalLink size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <button className="border-2 border-[#c9a227] text-[#c9a227] hover:bg-[#c9a227] hover:text-black font-semibold px-8 py-3 rounded-full transition-all duration-300">
            Ver Todos os Projetos
          </button>
        </motion.div>
      </div>
    </section>
  );
}
