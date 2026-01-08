'use client';

import { motion } from 'framer-motion';
import { Play, ChevronDown } from 'lucide-react';

export default function Hero() {
  const scrollToPortfolio = () => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="w-full relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }} />
        </div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-wider"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <span className="text-white">TIERRI</span>
            <span className="text-[#c9a227]">FILMS</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-4 font-light tracking-wide"
        >
          Transformamos momentos em
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-12"
        >
          <span className="gradient-text">historias cinematograficas</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button 
            onClick={scrollToPortfolio}
            className="group flex items-center gap-3 bg-[#c9a227] hover:bg-[#e6b82e] text-black font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#c9a227]/30"
          >
            <Play size={20} className="group-hover:scale-110 transition-transform" />
            Ver Trabalhos
          </button>
          
          <a 
            href="#contato"
            className="flex items-center gap-3 border-2 border-white/30 hover:border-white text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:bg-white/10"
          >
            Solicitar Orcamento
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={scrollToPortfolio}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-white/60 hover:text-white transition-colors"
        >
          <span className="text-sm mb-2 tracking-widest uppercase">Scroll</span>
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>

      <div className="absolute top-1/4 left-10 w-px h-32 bg-gradient-to-b from-transparent via-[#c9a227]/50 to-transparent hidden lg:block" />
      <div className="absolute top-1/3 right-10 w-px h-32 bg-gradient-to-b from-transparent via-[#c9a227]/50 to-transparent hidden lg:block" />
    </section>
  );
}
