'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navigation from '../components/sections/Navigation';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import { useCart } from '../context/CartContext';
import { hapticFeedback } from '../utils/haptics';

type LabelType = 'default' | 'custom-text' | 'logo' | 'template';

interface Customization {
  labelType: LabelType;
  line1: string;
  line2: string;
  colorPalette: string;
  font: string;
  template: string;
  logoUrl: string | null;
  applyTo: 'all' | string; // 'all' or cocktail id
}

const COLOR_PALETTES = [
  { id: 'gold', name: 'Oro Elegante', colors: ['#d4af37', '#f7e7ce', '#b87333'] },
  { id: 'classic', name: 'Clásico', colors: ['#1a1f2e', '#722f37', '#f8f6f3'] },
  { id: 'vibrant', name: 'Vibrante', colors: ['#ff6b6b', '#4ecdc4', '#ffe66d'] },
  { id: 'minimal', name: 'Minimal', colors: ['#ffffff', '#000000', '#808080'] },
  { id: 'tropical', name: 'Tropical', colors: ['#ff6b9d', '#c44569', '#f8b500'] },
];

const FONTS = [
  { id: 'serif', name: 'Elegante Serif', class: 'font-serif' },
  { id: 'sans', name: 'Moderno Sans', class: 'font-montserrat' },
  { id: 'display', name: 'Display Bold', class: 'font-accent' },
];

const TEMPLATES = [
  { id: 'birthday', name: '🎂 Cumpleaños', text: '¡Feliz Cumpleaños!' },
  { id: 'wedding', name: '💍 Boda', text: 'Ana & Carlos' },
  { id: 'corporate', name: '🏢 Corporativo', text: 'Tech Summit 2024' },
  { id: 'anniversary', name: '💕 Aniversario', text: '10 Años Juntos' },
  { id: 'graduation', name: '🎓 Graduación', text: '¡Felicidades!' },
];

