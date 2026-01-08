'use client';

import { Instagram, Youtube, Facebook } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Instagram className="w-6 h-6" />, label: "Instagram", href: "https://instagram.com/tierrifilms" },
    { icon: <Youtube className="w-6 h-6" />, label: "YouTube", href: "https://youtube.com/@tierrifilms" },
    { icon: <Facebook className="w-6 h-6" />, label: "Facebook", href: "https://facebook.com/tierrifilms" },
  ];

  return (
    <footer className="w-full py-12 md:py-16 px-6 md:px-8 lg:px-16 bg-black border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Mobile: Centralizado | Desktop: Grid */}
        <div className="flex flex-col items-center text-center md:text-left md:items-start md:grid md:grid-cols-3 gap-8 md:gap-8">
          
          {/* Slogan */}
          <div>
            <p className="text-base md:text-sm font-medium tracking-[0.2em] uppercase text-white">
              ETERNIZE O REAL
            </p>
          </div>

          {/* Endereco */}
          <div className="space-y-2 md:space-y-4">
            <p className="text-sm font-light text-gray-400 uppercase tracking-wide">
              SAO PAULO, SP
            </p>
            <a 
              href="mailto:contato@tierrifilms.com.br"
              className="text-sm font-light text-gray-400 hover:text-white transition-colors block"
            >
              contato@tierrifilms.com.br
            </a>
          </div>

          {/* Redes Sociais */}
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm font-light text-gray-400 uppercase tracking-wide mb-4">
              SIGA-NOS
            </p>
            <div className="flex gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright - Separado e centralizado */}
        <div className="mt-10 pt-6 border-t border-gray-800/50 text-center">
          <p className="text-xs font-light text-gray-600 uppercase tracking-wider">
            TIERRIFILMS {currentYear} &copy; TODOS OS DIREITOS RESERVADOS
          </p>
        </div>
      </div>
    </footer>
  );
}
