'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

export default function Loading() {
  const [dots, setDots] = useState('');
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only generating random values after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Generate stable random values only on client side
  const bubbles = useMemo(() => {
    if (!mounted) return [];
    return [...Array(12)].map((_, i) => ({
      size: Math.random() * 15 + 10,
      left: Math.random() * 100,
      duration: Math.random() * 4 + 6,
      delay: Math.random() * 4,
      x: (Math.random() - 0.5) * 80,
    }));
  }, [mounted]);

  const particles = useMemo(() => {
    if (!mounted) return [];
    return [...Array(8)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 2 + 2,
      delay: Math.random() * 2,
    }));
  }, [mounted]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-atlantis-dark via-atlantis-deep to-atlantis-ocean"
    >
      {/* Animated background bubbles - optimized */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {bubbles.map((bubble, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-atlantis-aqua/10 backdrop-blur-sm border border-atlantis-aqua/20"
              style={{
                width: bubble.size,
                height: bubble.size,
                left: `${bubble.left}%`,
                bottom: -50,
              }}
              animate={{
                y: [-50, -window.innerHeight - 50],
                x: [0, bubble.x],
                opacity: [0, 0.6, 0],
                scale: [0.8, 1.1, 0.9],
              }}
              transition={{
                duration: bubble.duration,
                repeat: Infinity,
                delay: bubble.delay,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated pearls in circular formation */}
        <div className="relative w-44 h-44">
          {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8;
            const delay = i * 0.1;

            return (
              <motion.div
                key={i}
                className="absolute w-5 h-5 rounded-full bg-gradient-to-br from-atlantis-light via-atlantis-aqua to-atlantis-teal"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                  boxShadow:
                    '0 0 15px rgba(109, 213, 237, 0.6), 0 0 25px rgba(63, 180, 199, 0.3)',
                }}
                animate={{
                  rotate: 360,
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  rotate: {
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                  scale: {
                    duration: 1.4,
                    repeat: Infinity,
                    delay,
                    ease: 'easeInOut',
                  },
                  opacity: {
                    duration: 1.4,
                    repeat: Infinity,
                    delay,
                    ease: 'easeInOut',
                  },
                }}
                initial={{
                  x: Math.cos((angle * Math.PI) / 180) * 65,
                  y: Math.sin((angle * Math.PI) / 180) * 65,
                }}
              />
            );
          })}

          {/* Center pearl */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-white via-atlantis-light to-atlantis-aqua"
            style={{
              transform: 'translate(-50%, -50%)',
              boxShadow:
                '0 0 40px rgba(109, 213, 237, 0.9), 0 0 60px rgba(63, 180, 199, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.5)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              scale: {
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              rotate: {
                duration: 4.5,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          />
        </div>

        {/* Loading text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2
            className="font-heading text-5xl text-atlantis-light mb-3"
            style={{
              textShadow:
                '0 0 25px rgba(109, 213, 237, 0.9), 0 0 50px rgba(63, 180, 199, 0.5), 0 0 70px rgba(63, 180, 199, 0.3)',
              letterSpacing: '0.2em',
            }}
          >
            ATLANTIS
          </h2>
          <p className="font-ui text-atlantis-aqua text-lg tracking-widest">
            Diving into the depths{dots}
          </p>
        </motion.div>

        {/* Progress bar - improved design */}
        <motion.div
          className="w-96 h-2 bg-atlantis-deep/60 rounded-full overflow-hidden backdrop-blur-sm border border-atlantis-aqua/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <motion.div
            className="h-full rounded-full relative"
            style={{
              background:
                'linear-gradient(90deg, rgba(63, 180, 199, 0.4) 0%, rgba(109, 213, 237, 1) 50%, rgba(63, 180, 199, 0.4) 100%)',
              boxShadow:
                '0 0 25px rgba(109, 213, 237, 0.9), 0 0 40px rgba(109, 213, 237, 0.5)',
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Floating particles - optimized */}
        {mounted && (
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((particle, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-atlantis-light/70 rounded-full"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  boxShadow: '0 0 4px rgba(109, 213, 237, 0.6)',
                }}
                animate={{
                  y: [0, -25, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.4, 1],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
