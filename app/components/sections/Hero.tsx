'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    }),
  };

  const canVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: 'easeOut' as const,
      },
    },
    float: {
      y: [0, -20, 0],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20 bg-gradient-to-br from-background via-coral/5 to-electric-purple/5">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-coral/20 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-electric-purple/20 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-mint/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* Floating Can Images */}
      <motion.div
        className="absolute left-[5%] top-[20%] w-32 md:w-48 z-0 opacity-30"
        variants={canVariants}
        initial="hidden"
        animate={['visible', 'float']}
      >
        <Image
          src="/Logo1.png"
          alt="Popup Tiny Bar Can"
          width={200}
          height={400}
          className="drop-shadow-2xl"
        />
      </motion.div>

      <motion.div
        className="absolute right-[5%] top-[25%] w-32 md:w-48 z-0 opacity-30"
        variants={canVariants}
        initial="hidden"
        animate={['visible', 'float']}
        style={{ animationDelay: '1s' }}
      >
        <Image
          src="/Logo2.png"
          alt="Popup Tiny Bar Can"
          width={200}
          height={400}
          className="drop-shadow-2xl"
        />
      </motion.div>

      <motion.div
        className="absolute left-[15%] bottom-[15%] w-24 md:w-40 z-0 opacity-20"
        variants={canVariants}
        initial="hidden"
        animate={['visible', 'float']}
        style={{ animationDelay: '2s' }}
      >
        <Image
          src="/Logo3.png"
          alt="Popup Tiny Bar Can"
          width={200}
          height={400}
          className="drop-shadow-2xl"
        />
      </motion.div>

      {/* Fourth floating can - center */}
      <motion.div
        className="absolute right-[20%] bottom-[20%] w-28 md:w-44 z-0 opacity-25"
        variants={canVariants}
        initial="hidden"
        animate={['visible', 'float']}
        style={{ animationDelay: '3s' }}
      >
        <Image
          src="/Logo2.png"
          alt="Popup Tiny Bar Can"
          width={200}
          height={400}
          className="drop-shadow-2xl"
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Animated Logo/Brand Name */}
        <div className="mb-8">
          <motion.h1
            className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold text-deep-purple tracking-tight"
            custom={0}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            Popup
          </motion.h1>
          <motion.h1
            className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold text-coral tracking-tight -mt-4"
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            Tiny Bar
          </motion.h1>
        </div>

        {/* Animated Tagline */}
        <div className="mb-12 space-y-4">
          <motion.p
            className="text-2xl md:text-4xl font-bold text-deep-purple"
            custom={2}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            Cocktails de autor.
          </motion.p>
          <motion.p
            className="text-2xl md:text-4xl font-bold text-electric-purple"
            custom={3}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            En lata.
          </motion.p>
          <motion.p
            className="text-2xl md:text-4xl font-bold text-mint"
            custom={4}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            En tu evento.
          </motion.p>
        </div>

        {/* Description */}
        <motion.p
          className="text-lg md:text-xl text-deep-purple/80 max-w-2xl mx-auto mb-12"
          custom={5}
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          Bar móvil premium con cocktails artesanales personalizados para bodas, eventos corporativos y celebraciones únicas.
        </motion.p>

        {/* CTA Buttons with Liquid Fill Effect */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          custom={6}
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.a
            href="#servicios"
            className="group relative px-8 py-4 bg-coral text-white font-bold text-lg rounded-full overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Diseña tu Evento</span>
            <motion.div
              className="absolute inset-0 bg-electric-purple origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>

          <motion.a
            href="#cocteles"
            className="group relative px-8 py-4 bg-transparent border-2 border-deep-purple text-deep-purple font-bold text-lg rounded-full overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 group-hover:text-white transition-colors">Ver Cocktails</span>
            <motion.div
              className="absolute inset-0 bg-deep-purple"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="w-6 h-10 border-2 border-deep-purple/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-deep-purple/50 rounded-full"
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

