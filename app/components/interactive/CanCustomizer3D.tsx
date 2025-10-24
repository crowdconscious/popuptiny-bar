'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

interface CustomizationOptions {
  labelText: string;
  logoImage: string | null;
  finish: 'gold' | 'silver' | 'copper' | 'black-chrome';
  pattern: 'art-deco' | 'minimalist' | 'monogram' | 'classic';
}

export default function CanCustomizer3D() {
  const [options, setOptions] = useState<CustomizationOptions>({
    labelText: 'SU MARCA',
    logoImage: null,
    finish: 'gold',
    pattern: 'minimalist',
  });

  const finishes = [
    { id: 'gold' as const, name: 'Oro', color: '#D4AF37', gradient: 'from-rich-gold to-champagne' },
    { id: 'silver' as const, name: 'Plata', color: '#C0C0C0', gradient: 'from-gray-300 to-gray-100' },
    { id: 'copper' as const, name: 'Cobre', color: '#B87333', gradient: 'from-copper to-champagne' },
    { id: 'black-chrome' as const, name: 'Negro Cromado', color: '#1A1A1A', gradient: 'from-midnight-navy to-deep-black' },
  ];

  const patterns = [
    { id: 'art-deco' as const, name: 'Art Déco', description: 'Líneas geométricas elegantes' },
    { id: 'minimalist' as const, name: 'Minimalista', description: 'Diseño limpio y moderno' },
    { id: 'monogram' as const, name: 'Monograma', description: 'Iniciales entrelazadas' },
    { id: 'classic' as const, name: 'Clásico', description: 'Atemporalmente sofisticado' },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOptions(prev => ({ ...prev, logoImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getFinishStyles = () => {
    const finishMap = {
      'gold': 'bg-gradient-to-br from-rich-gold/30 to-champagne/30 border-rich-gold/60',
      'silver': 'bg-gradient-to-br from-gray-300/30 to-gray-100/30 border-gray-300/60',
      'copper': 'bg-gradient-to-br from-copper/30 to-champagne/30 border-copper/60',
      'black-chrome': 'bg-gradient-to-br from-midnight-navy/60 to-deep-black/80 border-deep-black/80',
    };
    return finishMap[options.finish];
  };

  return (
    <section id="personalizar" className="relative py-24 px-6 bg-midnight-navy min-h-screen overflow-hidden">
      {/* Spotlight Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rich-gold/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-5xl md:text-6xl text-champagne mb-6 font-light">
            Edición Exclusiva
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-rich-gold"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-rich-gold"></div>
            <div className="h-px w-12 bg-rich-gold"></div>
          </div>
          <p className="text-champagne/70 font-montserrat text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Mixología artesanal en latas transparentes de PET, selladas al momento con su identidad de marca
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Can Preview - Center Spotlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-3 relative"
          >
            {/* Spotlight Container */}
            <div className="relative bg-gradient-to-br from-deep-black to-midnight-navy rounded-2xl p-12 border border-rich-gold/20 shadow-2xl">
              {/* Moody Lighting Effect */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-rich-gold/10 rounded-full blur-3xl"></div>
              
              {/* Marble Counter Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-rich-gold/5 to-transparent"></div>

              <div className="relative w-full max-w-md mx-auto">
                {/* Actual Can Image */}
                <div className="relative w-full aspect-[2/3]">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image
                        src="/can.png"
                        alt="Premium PET Can"
                        fill
                        className="object-contain drop-shadow-2xl"
                        priority
                      />
                      
                      {/* Premium Label Overlay */}
                      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[65%] max-w-[240px] aspect-[4/3] ${getFinishStyles()} backdrop-blur-sm rounded-lg shadow-2xl flex flex-col items-center justify-center p-4 border-2`}>
                        {/* Edición Limitada Badge */}
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-rich-gold text-deep-black text-[10px] font-bebas tracking-widest">
                          EDICIÓN LIMITADA
                        </div>

                        {options.logoImage ? (
                          <div className="relative w-full h-20 mb-2">
                            <Image
                              src={options.logoImage}
                              alt="Logo preview"
                              fill
                              className="object-contain filter drop-shadow-lg"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-rich-gold/20 border border-rich-gold/40 mb-2 flex items-center justify-center text-rich-gold text-lg font-bebas">
                            PTB
                          </div>
                        )}
                        
                        <p className="text-champagne font-bebas text-lg text-center leading-tight tracking-wide">
                          {options.labelText}
                        </p>

                        {/* Pattern Accent */}
                        <div className="absolute bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rich-gold/50 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Badge */}
                <div className="mt-6 text-center">
                  <p className="text-champagne/60 font-montserrat text-xs uppercase tracking-widest">
                    Vista Previa • {patterns.find(p => p.id === options.pattern)?.name}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Customization Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Logo Upload */}
            <div className="bg-midnight-navy/50 border border-rich-gold/20 rounded-xl p-6">
              <label className="block text-champagne font-montserrat text-sm uppercase tracking-wider mb-4">
                01. Identidad de Marca
              </label>
              <div className="border-2 border-dashed border-rich-gold/30 hover:border-rich-gold/60 rounded-lg p-6 text-center transition-all duration-300 cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer block">
                  {options.logoImage ? (
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <Image
                        src={options.logoImage}
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-rich-gold/10 flex items-center justify-center text-rich-gold group-hover:bg-rich-gold/20 transition-colors">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <p className="text-champagne/80 font-montserrat text-sm mb-1">
                    {options.logoImage ? 'Cambiar logotipo' : 'Cargar logotipo'}
                  </p>
                  <p className="text-champagne/50 text-xs font-light">
                    PNG, JPG o SVG • Máx 5MB
                  </p>
                </label>
              </div>
            </div>

            {/* Text Label */}
            <div className="bg-midnight-navy/50 border border-rich-gold/20 rounded-xl p-6">
              <label className="block text-champagne font-montserrat text-sm uppercase tracking-wider mb-4">
                02. Texto Personalizado
              </label>
              <input
                type="text"
                value={options.labelText}
                onChange={(e) => setOptions(prev => ({ ...prev, labelText: e.target.value.toUpperCase() }))}
                className="w-full px-4 py-3 bg-deep-black/50 border border-rich-gold/30 text-champagne font-bebas text-lg text-center tracking-widest focus:border-rich-gold focus:outline-none transition-colors"
                maxLength={20}
                placeholder="SU MARCA"
              />
              <p className="text-champagne/50 text-xs mt-2 font-montserrat font-light text-right">
                {options.labelText.length}/20 caracteres
              </p>
            </div>

            {/* Metallic Finishes */}
            <div className="bg-midnight-navy/50 border border-rich-gold/20 rounded-xl p-6">
              <label className="block text-champagne font-montserrat text-sm uppercase tracking-wider mb-4">
                03. Acabado Premium
              </label>
              <div className="grid grid-cols-2 gap-3">
                {finishes.map((finish) => (
                  <button
                    key={finish.id}
                    onClick={() => setOptions(prev => ({ ...prev, finish: finish.id }))}
                    className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                      options.finish === finish.id
                        ? 'border-rich-gold bg-rich-gold/10'
                        : 'border-rich-gold/20 hover:border-rich-gold/40'
                    }`}
                  >
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br ${finish.gradient}`}></div>
                    <p className="text-champagne text-xs font-montserrat text-center">{finish.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Patterns */}
            <div className="bg-midnight-navy/50 border border-rich-gold/20 rounded-xl p-6">
              <label className="block text-champagne font-montserrat text-sm uppercase tracking-wider mb-4">
                04. Estilo de Diseño
              </label>
              <div className="space-y-2">
                {patterns.map((pattern) => (
                  <button
                    key={pattern.id}
                    onClick={() => setOptions(prev => ({ ...prev, pattern: pattern.id }))}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-300 ${
                      options.pattern === pattern.id
                        ? 'border-rich-gold bg-rich-gold/10'
                        : 'border-rich-gold/20 hover:border-rich-gold/40'
                    }`}
                  >
                    <p className="text-champagne font-montserrat text-sm mb-1">{pattern.name}</p>
                    <p className="text-champagne/50 text-xs font-light">{pattern.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-4 bg-rich-gold text-deep-black font-montserrat font-semibold text-sm uppercase tracking-wider hover:bg-champagne transition-colors duration-300"
              >
                Solicitar Muestra Digital
              </motion.button>
              
              <motion.a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5215512345678'}?text=${encodeURIComponent(`Me interesa la Edición Exclusiva:\n\n✏️ Texto: ${options.labelText}\n🎨 Acabado: ${finishes.find(f => f.id === options.finish)?.name}\n📐 Estilo: ${patterns.find(p => p.id === options.pattern)?.name}\n${options.logoImage ? '✓ Logo personalizado incluido' : ''}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full text-center px-8 py-4 border-2 border-rich-gold text-champagne font-montserrat font-medium text-sm uppercase tracking-wider hover:bg-rich-gold/10 transition-colors duration-300"
              >
                Consultar Disponibilidad
              </motion.a>
            </div>

            {/* Premium Note */}
            <div className="bg-rich-gold/10 border border-rich-gold/30 rounded-lg p-4">
              <p className="text-xs text-champagne/80 font-montserrat font-light leading-relaxed">
                <span className="font-medium text-rich-gold">Pedido mínimo:</span> 50 unidades • 
                Tiempo de producción: 5-7 días hábiles • 
                Incluye prueba de concepto digital
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
