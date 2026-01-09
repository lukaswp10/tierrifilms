'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

// Parceiros/Clientes - trocar pelos logos reais depois
const partners = [
  { name: "BUFFET TORRES", row: 1 },
  { name: "CASA DE FESTAS SP", row: 1 },
  { name: "DECORART", row: 1 },
  { name: "FLOWERS & CO", row: 1 },
  { name: "VILLA EVENTOS", row: 1 },
  { name: "DOCES FINOS", row: 2 },
  { name: "DJ MARCOS", row: 2 },
  { name: "BUFFET GOURMET", row: 2 },
  { name: "ASSESSORIA PRIME", row: 2 },
  { name: "CERIMONIAL LUXO", row: 2 },
  { name: "FOTO STUDIO", row: 3 },
  { name: "MAKEUP ARTIST", row: 3 },
  { name: "ESPACOS VIP", row: 3 },
  { name: "CONVITES FINOS", row: 3 },
  { name: "BOLOS & CIA", row: 3 },
];

export default function Clients() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const row1 = partners.filter(p => p.row === 1);
  const row2 = partners.filter(p => p.row === 2);
  const row3 = partners.filter(p => p.row === 3);

  return (
    <section 
      className="w-full py-12 md:py-20" 
      ref={ref}
      style={{ backgroundColor: 'var(--bg-alt, #FFFFFF)' }}
    >
      {/* Row 1 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="flex flex-wrap justify-center items-center gap-8 md:gap-16 lg:gap-20 px-4 md:px-8 lg:px-16 mb-16"
      >
        {row1.map((partner, index) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-center"
          >
            <span 
              className="text-sm md:text-lg lg:text-xl font-light tracking-wide hover:opacity-50 transition-opacity duration-300 cursor-default"
              style={{ color: 'var(--text-alt, #000000)' }}
            >
              {partner.name}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Row 2 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-wrap justify-center items-center gap-8 md:gap-16 lg:gap-20 px-4 md:px-8 lg:px-16 mb-16"
      >
        {row2.map((partner, index) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="flex items-center justify-center"
          >
            <span 
              className="text-sm md:text-lg lg:text-xl font-light tracking-wide hover:opacity-50 transition-opacity duration-300 cursor-default"
              style={{ color: 'var(--text-alt, #000000)' }}
            >
              {partner.name}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Row 3 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-wrap justify-center items-center gap-8 md:gap-16 lg:gap-20 px-4 md:px-8 lg:px-16"
      >
        {row3.map((partner, index) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            className="flex items-center justify-center"
          >
            <span 
              className="text-sm md:text-lg lg:text-xl font-light tracking-wide hover:opacity-50 transition-opacity duration-300 cursor-default"
              style={{ color: 'var(--text-alt, #000000)' }}
            >
              {partner.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
