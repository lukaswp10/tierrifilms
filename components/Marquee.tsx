'use client';

export default function Marquee() {
  const text = "PRODUCAO AUDIOVISUAL PARA CASAMENTOS E EVENTOS ? O OLHAR CINEMATOGRAFICO QUE ETERNIZA SEUS MELHORES MOMENTOS ? ";
  
  return (
    <section className="w-full py-6 bg-black border-y border-gray-800/50 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Repetir o texto varias vezes para criar o efeito continuo */}
        {[...Array(4)].map((_, i) => (
          <span 
            key={i} 
            className="text-base md:text-lg font-light tracking-[0.25em] uppercase text-white/80 mx-4"
          >
            {text}
          </span>
        ))}
      </div>
    </section>
  );
}
