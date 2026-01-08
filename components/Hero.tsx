'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="w-full min-h-screen flex flex-col justify-center items-center px-4 md:px-8 lg:px-16 py-20 bg-black">
      {/* Titulo Principal - Centralizado como sand.black */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="title-giant">
          <span className="text-outline block">ESPECIALISTAS</span>
          <span className="text-white block">EM CAPTAR</span>
          <span className="text-white text-italic block">MOMENTOS</span>
          <span className="text-outline text-italic block">REAIS</span>
        </h1>
      </motion.div>

      {/* Logo simplificado */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 text-center"
      >
        <span className="text-2xl md:text-3xl font-light tracking-[0.3em]">
          TF
        </span>
      </motion.div>
    </section>
  );
}
