'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: { width: 40, height: 24, fontSize: 18 },
    md: { width: 60, height: 36, fontSize: 28 },
    lg: { width: 80, height: 48, fontSize: 38 },
  };

  const { width, height, fontSize } = sizes[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* T */}
      <text
        x="0"
        y="28"
        fill="white"
        fontFamily="Oswald, sans-serif"
        fontSize={fontSize}
        fontWeight="300"
        letterSpacing="0.05em"
      >
        T
      </text>
      
      {/* Barra diagonal estilizada \ */}
      <line
        x1="18"
        y1="8"
        x2="26"
        y2="28"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* F */}
      <text
        x="30"
        y="28"
        fill="white"
        fontFamily="Oswald, sans-serif"
        fontSize={fontSize}
        fontWeight="300"
        letterSpacing="0.05em"
      >
        F
      </text>
    </svg>
  );
}

// Versao alternativa apenas texto estilizado
export function LogoText({ size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <span className={`font-light tracking-[0.2em] ${sizes[size]} ${className}`}>
      T<span className="text-white/60">\</span>F
    </span>
  );
}

