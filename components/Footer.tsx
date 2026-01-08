'use client';

import { Instagram, Youtube, Facebook } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Instagram className="w-5 h-5" />, label: "Instagram", href: "https://instagram.com/tierrifilms" },
    { icon: <Youtube className="w-5 h-5" />, label: "YouTube", href: "https://youtube.com/@tierrifilms" },
    { icon: <Facebook className="w-5 h-5" />, label: "Facebook", href: "https://facebook.com/tierrifilms" },
  ];

  return (
    <footer className="w-full py-16 px-4 md:px-8 lg:px-16 bg-black border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {/* Slogan */}
          <div>
            <p className="text-sm font-normal tracking-[0.15em] uppercase">
              ETERNIZE O REAL
            </p>
          </div>

          {/* Endereco */}
          <div className="space-y-4">
            <p className="text-sm font-light text-gray-400 uppercase tracking-wide">
              SAO PAULO, SP
            </p>
            <p className="text-sm font-light text-gray-400">
              contato@tierrifilms.com.br
            </p>
          </div>

          {/* Redes Sociais */}
          <div>
            <p className="text-sm font-light text-gray-400 uppercase tracking-wide mb-4">
              FOLLOW US:
            </p>
            <div className="flex gap-4">
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
            
            <p className="text-xs font-light text-gray-600 mt-8 uppercase tracking-wide">
              TIERRIFILMS {currentYear} ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
