'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SanityProject, getFeaturedProjects, urlFor } from '@/lib/sanity';

// Dados de fallback enquanto nao tem projetos no Sanity
const fallbackProjects = [
  {
    _id: '1',
    title: "Casamento Ana & Pedro",
    slug: { current: 'casamento-ana-pedro' },
    category: { title: "Casamento", slug: { current: 'casamento' } },
    description: "Um dia magico capturado em cada detalhe",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
  },
  {
    _id: '2',
    title: "Evento Corporativo XYZ",
    slug: { current: 'evento-corporativo-xyz' },
    category: { title: "Corporativo", slug: { current: 'corporativo' } },
    description: "Cobertura completa do evento anual",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
  },
  {
    _id: '3',
    title: "Casamento Julia & Marcos",
    slug: { current: 'casamento-julia-marcos' },
    category: { title: "Casamento", slug: { current: 'casamento' } },
    description: "Amor eternizado em imagens",
    coverImage: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=2070&auto=format&fit=crop",
  },
  {
    _id: '4',
    title: "Festa de Formatura",
    slug: { current: 'festa-formatura' },
    category: { title: "Evento", slug: { current: 'evento' } },
    description: "Celebracao de uma conquista",
    coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
  },
  {
    _id: '5',
    title: "Aniversario de 15 Anos",
    slug: { current: 'aniversario-15-anos' },
    category: { title: "Evento", slug: { current: 'evento' } },
    description: "Uma noite inesquecivel",
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop",
  },
  {
    _id: '6',
    title: "Casamento Praia",
    slug: { current: 'casamento-praia' },
    category: { title: "Casamento", slug: { current: 'casamento' } },
    description: "Pe na areia, amor no ar",
    coverImage: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function Portfolio() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<SanityProject[]>([]);
  const [useFallback, setUseFallback] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const sanityProjects = await getFeaturedProjects();
        if (sanityProjects && sanityProjects.length > 0) {
          setProjects(sanityProjects);
          setUseFallback(false);
        }
      } catch (error) {
        console.log('Usando dados de fallback');
      }
    }
    loadProjects();
  }, []);

  const displayProjects = useFallback ? fallbackProjects : projects;

  const getImageUrl = (project: SanityProject | typeof fallbackProjects[0]) => {
    if (typeof project.coverImage === 'string') {
      return project.coverImage;
    }
    return urlFor(project.coverImage).width(800).height(600).url();
  };

  return (
    <section id="cases" className="w-full py-12 md:py-20 bg-black" ref={ref}>
      {/* Titulo CASES em outline gigante */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="px-4 md:px-8 lg:px-16 mb-8 md:mb-12"
      >
        <h2 className="title-large text-outline">CASES</h2>
      </motion.div>

      {/* Grid de projetos - estilo masonry */}
      <div className="masonry-grid">
        {displayProjects.map((project, index) => (
          <Link
            key={project._id}
            href={useFallback ? '#' : `/projects/${project.slug.current}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              className="relative aspect-[4/3] overflow-hidden cursor-pointer group"
              onMouseEnter={() => setHoveredProject(project._id)}
              onMouseLeave={() => setHoveredProject(null)}
              whileHover={{ scale: 1.02 }}
            >
              {/* Imagem de fundo */}
              <Image
                src={getImageUrl(project)}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Overlay escuro - sempre visivel no mobile, hover no desktop */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 md:opacity-0 md:bg-black md:via-transparent ${
                hoveredProject === project._id ? 'md:opacity-60' : ''
              }`} />
              
              {/* Conteudo - sempre visivel no mobile, hover no desktop */}
              <div className={`absolute inset-0 p-6 flex flex-col justify-end transition-all duration-300 md:opacity-0 md:translate-y-4 ${
                hoveredProject === project._id ? 'md:opacity-100 md:translate-y-0' : ''
              }`}>
                <span className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                  {project.category?.title}
                </span>
                <h3 className="text-lg md:text-xl lg:text-2xl font-normal uppercase mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-xs md:text-sm font-light">
                  {project.description}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
