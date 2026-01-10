'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Loading() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-atlantis-dark via-atlantis-deep to-atlantis-ocean"
    >
      {/* Animated background bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-atlantis-aqua/20"
            style={{
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
              left: `${Math.random() * 100}%`,
              bottom: -100,
            }}
            animate={{
              y: [-100, -1000],
              x: [0, (Math.random() - 0.5) * 200],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 6,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated pearls in circular formation */}
        <div className="relative w-32 h-32">
          {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8;
            const delay = i * 0.15;

            return (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full bg-gradient-to-br from-atlantis-light via-atlantis-aqua to-atlantis-teal shadow-lg"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                }}
                animate={{
                  rotate: 360,
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  rotate: {
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                  scale: {
                    duration: 1.5,
                    repeat: Infinity,
                    delay,
                    ease: 'easeInOut',
                  },
                  opacity: {
                    duration: 1.5,
                    repeat: Infinity,
                    delay,
                    ease: 'easeInOut',
                  },
                }}
                initial={{
                  x: Math.cos((angle * Math.PI) / 180) * 50,
                  y: Math.sin((angle * Math.PI) / 180) * 50,
                }}
              />
            );
          })}

          {/* Center pearl */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-white via-atlantis-light to-atlantis-aqua shadow-2xl"
            style={{
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 30px rgba(109, 213, 237, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.3)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              rotate: {
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          />
        </div>

        {/* Loading text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-heading text-3xl text-atlantis-light text-glow mb-2">
            Atlantis
          </h2>
          <p className="font-ui text-atlantis-aqua/80 text-lg">
            Diving into the depths{dots}
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-64 h-1 bg-atlantis-deep/50 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-atlantis-aqua via-atlantis-light to-atlantis-aqua rounded-full"
            style={{
              boxShadow: '0 0 20px rgba(109, 213, 237, 0.8)',
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-atlantis-light/60 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
