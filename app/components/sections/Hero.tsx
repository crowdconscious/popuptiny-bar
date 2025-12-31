'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Hero() {
  const [hoveredCan, setHoveredCan] = useState<number | null>(null);

  const flavors = [
    { name: 'Margarita Clásica', image: '/images/popit1.png' },
    { name: 'Mojito Premium', image: '/images/popit2.png' },
    { name: 'Paloma Mexicana', image: '/images/popit3.png' },
  ];

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

  const canVariants = {
    float: (i: number) => ({
      y: [0, -20, 0],
      x: [0, Math.sin(i) * 15, 0],
      rotate: [0, Math.sin(i) * 5, 0],
      transition: {
        duration: 4 + i,
        repeat: Infinity,
        ease: 'easeInOut' as const,
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

      {/* Floating Clickable Cans */}
      {flavors.map((flavor, index) => {
        const positions = [
          { top: '20%', left: '10%' },
          { top: '50%', right: '12%' },
          { top: '70%', left: '8%' },
        ];
        const pos = positions[index % positions.length];

        return (
          <motion.div
            key={index}
            className="absolute z-20 cursor-pointer"
            style={pos}
            custom={index}
            variants={canVariants}
            animate="float"
            onMouseEnter={() => setHoveredCan(index)}
            onMouseLeave={() => setHoveredCan(null)}
            onClick={() => window.location.href = '/cocteles'}
          >
            <div className="relative">
              {/* Can Image */}
              <motion.div
                className="relative w-20 h-28 md:w-24 md:h-32 transition-all duration-300"
                animate={{
                  scale: hoveredCan === index ? 1.15 : 1,
                }}
                style={{
                  filter: hoveredCan === index 
                    ? 'drop-shadow(0 8px 32px rgba(212, 175, 55, 0.6))' 
                    : 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.4))',
                }}
              >
                <Image
                  src={flavor.image}
                  alt={flavor.name}
                  width={96}
                  height={128}
                  className="object-contain w-full h-full"
                  style={{
                    transform: hoveredCan === index ? 'rotate(5deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                />
                {/* Gold border on hover */}
                {hoveredCan === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 border-2 border-rich-gold rounded-lg pointer-events-none"
                    style={{
                      boxShadow: '0 0 0 2px rgba(212, 175, 55, 0.3)',
                    }}
                  />
                )}
              </motion.div>

              {/* Flavor Tooltip */}
              {hoveredCan === index && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-rich-gold text-deep-black text-xs font-bold rounded shadow-lg border border-rich-gold/50 z-30"
                >
                  {flavor.name}
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
        <motion.div
          className="space-y-6 md:space-y-8"
          initial="hidden"
          animate="visible"
        >
          {/* Tagline - "popit here, popit there, popit anywhere" */}
          <motion.p
            custom={0}
            variants={textVariants}
            className="text-sm md:text-base text-rich-gold/70 font-montserrat tracking-[0.2em] uppercase"
          >
            popit here, popit there, popit anywhere
          </motion.p>

          {/* Main Title */}
          <motion.h1
            custom={1}
            variants={textVariants}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-champagne font-bold leading-tight"
          >
            Popit: Cocteles Premium en Lata
          </motion.h1>

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
            Entregamos la fiesta a tu puerta. Mínimo 6 latas.
          </motion.p>

          {/* Trust Badges */}
          <motion.div
            custom={4}
            variants={textVariants}
            className="flex flex-wrap justify-center gap-4 md:gap-6 pt-4"
          >
            <div className="px-4 py-2 bg-rich-gold/10 border border-rich-gold/30 rounded-full text-champagne text-sm md:text-base font-montserrat backdrop-blur-sm shadow-lg">
              ✨ Envío Gratis +24 latas
            </div>
            <div className="px-4 py-2 bg-rich-gold/10 border border-rich-gold/30 rounded-full text-champagne text-sm md:text-base font-montserrat backdrop-blur-sm shadow-lg">
              🍋 Hecho fresco
            </div>
            <div className="px-4 py-2 bg-rich-gold/10 border border-rich-gold/30 rounded-full text-champagne text-sm md:text-base font-montserrat backdrop-blur-sm shadow-lg">
              🚀 Entrega el mismo día
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            custom={5}
            variants={textVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
          >
            {/* Primary CTA */}
            <Link
              href="/productos"
              className="group relative px-10 py-4 border-2 border-rich-gold text-champagne font-montserrat font-medium text-lg tracking-wider uppercase overflow-hidden transition-all duration-500 hover:text-deep-black shadow-lg hover:shadow-rich-gold/50"
            >
              <span className="relative z-10">Arma tu Pack</span>
              <div className="absolute inset-0 bg-rich-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/cocteles"
              className="group relative px-10 py-4 border-2 border-champagne/40 text-champagne/80 font-montserrat font-medium text-lg tracking-wider uppercase overflow-hidden transition-all duration-500 hover:border-rich-gold hover:text-deep-black shadow-lg hover:shadow-rich-gold/30"
            >
              <span className="relative z-10">Ver Sabores</span>
              <div className="absolute inset-0 bg-rich-gold/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Link>
          </motion.div>

          {/* Discount Code */}
          <motion.div
            custom={6}
            variants={textVariants}
            className="pt-6"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-rich-gold/20 border border-rich-gold/50 rounded-full backdrop-blur-sm shadow-lg">
              <span className="text-champagne font-montserrat text-sm md:text-base">
                ¿Primera vez? <span className="text-rich-gold font-bold">10% OFF</span> con código{' '}
                <span className="text-rich-gold font-bold tracking-wider">Popiteverywhere</span>
              </span>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            custom={7}
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
