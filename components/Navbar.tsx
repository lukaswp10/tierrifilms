'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { LogoText } from './Logo';
import { useConfigs } from '@/lib/useConfigs';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { configs } = useConfigs();

  // Links editaveis pelo admin
  const navLinks = [
    { 
      label: configs['nav_link1_label'] || "INICIO", 
      href: configs['nav_link1_href'] || "#" 
    },
    { 
      label: configs['nav_link2_label'] || "SOBRE", 
      href: configs['nav_link2_href'] || "#sobre" 
    },
    { 
      label: configs['nav_link3_label'] || "CASES", 
      href: configs['nav_link3_href'] || "#portfolio" 
    },
    { 
      label: configs['nav_link4_label'] || "SERVICOS", 
      href: configs['nav_link4_href'] || "#servicos" 
    },
    { 
      label: configs['nav_link5_label'] || "CONTATO", 
      href: configs['nav_link5_href'] || "#contato" 
    },
  ].filter(link => link.label); // Remove links vazios

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    // Se for link externo, abrir em nova aba
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Se for ancora ou #, navegar suavemente
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Link interno para outra pagina
      window.location.href = href;
    }
  };

  return (
    <>
      {/* Botao Menu - fixo no canto */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 w-12 h-12 flex items-center justify-center text-white hover:text-gray-400 transition-colors"
        aria-label="Menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Logo fixo */}
      <a 
        href="#"
        onClick={(e) => handleNavClick(e, "#")}
        className="fixed top-6 left-6 z-50 hover:opacity-70 transition-opacity"
      >
        <LogoText size="sm" />
      </a>

      {/* Menu fullscreen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black flex items-center justify-center"
          >
            <nav className="text-center">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="block text-3xl md:text-5xl font-light tracking-[0.2em] text-white hover:text-gray-500 transition-colors py-4"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
