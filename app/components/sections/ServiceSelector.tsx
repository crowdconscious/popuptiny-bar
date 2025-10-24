'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  features: string[];
}

export default function ServiceSelector() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const services: ServiceCard[] = [
    {
      id: 'bar-movil',
      title: 'Bar Móvil para tu Evento',
      description: 'Llevamos la experiencia completa: barra premium, bartender profesional y cocktails de autor.',
      icon: '🍸',
      color: 'coral',
      gradient: 'from-coral to-electric-purple',
      features: ['Bartender profesional', 'Setup completo', 'Cocktails ilimitados', '4-6 horas de servicio'],
    },
    {
      id: 'cocteles-personalizados',
      title: 'Cocktails Personalizados',
      description: 'Latas únicas con tu diseño, logo y receta. Perfectas para regalos y recuerdos memorables.',
      icon: '🥫',
      color: 'electric-purple',
      gradient: 'from-electric-purple to-mint',
      features: ['Diseño personalizado', 'Tu logo incluido', 'Desde 50 unidades', 'Entrega a domicilio'],
    },
    {
      id: 'paquetes-premium',
      title: 'Paquetes Especiales',
      description: 'La experiencia completa: bar móvil + cocktails personalizados + extras VIP para eventos únicos.',
      icon: '🎉',
      color: 'mint',
      gradient: 'from-mint to-coral',
      features: ['Todo incluido', 'Estación de garnish', 'Menú impreso', 'Degustación previa'],
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as const,
      },
    }),
  };

  const iconVariants = {
    idle: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.2,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5,
      },
    },
    tap: {
      scale: 0.9,
      rotate: 360,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="servicios" className="py-20 px-6 bg-gradient-to-b from-background to-mint/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-deep-purple mb-4">
            ¿Qué necesitas?
          </h2>
          <p className="text-xl text-deep-purple/70 max-w-2xl mx-auto">
            Elige la experiencia perfecta para tu evento
          </p>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              onHoverStart={() => setHoveredCard(service.id)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{
                y: -10,
                rotateY: 5,
                rotateX: 5,
              }}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              {/* Animated Gradient Border */}
              <motion.div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                style={{
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />

              {/* Icon with Animation */}
              <motion.div
                className={`w-20 h-20 bg-${service.color}/10 rounded-2xl flex items-center justify-center mb-6`}
                variants={iconVariants}
                animate={hoveredCard === service.id ? 'hover' : 'idle'}
                whileTap="tap"
              >
                <span className="text-5xl">{service.icon}</span>
              </motion.div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-deep-purple mb-4 font-serif">
                {service.title}
              </h3>
              
              <p className="text-deep-purple/70 mb-6">
                {service.description}
              </p>

              {/* Features List */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center gap-2 text-sm text-deep-purple/80"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 + i * 0.1 }}
                  >
                    <span className={`text-${service.color}`}>✓</span>
                    {feature}
                  </motion.li>
                ))}
              </ul>

              {/* CTA Link with Arrow Animation */}
              <motion.a
                href={`#${service.id}`}
                className={`text-${service.color} font-bold group-hover:text-electric-purple transition-colors inline-flex items-center gap-2`}
              >
                Conoce más
                <motion.span
                  animate={{
                    x: hoveredCard === service.id ? 5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  →
                </motion.span>
              </motion.a>

              {/* Fizz Particles on Hover */}
              {hoveredCard === service.id && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-2 h-2 bg-${service.color}/40 rounded-full`}
                      initial={{
                        x: Math.random() * 200 - 100,
                        y: 100,
                        opacity: 0,
                        scale: 0,
                      }}
                      animate={{
                        y: -100,
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.1,
                        repeat: Infinity,
                      }}
                      style={{
                        left: `${30 + i * 15}%`,
                        bottom: 0,
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-lg text-deep-purple/70 mb-6">
            ¿No estás seguro cuál elegir?
          </p>
          <motion.a
            href="#cotizador"
            className="inline-block px-8 py-4 bg-gradient-to-r from-coral via-electric-purple to-mint text-white font-bold text-lg rounded-full shadow-xl"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            Usa nuestro Cotizador Inteligente
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

