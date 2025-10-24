'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  priceFrom: string;
}

export default function ServiceSelector() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const services: ServiceCard[] = [
    {
      id: 'experiencia-completa',
      title: 'Experiencia Completa',
      description: 'Bartender profesional, barra de mixología artesanal y selección curada de destilados premium para su evento.',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2h-4L6 8h12l-4-6z"/>
          <path d="M6 8l1.5 13h9L18 8"/>
          <line x1="12" y1="13" x2="12" y2="18"/>
        </svg>
      ),
      features: ['Mixólogo certificado', 'Barra premium equipada', 'Servicio de 4-6 horas', 'Glassware de cristal'],
      priceFrom: '35,000',
    },
    {
      id: 'edicion-exclusiva',
      title: 'Edición Exclusiva',
      description: 'Latas personalizadas con su identidad de marca. Diseño artesanal, receta única y presentación impecable.',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="2" width="8" height="20" rx="1"/>
          <line x1="8" y1="8" x2="16" y2="8"/>
          <line x1="8" y1="14" x2="16" y2="14"/>
        </svg>
      ),
      features: ['Diseño personalizado', 'Logo y branding incluido', 'Pedido mínimo 50 unidades', 'Entrega coordinada'],
      priceFrom: '12,500',
    },
    {
      id: 'coleccion-privada',
      title: 'Colección Privada',
      description: 'La experiencia definitiva: bar móvil, cocktails personalizados y detalles VIP para ocasiones extraordinarias.',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
      ),
      features: ['Servicio completo', 'Estación de garnish gourmet', 'Menú personalizado impreso', 'Degustación privada previa'],
      priceFrom: '58,000',
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    }),
  };

  return (
    <section id="servicios" className="relative py-24 px-6 bg-pearl overflow-hidden">
      {/* Subtle Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #0a0a0a 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-5xl md:text-6xl text-midnight-navy mb-6 font-light">
            Nuestras Colecciones
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-rich-gold"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-rich-gold"></div>
            <div className="h-px w-12 bg-rich-gold"></div>
          </div>
          <p className="text-midnight-navy/70 font-montserrat text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Experiencias artesanales diseñadas para eventos que permanecen en la memoria
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              onHoverStart={() => setHoveredCard(service.id)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{ scale: 1.02 }}
              className="group relative bg-midnight-navy/95 backdrop-blur-sm border border-rich-gold/20 hover:border-rich-gold/60 transition-all duration-500 overflow-hidden"
            >
              {/* Gold Shimmer Effect on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rich-gold/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>

              {/* Card Content */}
              <div className="relative p-8 md:p-10">
                {/* Icon */}
                <motion.div
                  className="text-rich-gold mb-6"
                  animate={hoveredCard === service.id ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {service.icon}
                </motion.div>

                {/* Title */}
                <h3 className="font-serif text-2xl md:text-3xl text-champagne mb-4 font-light leading-tight">
                  {service.title}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <p className="font-montserrat text-sm text-rich-gold/80 uppercase tracking-widest mb-1">
                    Desde
                  </p>
                  <p className="font-bebas text-3xl text-rich-gold tracking-wide">
                    ${service.priceFrom} <span className="text-xl text-champagne/60">MXN</span>
                  </p>
                </div>

                {/* Description */}
                <p className="text-champagne/80 font-montserrat text-sm font-light leading-relaxed mb-8" style={{ lineHeight: '1.8' }}>
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 text-champagne/70 font-montserrat text-sm font-light"
                    >
                      <svg className="w-4 h-4 text-rich-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ x: 5 }}
                  className="group/btn flex items-center gap-2 text-rich-gold font-montserrat text-sm uppercase tracking-wider hover:text-champagne transition-colors duration-300"
                >
                  Consultar Disponibilidad
                  <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>

              {/* Bottom Gold Line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rich-gold/50 to-transparent"></div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-16 text-midnight-navy/60 font-montserrat text-sm font-light italic"
        >
          *Precios sujetos a disponibilidad y personalización. Cotizaciones personalizadas disponibles.
        </motion.p>
      </div>
    </section>
  );
}
