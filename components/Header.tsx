'use client';

import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="text-center mb-8"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="inline-block"
      >
        <h1 className="text-6xl font-bold mb-2 text-glow">
          <span className="bg-gradient-to-r from-atlantis-light via-atlantis-aqua to-atlantis-teal bg-clip-text text-transparent">
            Atlantis
          </span>
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-atlantis-aqua text-xl font-light tracking-wide"
      >
        Your Underwater Task Kingdom
      </motion.p>

      {/* Decorative Elements */}
      <div className="flex justify-center gap-4 mt-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
            className="w-2 h-2 rounded-full bg-atlantis-aqua shadow-glow"
          />
        ))}
      </div>
    </motion.header>
  );
}
