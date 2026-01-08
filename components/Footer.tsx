'use client';

import { motion } from 'framer-motion';
import { Instagram, Youtube, Facebook, ArrowUp, Heart } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const links = {
    navegacao: [
      { label: "Inicio", href: "#" },
      { label: "Sobre", href: "#sobre" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Servicos", href: "#servicos" },
      { label: "Contato", href: "#contato" },
    ],
    servicos: [
      { label: "Casamentos", href: "#servicos" },
      { label: "Eventos", href: "#servicos" },
      { label: "Corporativo", href: "#servicos" },
      { label: "Clipes", href: "#servicos" },
    ],
    social: [
      { icon: <Instagram className="w-4 h-4" />, label: "Instagram", href: "https://instagram.com/tierrifilms" },
      { icon: <Youtube className="w-4 h-4" />, label: "YouTube", href: "https://youtube.com/@tierrifilms" },
      { icon: <Facebook className="w-4 h-4" />, label: "Facebook", href: "https://facebook.com/tierrifilms" },
    ]
  };

  return (
    <>
      {/* Botao voltar ao topo - fixo no canto inferior direito */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#c9a227] hover:bg-[#e6b82e] rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-[#c9a227]/20 z-50"
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <ArrowUp className="w-5 h-5 text-black" />
      </motion.button>
      
      <footer className="relative bg-[#0a0a0a] border-t border-[#1a1a1a] z-20">

      <div className="max-w-6xl mx-auto px-4 pt-16 pb-8">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <h3 
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              <span className="text-white">TIERRI</span>
              <span className="text-[#c9a227]">FILMS</span>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Transformamos momentos em historias cinematograficas. Producao de video profissional para eternizar seus melhores momentos.
            </p>
            <div className="flex gap-2">
              {links.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md flex items-center justify-center text-gray-500 hover:text-[#c9a227] hover:border-[#c9a227]/50 transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Navegacao
            </h4>
            <ul className="space-y-3">
              {links.navegacao.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-gray-500 hover:text-[#c9a227] transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Servicos
            </h4>
            <ul className="space-y-3">
              {links.servicos.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-gray-500 hover:text-[#c9a227] transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Contato
            </h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <a href="tel:+5511999999999" className="hover:text-[#c9a227] transition-colors">
                  (11) 99999-9999
                </a>
              </li>
              <li>
                <a href="mailto:contato@tierrifilms.com.br" className="hover:text-[#c9a227] transition-colors">
                  contato@tierrifilms.com.br
                </a>
              </li>
              <li>Sao Paulo, SP</li>
            </ul>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            {currentYear} TIERRIFILMS. Todos os direitos reservados.
          </p>
          <p className="text-gray-600 text-sm flex items-center gap-1">
            Feito com <Heart className="w-4 h-4 text-[#c9a227]" /> para eternizar momentos
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
