'use client';

import { Instagram, Youtube, Facebook } from 'lucide-react';
import Link from 'next/link';
import { useConfigs } from '@/lib/useConfigs';

export default function Footer() {
  const { configs } = useConfigs();
  const currentYear = new Date().getFullYear();

  // Valores do banco ou fallbacks
  const slogan = configs['slogan_footer'] || 'ETERNIZE O REAL';
  const endereco = configs['endereco'] || 'SAO PAULO, SP';
  const email = configs['email_contato'] || 'contato@tierrifilms.com.br';
  const instagram = configs['instagram'] || 'https://instagram.com/tierrifilms';
  const youtube = configs['youtube'] || 'https://youtube.com/@tierrifilms';
  const facebook = configs['facebook'] || 'https://facebook.com/tierrifilms';

  const socialLinks = [
    { icon: <Instagram className="w-6 h-6" />, label: "Instagram", href: instagram },
    { icon: <Youtube className="w-6 h-6" />, label: "YouTube", href: youtube },
    { icon: <Facebook className="w-6 h-6" />, label: "Facebook", href: facebook },
  ];

  return (
    <footer className="w-full py-12 px-4 md:px-8 lg:px-16 bg-black border-t border-gray-800">
      <div className="max-w-6xl mx-auto text-center md:text-left">
        <div className="grid md:grid-cols-3 gap-8 md:gap-8 items-center">
          {/* Slogan */}
          <div className="order-1 md:order-1">
            <p className="text-sm font-normal tracking-[0.15em] uppercase">
              {slogan}
            </p>
          </div>

          {/* Endereco e Contato */}
          <div className="space-y-2 order-2 md:order-2">
            <p className="text-sm font-light text-gray-400 uppercase tracking-wide">
              {endereco}
            </p>
            <Link href={`mailto:${email}`} className="text-sm font-light text-gray-400 hover:text-white transition-colors">
              {email}
            </Link>
          </div>

          {/* Redes Sociais */}
          <div className="order-3 md:order-3">
            <p className="text-sm font-light text-gray-400 uppercase tracking-wide mb-3">
              SIGA-NOS:
            </p>
            <div className="flex justify-center md:justify-start gap-4">
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

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-800/50 text-center">
          <p className="text-xs font-light text-gray-600 uppercase tracking-wide">
            TIERRIFILMS {currentYear} ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
}
