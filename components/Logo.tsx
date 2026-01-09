'use client';

import Image from 'next/image';
import { useConfigs } from '@/lib/useConfigs';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { height: 24, text: 'text-lg' },
  md: { height: 36, text: 'text-2xl' },
  lg: { height: 48, text: 'text-3xl' },
};

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const { configs, loading } = useConfigs();
  const { height } = sizes[size];

  const logoTipo = configs['logo_tipo'] || 'texto';
  const logoTexto = configs['logo_texto'] || 'T/F';
  const logoImagem = configs['logo_imagem_url'];

  if (loading) {
    return <div style={{ height }} className={className} />;
  }

  if (logoTipo === 'imagem' && logoImagem) {
    return (
      <Image
        src={logoImagem}
        alt="Logo"
        width={height * 2.5}
        height={height}
        className={`object-contain ${className}`}
        style={{ height, width: 'auto', maxWidth: height * 3 }}
      />
    );
  }

  return (
    <svg
      width={height * 1.8}
      height={height}
      viewBox="0 0 60 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="0"
        y="28"
        fill="white"
        fontFamily="Oswald, sans-serif"
        fontSize={height * 0.78}
        fontWeight="300"
        letterSpacing="0.05em"
      >
        T
      </text>
      <line
        x1="18"
        y1="8"
        x2="26"
        y2="28"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <text
        x="30"
        y="28"
        fill="white"
        fontFamily="Oswald, sans-serif"
        fontSize={height * 0.78}
        fontWeight="300"
        letterSpacing="0.05em"
      >
        F
      </text>
    </svg>
  );
}

export function LogoText({ size = 'md', className = '' }: LogoProps) {
  const { configs, loading } = useConfigs();
  const { height, text } = sizes[size];

  const logoTipo = configs['logo_tipo'] || 'texto';
  const logoTexto = configs['logo_texto'] || 'T/F';
  const logoImagem = configs['logo_imagem_url'];

  if (loading) {
    return <span style={{ height }} className={className} />;
  }

  if (logoTipo === 'imagem' && logoImagem) {
    return (
      <Image
        src={logoImagem}
        alt="Logo"
        width={height * 2.5}
        height={height}
        className={`object-contain ${className}`}
        style={{ height, width: 'auto', maxWidth: height * 3 }}
      />
    );
  }

  const separatorRegex = /([/\\|])/;
  const parts = logoTexto.split(separatorRegex);
  
  return (
    <span className={`font-light tracking-[0.2em] ${text} ${className}`}>
      {parts.map((part, i) => {
        if (part === '/' || part === '|') {
          return <span key={i} className="text-white/60">{part}</span>;
        }
        if (part === '\\') {
          return <span key={i} className="text-white/60">\</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
