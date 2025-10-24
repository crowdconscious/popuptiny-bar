'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  calculateQuote,
  getAvailableExtras,
  formatCurrency,
  validateQuoteInput,
  type QuoteInput,
  type EventType,
  type CocktailStyle,
  type ServiceLevel,
  type PricingBreakdown,
} from '@/lib/pricing-calculator';

const STEPS = [
  { id: 1, title: '¿Cuál es la vibe?', key: 'eventType' },
  { id: 2, title: '¿Cuántos sedientos?', key: 'guestCount' },
  { id: 3, title: 'Elige tu arsenal', key: 'cocktailStyle' },
  { id: 4, title: 'Nivel de servicio', key: 'serviceLevel' },
  { id: 5, title: '¿Algo más?', key: 'extras' },
  { id: 6, title: 'Tu cotización', key: 'result' },
];

export default function QuoteCalculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteData, setQuoteData] = useState<Partial<QuoteInput>>({
    extras: [],
  });
  const [result, setResult] = useState<PricingBreakdown | null>(null);

  const updateQuoteData = (field: string, value: any) => {
    setQuoteData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
    
    // Calculate quote when reaching the result step
    if (currentStep === STEPS.length - 1) {
      const validation = validateQuoteInput(quoteData);
      if (validation.valid && quoteData.eventType && quoteData.guestCount && quoteData.cocktailStyle && quoteData.serviceLevel) {
        const pricing = calculateQuote(quoteData as QuoteInput);
        setResult(pricing);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <section id="cotizador" className="py-20 px-6 bg-gradient-to-br from-electric-purple/5 via-background to-coral/5 min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto w-full">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-deep-purple">
              Cotizador Inteligente
            </h2>
            <span className="text-deep-purple/60 font-medium">
              Paso {currentStep} de {STEPS.length}
            </span>
          </div>
          <div className="w-full h-2 bg-deep-purple/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-coral via-electric-purple to-mint"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl min-h-[500px] flex flex-col"
          >
            {/* Step 1: Event Type */}
            {currentStep === 1 && (
              <Step1EventType
                value={quoteData.eventType}
                onChange={(value) => updateQuoteData('eventType', value)}
              />
            )}

            {/* Step 2: Guest Count */}
            {currentStep === 2 && (
              <Step2GuestCount
                value={quoteData.guestCount}
                onChange={(value) => updateQuoteData('guestCount', value)}
              />
            )}

            {/* Step 3: Cocktail Style */}
            {currentStep === 3 && (
              <Step3CocktailStyle
                value={quoteData.cocktailStyle}
                onChange={(value) => updateQuoteData('cocktailStyle', value)}
              />
            )}

            {/* Step 4: Service Level */}
            {currentStep === 4 && (
              <Step4ServiceLevel
                value={quoteData.serviceLevel}
                onChange={(value) => updateQuoteData('serviceLevel', value)}
              />
            )}

            {/* Step 5: Extras */}
            {currentStep === 5 && (
              <Step5Extras
                value={quoteData.extras || []}
                guestCount={quoteData.guestCount || 0}
                onChange={(value) => updateQuoteData('extras', value)}
              />
            )}

            {/* Step 6: Result */}
            {currentStep === 6 && result && (
              <Step6Result result={result} quoteData={quoteData} />
            )}

            {/* Navigation Buttons */}
            <div className="mt-auto pt-8 flex gap-4">
              {currentStep > 1 && currentStep < STEPS.length && (
                <motion.button
                  onClick={prevStep}
                  className="px-8 py-4 border-2 border-deep-purple text-deep-purple font-bold rounded-full hover:bg-deep-purple hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Atrás
                </motion.button>
              )}
              
              {currentStep < STEPS.length && (
                <motion.button
                  onClick={nextStep}
                  disabled={!isStepComplete(currentStep, quoteData)}
                  className="ml-auto px-8 py-4 bg-gradient-to-r from-coral to-electric-purple text-white font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentStep === STEPS.length - 1 ? 'Ver Cotización' : 'Siguiente →'}
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// Helper function to check if current step is complete
function isStepComplete(step: number, data: Partial<QuoteInput>): boolean {
  switch (step) {
    case 1: return !!data.eventType;
    case 2: return !!data.guestCount && data.guestCount >= 15;
    case 3: return !!data.cocktailStyle;
    case 4: return !!data.serviceLevel;
    case 5: return true; // Extras are optional
    default: return true;
  }
}

// ========================================
// STEP COMPONENTS
// ========================================

function Step1EventType({ value, onChange }: { value?: EventType; onChange: (value: EventType) => void }) {
  const options: { value: EventType; label: string; emoji: string; description: string }[] = [
    { value: 'wedding', label: 'Boda Elegante', emoji: '💍', description: 'Servicio premium para el día más especial' },
    { value: 'corporate', label: 'Evento Corporativo', emoji: '🏢', description: 'Profesional y sofisticado' },
    { value: 'private', label: 'Fiesta Privada', emoji: '🎉', description: 'Celebración épica y divertida' },
    { value: 'other', label: 'Otro Evento', emoji: '✨', description: 'Lanzamiento, gala, o evento especial' },
  ];

  return (
    <div>
      <h3 className="text-3xl font-serif font-bold text-deep-purple mb-3">
        ¿Cuál es la vibe de tu evento?
      </h3>
      <p className="text-deep-purple/70 mb-8">
        Esto nos ayuda a personalizar tu experiencia
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`p-6 rounded-2xl border-2 text-left transition-all ${
              value === option.value
                ? 'border-coral bg-coral/5'
                : 'border-deep-purple/20 hover:border-coral/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-4xl mb-3">{option.emoji}</div>
            <div className="font-bold text-xl text-deep-purple mb-1">{option.label}</div>
            <div className="text-sm text-deep-purple/60">{option.description}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function Step2GuestCount({ value, onChange }: { value?: number; onChange: (value: number) => void }) {
  const [inputValue, setInputValue] = useState(value?.toString() || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const num = parseInt(val);
    if (!isNaN(num) && num > 0) {
      onChange(num);
    }
  };

  const quickOptions = [30, 50, 75, 100, 150, 200];

  return (
    <div>
      <h3 className="text-3xl font-serif font-bold text-deep-purple mb-3">
        ¿Cuántos sedientos?
      </h3>
      <p className="text-deep-purple/70 mb-8">
        Número aproximado de invitados (mínimo 15)
      </p>
      
      <div className="mb-8">
        <input
          type="number"
          value={inputValue}
          onChange={handleChange}
          placeholder="Ejemplo: 75"
          className="w-full text-5xl font-bold text-center text-deep-purple bg-transparent border-b-4 border-coral focus:outline-none py-4"
          min="15"
          max="500"
        />
        {value && value >= 50 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-mint font-medium mt-4"
          >
            ✨ ¡Descuento por volumen aplicado!
          </motion.p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {quickOptions.map((num) => (
          <motion.button
            key={num}
            onClick={() => {
              onChange(num);
              setInputValue(num.toString());
            }}
            className={`py-3 rounded-xl border-2 font-bold transition-all ${
              value === num
                ? 'border-electric-purple bg-electric-purple text-white'
                : 'border-deep-purple/20 text-deep-purple hover:border-electric-purple/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {num}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function Step3CocktailStyle({ value, onChange }: { value?: CocktailStyle; onChange: (value: CocktailStyle) => void }) {
  const options: { value: CocktailStyle; label: string; description: string; icon: string }[] = [
    { value: 'classic', label: 'Clásicos Reimaginados', description: 'Margarita, Mojito, Old Fashioned con nuestro twist', icon: '🍸' },
    { value: 'signature', label: 'Autor Mexicano', description: 'Recetas únicas con ingredientes locales premium', icon: '🌶️' },
    { value: 'mocktail', label: 'Mocktails Increíbles', description: 'Opciones sin alcohol igual de sofisticadas', icon: '🍹' },
    { value: 'custom', label: 'Créalo Conmigo', description: 'Desarrollamos tu receta exclusiva', icon: '✨' },
  ];

  return (
    <div>
      <h3 className="text-3xl font-serif font-bold text-deep-purple mb-3">
        Elige tu arsenal
      </h3>
      <p className="text-deep-purple/70 mb-8">
        ¿Qué estilo de cocktails prefieres?
      </p>
      
      <div className="space-y-4">
        {options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-start gap-4 ${
              value === option.value
                ? 'border-electric-purple bg-electric-purple/5'
                : 'border-deep-purple/20 hover:border-electric-purple/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-4xl">{option.icon}</div>
            <div className="flex-1">
              <div className="font-bold text-xl text-deep-purple mb-1">{option.label}</div>
              <div className="text-sm text-deep-purple/60">{option.description}</div>
            </div>
            {value === option.value && (
              <div className="text-2xl text-electric-purple">✓</div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function Step4ServiceLevel({ value, onChange }: { value?: ServiceLevel; onChange: (value: ServiceLevel) => void }) {
  const options: { value: ServiceLevel; label: string; description: string; features: string[] }[] = [
    {
      value: 'self_service',
      label: 'Self-Service Station',
      description: 'Setup completo, tú sirves',
      features: ['Barra montada', 'Instrucciones claras', '30% más económico'],
    },
    {
      value: 'bartender',
      label: 'Bartender Incluido',
      description: 'Servicio profesional',
      features: ['Bartender experto', 'Servicio completo', 'Tú disfrutas sin preocupaciones'],
    },
    {
      value: 'full_experience',
      label: 'Full Experience + Show',
      description: 'Experiencia premium total',
      features: ['Bartender + asistente', 'Show de mixología', 'Estación de garnish', 'Wow factor garantizado'],
    },
  ];

  return (
    <div>
      <h3 className="text-3xl font-serif font-bold text-deep-purple mb-3">
        Nivel de servicio
      </h3>
      <p className="text-deep-purple/70 mb-8">
        ¿Cómo te gustaría que funcionara?
      </p>
      
      <div className="space-y-4">
        {options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
              value === option.value
                ? 'border-mint bg-mint/5'
                : 'border-deep-purple/20 hover:border-mint/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-xl text-deep-purple">{option.label}</div>
                <div className="text-sm text-deep-purple/60">{option.description}</div>
              </div>
              {value === option.value && (
                <div className="text-2xl text-mint">✓</div>
              )}
            </div>
            <ul className="space-y-1">
              {option.features.map((feature, i) => (
                <li key={i} className="text-sm text-deep-purple/70 flex items-center gap-2">
                  <span className="text-mint">•</span> {feature}
                </li>
              ))}
            </ul>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function Step5Extras({ value, guestCount, onChange }: { value: string[]; guestCount: number; onChange: (value: string[]) => void }) {
  const extras = getAvailableExtras();

  const toggleExtra = (extraId: string) => {
    if (value.includes(extraId)) {
      onChange(value.filter(id => id !== extraId));
    } else {
      onChange([...value, extraId]);
    }
  };

  return (
    <div>
      <h3 className="text-3xl font-serif font-bold text-deep-purple mb-3">
        ¿Algo más?
      </h3>
      <p className="text-deep-purple/70 mb-8">
        Agrega extras para hacer tu evento único (opcional)
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
        {extras.map((extra) => {
          const displayPrice = extra.perGuest && guestCount > 0
            ? extra.price * guestCount
            : extra.price;

          return (
            <motion.button
              key={extra.id}
              onClick={() => toggleExtra(extra.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                value.includes(extra.id)
                  ? 'border-coral bg-coral/5'
                  : 'border-deep-purple/20 hover:border-coral/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-bold text-deep-purple mb-1">{extra.label}</div>
                  <div className="text-sm font-medium text-coral">
                    {formatCurrency(displayPrice)}
                    {extra.perGuest && guestCount > 0 && (
                      <span className="text-xs text-deep-purple/60 ml-1">
                        (${extra.price} c/u)
                      </span>
                    )}
                  </div>
                </div>
                {value.includes(extra.id) && (
                  <div className="text-xl text-coral">✓</div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
      
      <p className="text-center text-deep-purple/60 text-sm mt-6">
        Puedes continuar sin extras si prefieres
      </p>
    </div>
  );
}

function Step6Result({ result, quoteData }: { result: PricingBreakdown; quoteData: Partial<QuoteInput> }) {
  return (
    <div className="overflow-y-auto max-h-[600px] pr-2">
      <h3 className="text-3xl font-serif font-bold text-deep-purple mb-3">
        Tu Cotización Personalizada
      </h3>
      <p className="text-deep-purple/70 mb-8">
        Precios transparentes, sin sorpresas
      </p>

      {/* Main Price */}
      <div className="bg-gradient-to-r from-coral/10 via-electric-purple/10 to-mint/10 rounded-2xl p-8 mb-6 text-center">
        <div className="text-deep-purple/60 text-sm uppercase tracking-wide mb-2">Total Estimado</div>
        <div className="text-6xl font-bold text-deep-purple mb-2">
          {formatCurrency(result.total)}
        </div>
        <div className="text-deep-purple/60">IVA incluido</div>
        {result.savings && result.savings > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-4 inline-block bg-mint text-white px-4 py-2 rounded-full font-bold"
          >
            ¡Ahorras {formatCurrency(result.savings)}!
          </motion.div>
        )}
      </div>

      {/* Breakdown */}
      <div className="space-y-3 mb-6">
        {result.breakdown.map((item, i) => (
          <div key={i} className="flex justify-between items-start py-2 border-b border-deep-purple/10">
            <div className="flex-1">
              <div className="font-medium text-deep-purple">{item.label}</div>
              {item.description && (
                <div className="text-sm text-deep-purple/60">{item.description}</div>
              )}
            </div>
            <div className={`font-bold ${item.amount < 0 ? 'text-mint' : 'text-deep-purple'}`}>
              {formatCurrency(Math.abs(item.amount))}
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Recommendation */}
      {result.recommendedUpgrade && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-electric-purple/10 border-2 border-electric-purple rounded-xl p-6 mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl">💡</div>
            <div className="flex-1">
              <div className="font-bold text-deep-purple mb-1">
                Considera: {result.recommendedUpgrade.name}
              </div>
              <div className="text-sm text-deep-purple/70 mb-2">
                {result.recommendedUpgrade.benefit}
              </div>
              <div className="text-electric-purple font-bold">
                + {formatCurrency(result.recommendedUpgrade.additionalCost)}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* CTA Buttons */}
      <div className="space-y-4">
        <motion.a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5215512345678'}?text=${encodeURIComponent(`¡Hola! Me interesa una cotización:\n\n💍 Evento: ${quoteData.eventType}\n👥 Invitados: ${quoteData.guestCount}\n🍸 Estilo: ${quoteData.cocktailStyle}\n\nTotal estimado: ${formatCurrency(result.total)}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-8 py-4 bg-mint text-white font-bold text-lg rounded-full hover:bg-mint/90 transition-colors shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          💬 Confirmar por WhatsApp
        </motion.a>
        
        <motion.button
          onClick={() => window.print()}
          className="block w-full text-center px-8 py-4 border-2 border-deep-purple text-deep-purple font-bold rounded-full hover:bg-deep-purple hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📄 Guardar/Imprimir Cotización
        </motion.button>
      </div>

      <p className="text-center text-sm text-deep-purple/60 mt-6">
        Esta cotización es válida por 30 días. Los precios finales pueden variar según disponibilidad.
      </p>
    </div>
  );
}

