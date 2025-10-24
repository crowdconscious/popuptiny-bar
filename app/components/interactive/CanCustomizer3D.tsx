'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

interface CustomizationOptions {
  labelText: string;
  logoImage: string | null;
}

export default function CanCustomizer3D() {
  const [options, setOptions] = useState<CustomizationOptions>({
    labelText: 'TU MARCA',
    logoImage: null,
  });

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

  return (
    <section id="personalizar" className="py-20 px-6 bg-gradient-to-br from-mint/10 via-background to-electric-purple/5 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-deep-purple mb-4">
            Personaliza tu Etiqueta
          </h2>
          <p className="text-xl text-deep-purple/70 max-w-2xl mx-auto">
            Cocktails frescos en latas transparentes reciclables de PET, selladas con tapa de aluminio en el momento
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Can Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl sticky top-24"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Actual Can Image */}
              <div className="relative w-full aspect-[2/3]">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* The actual can image from public folder */}
                  <div className="relative w-full h-full">
                    <Image
                      src="/can.png"
                      alt="Transparent PET bottle"
                      fill
                      className="object-contain"
                      priority
                    />
                    
                    {/* Label overlay positioned on the can */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[65%] max-w-[240px] aspect-[4/3] bg-white/95 rounded-xl shadow-lg flex flex-col items-center justify-center p-4 border border-gray-200/50">
                      {options.logoImage ? (
                        <div className="relative w-full h-24 mb-2">
                          <Image
                            src={options.logoImage}
                            alt="Logo preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-coral to-electric-purple mb-2 flex items-center justify-center text-white text-2xl font-bold">
                          PTB
                        </div>
                      )}
                      <p className="text-deep-purple font-bold text-base text-center leading-tight">
                        {options.labelText}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg text-center">
                <p className="text-sm text-deep-purple/70">Vista previa de tu diseño personalizado</p>
              </div>
            </div>
          </motion.div>

          {/* Customization Controls */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Logo Upload */}
            <div>
              <label className="text-lg font-bold text-deep-purple mb-4 block">
                1. Sube tu Logo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-electric-purple transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer block"
                >
                  <div className="mb-4">
                    {options.logoImage ? (
                      <div className="relative w-32 h-32 mx-auto mb-2">
                        <Image
                          src={options.logoImage}
                          alt="Logo preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-br from-coral/20 to-electric-purple/20 flex items-center justify-center">
                        <span className="text-4xl">📸</span>
                      </div>
                    )}
                  </div>
                  <p className="text-deep-purple font-semibold mb-2">
                    {options.logoImage ? 'Cambiar logo' : 'Arrastra tu logo aquí o haz clic'}
                  </p>
                  <p className="text-sm text-deep-purple/60">
                    PNG, JPG o SVG (máx. 5MB)
                  </p>
                </label>
              </div>
              {options.logoImage && (
                <motion.button
                  onClick={() => setOptions(prev => ({ ...prev, logoImage: null }))}
                  className="mt-3 text-sm text-coral hover:text-coral/70 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✕ Eliminar logo
                </motion.button>
              )}
            </div>

            {/* Label Text */}
            <div>
              <label className="text-lg font-bold text-deep-purple mb-4 block">
                2. Texto de Etiqueta
              </label>
              <input
                type="text"
                value={options.labelText}
                onChange={(e) => setOptions(prev => ({ ...prev, labelText: e.target.value }))}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-electric-purple focus:outline-none font-bold text-center text-deep-purple text-lg"
                maxLength={30}
                placeholder="TU MARCA"
              />
              <p className="text-sm text-deep-purple/60 mt-2">
                {options.labelText.length}/30 caracteres
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4 pt-6">
              <motion.button
                onClick={() => {
                  // In a real app, this would save the design
                  alert('¡Diseño guardado! En producción, esto se guardaría en tu cuenta.');
                }}
                className="w-full px-8 py-4 bg-gradient-to-r from-coral to-electric-purple text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💾 Guardar Diseño
              </motion.button>
              
              <motion.a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5215512345678'}?text=${encodeURIComponent(`¡Hola! Me interesa personalizar latas:\n\n✏️ Texto: ${options.labelText}\n🎨 ${options.logoImage ? 'Logo personalizado incluido' : 'Sin logo por ahora'}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-8 py-4 border-2 border-mint text-mint font-bold rounded-full hover:bg-mint hover:text-white transition-colors"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  💬 Solicitar Cotización
                </motion.div>
              </motion.a>
            </div>

            {/* Info Note */}
            <div className="bg-mint/10 border-2 border-mint rounded-xl p-6">
              <h4 className="font-bold text-deep-purple mb-2">✨ Sobre nuestras latas</h4>
              <ul className="text-sm text-deep-purple/80 space-y-2">
                <li>🌱 <strong>PET reciclable</strong> - Transparente y ecológico</li>
                <li>🎯 <strong>Selladas al momento</strong> - Frescura garantizada</li>
                <li>🔒 <strong>Tapa de aluminio</strong> - Hermeticidad perfecta</li>
                <li>🎨 <strong>Personalización total</strong> - Tu diseño, tu marca</li>
                <li>📦 <strong>Pedido mínimo</strong> - 50 unidades</li>
                <li>💼 <strong>Ideal para eventos corporativos</strong> - Branding premium</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

