'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 1,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    }),
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-luxury-gradient">
      {/* Film Grain Overlay - Enhanced */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Subtle Gold Glow Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-rich-gold/5 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-copper/5 rounded-full blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
        <motion.div
          className="space-y-6 md:space-y-8"
          initial="hidden"
          animate="visible"
        >
          {/* Main Title - Tracked */}
          <motion.h1
            custom={0}
            variants={textVariants}
            className="text-tracked font-accent text-6xl md:text-8xl lg:text-9xl text-champagne tracking-[0.3em] font-normal"
          >
            POPUP
          </motion.h1>

          {/* Subtitle - Elegant Serif */}
          <motion.div
            custom={1}
            variants={textVariants}
            className="font-serif text-3xl md:text-5xl lg:text-6xl text-rich-gold font-light italic tracking-wide"
          >
            Tiny Bar
          </motion.div>

          {/* Divider Line */}
          <motion.div
            custom={2}
            variants={textVariants}
            className="flex items-center justify-center gap-4 py-4"
          >
            <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-rich-gold"></div>
            <div className="w-2 h-2 rounded-full bg-rich-gold animate-pulse"></div>
            <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-rich-gold"></div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            custom={3}
            variants={textVariants}
            className="font-serif text-xl md:text-2xl lg:text-3xl text-champagne/90 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Experiencias líquidas de autor
            <br className="hidden md:block" />
            <span className="text-rich-gold italic"> enlatadas al momento </span>
            para tus eventos
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            custom={4}
            variants={textVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
          >
            {/* Primary Ghost Button */}
            <Link
              href="#personalizar"
              className="group relative px-10 py-4 border-2 border-rich-gold text-champagne font-montserrat font-medium text-lg tracking-wider uppercase overflow-hidden transition-all duration-500 hover:text-deep-black"
            >
              <span className="relative z-10">Colección Exclusiva</span>
              <div className="absolute inset-0 bg-rich-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Link>

            {/* Secondary Ghost Button */}
            <Link
              href="#cotizador"
              className="group relative px-10 py-4 border-2 border-champagne/40 text-champagne/80 font-montserrat font-medium text-lg tracking-wider uppercase overflow-hidden transition-all duration-500 hover:border-copper hover:text-deep-black"
            >
              <span className="relative z-10">Reserve su Experiencia</span>
              <div className="absolute inset-0 bg-copper transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            custom={5}
            variants={textVariants}
            className="pt-12 md:pt-16"
          >
            <div className="flex flex-col items-center gap-3 text-champagne/50">
              <p className="text-sm uppercase tracking-widest font-montserrat font-light">Descubre más</p>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                }}
                className="w-px h-16 bg-gradient-to-b from-rich-gold/50 to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gold Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rich-gold/30 to-transparent"></div>
    </section>
  );
}
