'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: "Inicio", href: "#" },
    { label: "Sobre", href: "#sobre" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Servicos", href: "#servicos" },
    { label: "Contato", href: "#contato" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/90 backdrop-blur-md border-b border-white/10' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <a 
              href="#" 
              onClick={(e) => handleNavClick(e, "#")}
              className="text-2xl font-bold"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              <span className="text-white">TIERRI</span>
              <span className="text-[#c9a227]">FILMS</span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-gray-300 hover:text-white transition-colors text-sm tracking-wide uppercase"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contato"
                onClick={(e) => handleNavClick(e, "#contato")}
                className="bg-[#c9a227] hover:bg-[#e6b82e] text-black font-semibold px-5 py-2 rounded-full text-sm transition-all hover:scale-105"
              >
                Orcamento
              </a>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-lg md:hidden pt-24"
          >
            <div className="flex flex-col items-center gap-8 p-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-2xl text-gray-300 hover:text-white transition-colors tracking-wide uppercase"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contato"
                onClick={(e) => handleNavClick(e, "#contato")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="bg-[#c9a227] hover:bg-[#e6b82e] text-black font-semibold px-8 py-3 rounded-full text-lg transition-all mt-4"
              >
                Solicitar Orcamento
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
