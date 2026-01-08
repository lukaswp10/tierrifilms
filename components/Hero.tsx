'use client';

import { motion } from 'framer-motion';
import { LogoText } from './Logo';

const titleLines = [
  { text: "ESPECIALISTAS", style: "text-outline" },
  { text: "EM CAPTAR", style: "text-white" },
  { text: "MOMENTOS", style: "text-white text-italic" },
  { text: "REAIS", style: "text-outline text-italic" },
];

export default function Hero() {
  return (
    <section className="w-full min-h-[70vh] md:min-h-screen flex flex-col justify-center items-center px-4 md:px-8 lg:px-16 py-8 md:py-20 bg-black overflow-hidden">
      {/* Titulo Principal - Cada linha aparece em sequencia */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <h1 className="title-giant">
          {titleLines.map((line, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2 + index * 0.15,
                ease: "easeOut"
              }}
              className={`${line.style} block`}
            >
              {line.text}
            </motion.span>
          ))}
        </h1>
      </motion.div>

      {/* Logo estilizado T\F */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mt-4 md:mt-12 text-center"
      >
        <LogoText size="lg" />
      </motion.div>
    </section>
  );
}