export default function PersonalizarPage() {
  const router = useRouter();
  const { cart, totalCans } = useCart();
  const [customization, setCustomization] = useState<Customization>({
    labelType: 'default',
    line1: '',
    line2: '',
    colorPalette: 'gold',
    font: 'serif',
    template: '',
    logoUrl: null,
    applyTo: 'all',
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedCocktail, setSelectedCocktail] = useState<string | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (totalCans === 0) {
      router.push('/productos');
    }
  }, [totalCans, router]);

  if (totalCans === 0) {
    return null;
  }

  const handleLabelTypeChange = (type: LabelType) => {
    hapticFeedback.light();
    setCustomization(prev => ({
      ...prev,
      labelType: type,
      template: type === 'template' ? prev.template : '',
      logoUrl: type === 'logo' ? prev.logoUrl : null,
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setCustomization(prev => ({
        ...prev,
        template: templateId,
        line1: template.text,
        line2: '',
      }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomization(prev => ({
          ...prev,
          logoUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateCost = () => {
    if (customization.labelType === 'default') return 0;
    
    const cansToCustomize = customization.applyTo === 'all' 
      ? totalCans 
      : cart.find(item => item.id === customization.applyTo)?.quantity || 0;
    
    if (customization.labelType === 'custom-text') {
      return cansToCustomize * 20;
    } else if (customization.labelType === 'logo') {
      return cansToCustomize * 30;
    } else if (customization.labelType === 'template') {
      return cansToCustomize * 20;
    }
    return 0;
  };

  const handleSave = () => {
    // Save customization to localStorage
    localStorage.setItem('popit-customization', JSON.stringify(customization));
    
    // Show confetti
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      router.push('/productos');
    }, 2000);
  };

  const selectedPalette = COLOR_PALETTES.find(p => p.id === customization.colorPalette) || COLOR_PALETTES[0];
  const selectedFont = FONTS.find(f => f.id === customization.font) || FONTS[0];
  const previewText = customization.template 
    ? TEMPLATES.find(t => t.id === customization.template)?.text || customization.line1
    : customization.line1 || 'POPIT';

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-background pt-32">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-deep-purple mb-4">
              Personaliza tus Latas
            </h1>
            <p className="text-xl text-deep-purple/70">
              Haz que cada lata sea única con tu diseño personalizado
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: Can Preview */}
            <div className="lg:sticky lg:top-32 h-fit">
              <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-rich-gold/20">
                <h2 className="text-2xl font-serif font-bold text-deep-purple mb-6">
                  Vista Previa
                </h2>
                
                <div className="relative flex items-center justify-center min-h-[400px]">
                  {/* Can Preview */}
                  <motion.div
                    className="relative w-32 h-48 md:w-40 md:h-60"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {/* Can Body */}
                    <div 
                      className="w-full h-full rounded-t-lg rounded-b-sm relative overflow-hidden"
                      style={{
                        backgroundColor: cart[0]?.id === 'margarita' ? '#f7e7ce' : 
                                        cart[0]?.id === 'mojito' ? '#a8e6cf' : '#ffd3b6',
                      }}
                    >
                      {/* Can Top */}
                      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg"></div>
                      
                      {/* Label Area */}
                      <div 
                        className="absolute top-4 left-2 right-2 bottom-2 flex flex-col items-center justify-center p-2 rounded"
                        style={{
                          backgroundColor: customization.labelType === 'default' 
                            ? 'transparent' 
                            : selectedPalette.colors[0] + '20',
                          border: customization.labelType !== 'default' 
                            ? `2px solid ${selectedPalette.colors[0]}` 
                            : 'none',
                        }}
                      >
                        {customization.labelType === 'logo' && customization.logoUrl ? (
                          <img 
                            src={customization.logoUrl} 
                            alt="Logo" 
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className={`${selectedFont.class} text-center`}>
                            <div 
                              className="text-xs md:text-sm font-bold"
                              style={{ color: selectedPalette.colors[1] }}
                            >
                              {previewText}
                            </div>
                            {customization.line2 && (
                              <div 
                                className="text-xs font-bold mt-1"
                                style={{ color: selectedPalette.colors[2] }}
                              >
                                {customization.line2}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Preview Info */}
                <div className="mt-6 p-4 bg-rich-gold/5 rounded-lg">
                  <p className="text-sm text-deep-purple/70">
                    <strong>Tipo:</strong> {customization.labelType === 'default' ? 'Etiqueta Popit' : 
                                            customization.labelType === 'custom-text' ? 'Texto Personalizado' :
                                            customization.labelType === 'logo' ? 'Logo/Design' : 'Plantilla'}
                  </p>
                  {customization.applyTo !== 'all' && (
                    <p className="text-sm text-deep-purple/70 mt-1">
                      <strong>Aplicar a:</strong> {cart.find(c => c.id === customization.applyTo)?.name || 'Todos'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Customization Options */}
            <div className="space-y-4 lg:space-y-6 order-1 lg:order-2">
              {/* Label Type Selection */}
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-rich-gold/20">
                <h3 className="text-lg lg:text-xl font-serif font-bold text-deep-purple mb-3 lg:mb-4">
                  Tipo de Etiqueta
                </h3>
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                  <button
                    onClick={() => handleLabelTypeChange('default')}
                    className={`p-3 lg:p-4 rounded-lg border-2 transition-all min-h-[80px] ${
                      customization.labelType === 'default'
                        ? 'border-rich-gold bg-rich-gold/10'
                        : 'border-gray-200 hover:border-rich-gold/50'
                    }`}
                  >
                    <div className="font-bold text-sm lg:text-base text-deep-purple mb-1">Popit Default</div>
                    <div className="text-xs text-deep-purple/60">Sin costo extra</div>
                  </button>
                  
                  <button
                    onClick={() => handleLabelTypeChange('custom-text')}
                    className={`p-3 lg:p-4 rounded-lg border-2 transition-all min-h-[80px] ${
                      customization.labelType === 'custom-text'
                        ? 'border-rich-gold bg-rich-gold/10'
                        : 'border-gray-200 hover:border-rich-gold/50'
                    }`}
                  >
                    <div className="font-bold text-sm lg:text-base text-deep-purple mb-1">Texto Personalizado</div>
                    <div className="text-xs text-deep-purple/60">+$20 MXN/lata</div>
                  </button>
                  
                  <button
                    onClick={() => handleLabelTypeChange('logo')}
                    className={`p-3 lg:p-4 rounded-lg border-2 transition-all min-h-[80px] ${
                      customization.labelType === 'logo'
                        ? 'border-rich-gold bg-rich-gold/10'
                        : 'border-gray-200 hover:border-rich-gold/50'
                    }`}
                  >
                    <div className="font-bold text-sm lg:text-base text-deep-purple mb-1">Logo/Design</div>
                    <div className="text-xs text-deep-purple/60">+$30 MXN/lata</div>
                  </button>
                  
                  <button
                    onClick={() => handleLabelTypeChange('template')}
                    className={`p-3 lg:p-4 rounded-lg border-2 transition-all min-h-[80px] ${
                      customization.labelType === 'template'
                        ? 'border-rich-gold bg-rich-gold/10'
                        : 'border-gray-200 hover:border-rich-gold/50'
                    }`}
                  >
                    <div className="font-bold text-sm lg:text-base text-deep-purple mb-1">Plantillas</div>
                    <div className="text-xs text-deep-purple/60">+$20 MXN/lata</div>
                  </button>
                </div>
              </div>

              {/* Custom Text Fields */}
              {customization.labelType === 'custom-text' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-rich-gold/20"
                >
                  <h3 className="text-xl font-serif font-bold text-deep-purple mb-4">
                    Texto Personalizado
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-deep-purple mb-2">
                        Línea 1 (máx. 20 caracteres)
                      </label>
                      <input
                        type="text"
                        maxLength={20}
                        value={customization.line1}
                        onChange={(e) => setCustomization(prev => ({ ...prev, line1: e.target.value }))}
                        className="w-full px-4 py-2 border-2 border-rich-gold/30 rounded-lg focus:border-rich-gold focus:outline-none"
                        placeholder="Ej: Mi Evento"
                      />
                      <div className="text-xs text-deep-purple/60 mt-1">
                        {customization.line1.length}/20
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-deep-purple mb-2">
                        Línea 2 (máx. 20 caracteres, opcional)
                      </label>
                      <input
                        type="text"
                        maxLength={20}
                        value={customization.line2}
                        onChange={(e) => setCustomization(prev => ({ ...prev, line2: e.target.value }))}
                        className="w-full px-4 py-2 border-2 border-rich-gold/30 rounded-lg focus:border-rich-gold focus:outline-none"
                        placeholder="Ej: 2024"
                      />
                      <div className="text-xs text-deep-purple/60 mt-1">
                        {customization.line2.length}/20
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Template Selection */}
              {customization.labelType === 'template' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-rich-gold/20"
                >
                  <h3 className="text-xl font-serif font-bold text-deep-purple mb-4">
                    Plantillas para Ocasiones Especiales
                  </h3>
                  <select
                    value={customization.template}
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-rich-gold/30 rounded-lg focus:border-rich-gold focus:outline-none"
                  >
                    <option value="">Selecciona una plantilla</option>
                    {TEMPLATES.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                  {customization.template && (
                    <div className="mt-4 p-4 bg-rich-gold/5 rounded-lg">
                      <p className="text-sm text-deep-purple/70">
                        <strong>Vista previa:</strong> {TEMPLATES.find(t => t.id === customization.template)?.text}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Logo Upload */}
              {customization.labelType === 'logo' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-rich-gold/20"
                >
                  <h3 className="text-xl font-serif font-bold text-deep-purple mb-4">
                    Sube tu Logo/Design
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-full px-4 py-2 border-2 border-rich-gold/30 rounded-lg focus:border-rich-gold focus:outline-none"
                    />
                    {customization.logoUrl && (
                      <div className="mt-4 p-4 bg-rich-gold/5 rounded-lg">
                        <p className="text-sm text-deep-purple/70 mb-2">Vista previa:</p>
                        <img 
                          src={customization.logoUrl} 
                          alt="Logo preview" 
                          className="max-w-full h-32 object-contain"
                        />
                      </div>
                    )}
                    <p className="text-xs text-deep-purple/60">
                      Formatos aceptados: PNG, JPG, SVG. Tamaño recomendado: 300x300px
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Color Palette */}
              {customization.labelType !== 'default' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-rich-gold/20"
                >
                  <h3 className="text-xl font-serif font-bold text-deep-purple mb-4">
                    Paleta de Colores
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {COLOR_PALETTES.map(palette => (
                      <button
                        key={palette.id}
                        onClick={() => setCustomization(prev => ({ ...prev, colorPalette: palette.id }))}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          customization.colorPalette === palette.id
                            ? 'border-rich-gold scale-110'
                            : 'border-gray-200 hover:border-rich-gold/50'
                        }`}
                      >
                        <div className="flex gap-1 mb-2">
                          {palette.colors.map((color, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <div className="text-xs font-bold text-deep-purple">{palette.name}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Font Selector */}
              {customization.labelType !== 'default' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-rich-gold/20"
                >
                  <h3 className="text-xl font-serif font-bold text-deep-purple mb-4">
                    Tipo de Letra
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {FONTS.map(font => (
                      <button
                        key={font.id}
                        onClick={() => setCustomization(prev => ({ ...prev, font: font.id }))}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          customization.font === font.id
                            ? 'border-rich-gold bg-rich-gold/10'
                            : 'border-gray-200 hover:border-rich-gold/50'
                        }`}
                      >
                        <div className={`${font.class} text-lg font-bold text-deep-purple`}>
                          Aa
                        </div>
                        <div className="text-xs text-deep-purple/60 mt-1">{font.name}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Apply To */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-rich-gold/20">
                <h3 className="text-xl font-serif font-bold text-deep-purple mb-4">
                  Aplicar Personalización
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="applyTo"
                      checked={customization.applyTo === 'all'}
                      onChange={() => setCustomization(prev => ({ ...prev, applyTo: 'all' }))}
                      className="w-4 h-4 text-rich-gold focus:ring-rich-gold"
                    />
                    <span className="font-bold text-deep-purple">Aplicar a todos ({totalCans} latas)</span>
                  </label>
                  
                  <div className="ml-8 space-y-2">
                    {cart.map(item => (
                      <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="applyTo"
                          value={item.id}
                          checked={customization.applyTo === item.id}
                          onChange={(e) => setCustomization(prev => ({ ...prev, applyTo: e.target.value }))}
                          className="w-4 h-4 text-rich-gold focus:ring-rich-gold"
                        />
                        <span className="text-deep-purple/80">
                          Solo a {item.name} ({item.quantity} latas)
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-rich-gold/10 rounded-2xl p-6 border-2 border-rich-gold/30">
                <h3 className="text-xl font-serif font-bold text-deep-purple mb-4">
                  Resumen de Costos
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-deep-purple">
                    <span>Latas base</span>
                    <span>Incluido</span>
                  </div>
                  {customization.labelType !== 'default' && (
                    <div className="flex justify-between text-deep-purple font-bold">
                      <span>Personalización ({customization.applyTo === 'all' ? totalCans : cart.find(c => c.id === customization.applyTo)?.quantity || 0} latas)</span>
                      <span>+${calculateCost().toLocaleString('es-MX')} MXN</span>
                    </div>
                  )}
                  <div className="border-t border-rich-gold/30 pt-2 mt-2 flex justify-between text-xl font-bold text-rich-gold">
                    <span>Total adicional</span>
                    <span>${calculateCost().toLocaleString('es-MX')} MXN</span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full py-4 bg-rich-gold text-deep-black font-bold text-lg rounded-full hover:bg-rich-gold/80 transition-all duration-300 shadow-lg hover:scale-105"
              >
                Guardar y Continuar
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
          >
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                  backgroundColor: ['#d4af37', '#ff6b6b', '#4ecdc4', '#ffe66d', '#ff6b9d'][Math.floor(Math.random() * 5)],
                }}
                animate={{
                  y: [0, window.innerHeight + 100],
                  x: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, 360],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <WhatsAppButton />
    </>
  );
}

