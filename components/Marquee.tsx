'use client';

export default function Marquee() {
  const text = "PRODUCAO AUDIOVISUAL PARA CASAMENTOS E EVENTOS. O OLHAR CINEMATOGRAFICO QUE ETERNIZA SEUS MELHORES MOMENTOS. ";
  
  return (
    <section className="w-full py-8 bg-black border-y border-gray-800 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Repetir o texto varias vezes para criar o efeito continuo */}
        {[...Array(4)].map((_, i) => (
          <span 
            key={i} 
            className="text-sm md:text-base font-light tracking-[0.2em] uppercase text-gray-400 mx-8"
          >
            {text}
          </span>
        ))}
      </div>
    </section>
  );
}
