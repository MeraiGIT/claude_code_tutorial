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
      {/* Animated background bubbles - smaller and more subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => {
          const size = Math.random() * 20 + 8; // Reduced from 60+20 to 20+8
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-atlantis-aqua/15 backdrop-blur-sm"
              style={{
                width: size,
                height: size,
                left: `${Math.random() * 100}%`,
                bottom: -50,
                boxShadow: '0 0 10px rgba(109, 213, 237, 0.2)',
              }}
              animate={{
                y: [-50, -1000],
                x: [0, (Math.random() - 0.5) * 100],
                opacity: [0, 0.4, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: Math.random() * 5 + 8,
                repeat: Infinity,
                delay: Math.random() * 6,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated pearls in circular formation */}
        <div className="relative w-40 h-40">
          {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8;
            const delay = i * 0.12;

            return (
              <motion.div
                key={i}
                className="absolute w-5 h-5 rounded-full bg-gradient-to-br from-atlantis-light via-atlantis-aqua to-atlantis-teal"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                  boxShadow: '0 0 15px rgba(109, 213, 237, 0.6), 0 0 25px rgba(109, 213, 237, 0.3)',
                }}
                animate={{
                  rotate: 360,
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  rotate: {
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                  scale: {
                    duration: 1.6,
                    repeat: Infinity,
                    delay,
                    ease: 'easeInOut',
                  },
                  opacity: {
                    duration: 1.6,
                    repeat: Infinity,
                    delay,
                    ease: 'easeInOut',
                  },
                }}
                initial={{
                  x: Math.cos((angle * Math.PI) / 180) * 60,
                  y: Math.sin((angle * Math.PI) / 180) * 60,
                }}
              />
            );
          })}

          {/* Center pearl */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-white via-atlantis-light to-atlantis-aqua"
            style={{
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 40px rgba(109, 213, 237, 0.8), 0 0 60px rgba(109, 213, 237, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.4)',
            }}
            animate={{
              scale: [1, 1.25, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              scale: {
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              rotate: {
                duration: 5,
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
          <h2
            className="font-heading text-4xl text-atlantis-light mb-2"
            style={{
              textShadow: '0 0 20px rgba(109, 213, 237, 0.8), 0 0 40px rgba(109, 213, 237, 0.4)',
              letterSpacing: '0.15em',
            }}
          >
            ATLANTIS
          </h2>
          <p className="font-ui text-atlantis-aqua/90 text-lg tracking-wide">
            Diving into the depths{dots}
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-80 h-1.5 bg-atlantis-deep/50 rounded-full overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-atlantis-aqua via-atlantis-light to-atlantis-aqua rounded-full"
            style={{
              boxShadow: '0 0 20px rgba(109, 213, 237, 0.8), 0 0 30px rgba(109, 213, 237, 0.4)',
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
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
