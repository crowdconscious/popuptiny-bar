/**
 * Popup Tiny Bar - Pricing Calculator
 * Intelligent pricing logic based on industry standards + premium positioning
 */

export type EventType = 'wedding' | 'corporate' | 'private' | 'other';
export type CocktailStyle = 'classic' | 'signature' | 'mocktail' | 'custom';
export type ServiceLevel = 'self_service' | 'bartender' | 'full_experience';

export interface QuoteInput {
  eventType: EventType;
  guestCount: number;
  cocktailStyle: CocktailStyle;
  serviceLevel: ServiceLevel;
  extras: string[];
  eventDate?: Date;
  isWeekend?: boolean;
  duration?: number; // hours, default 4-6
}

export interface PricingBreakdown {
  basePrice: number;
  perPersonPrice: number;
  perPersonTotal: number;
  extrasPrice: number;
  subtotal: number;
  tax: number; // 16% IVA in Mexico
  total: number;
  breakdown: {
    label: string;
    amount: number;
    description?: string;
  }[];
  savings?: number; // If volume discount applied
  recommendedUpgrade?: {
    name: string;
    additionalCost: number;
    benefit: string;
  };
}

// ============================================
// BASE PRICING STRUCTURE (MXN)
// ============================================

const BASE_PRICES = {
  // Mobile Bar Setup Fees
  mobile_bar: {
    wedding: 15000, // Premium wedding setup
    corporate: 12000, // Professional corporate setup
    private: 10000, // Standard party setup
    other: 10000,
  },
  
  // Service Level Multipliers
  service_levels: {
    self_service: 0.7, // 30% discount, minimal bartender support
    bartender: 1.0, // Full price, professional bartender included
    full_experience: 1.35, // 35% premium, bartender + show + garnish station
  },
  
  // Per Person Pricing (4-6 hours unlimited cocktails)
  per_person: {
    classic: 320, // Classic cocktails (Margarita, Mojito, etc.)
    signature: 420, // Signature/premium cocktails
    mocktail: 180, // Non-alcoholic options
    custom: 480, // Custom recipes, premium ingredients
  },
};

// Volume Discounts (tiered pricing)
const VOLUME_DISCOUNTS = [
  { min: 150, discount: 0.15, label: '15% descuento volumen' }, // 150+ guests
  { min: 100, discount: 0.12, label: '12% descuento volumen' }, // 100+ guests
  { min: 75, discount: 0.08, label: '8% descuento volumen' }, // 75+ guests
  { min: 50, discount: 0.05, label: '5% descuento volumen' }, // 50+ guests
];

// Extras Pricing
const EXTRAS_PRICING: Record<string, number> = {
  'cans_regalo': 45, // Per guest, custom cans as party favors
  'estacion_garnish': 3500, // Premium garnish station
  'menu_impreso': 1500, // Custom printed menus
  'fotografo': 4500, // Event photographer (2 hours)
  'setup_premium': 5000, // Premium bar decoration
  'coctelero_extra': 3000, // Additional bartender
  'barra_extra': 8000, // Second bar station
  'mixologia_show': 6000, // Flair bartending show
};

// Peak Season Multiplier (December, May-June weddings)
const PEAK_MONTHS = [5, 6, 12]; // May, June, December
const PEAK_MULTIPLIER = 1.15; // 15% premium

// Weekend Multiplier (Friday-Sunday)
const WEEKEND_MULTIPLIER = 1.1; // 10% premium

// Tax Rate (IVA in Mexico)
const TAX_RATE = 0.16;

// ============================================
// PRICING CALCULATOR FUNCTIONS
// ============================================

/**
 * Calculate base price for event type and service level
 */
function calculateBasePrice(eventType: EventType, serviceLevel: ServiceLevel): number {
  const baseForEvent = BASE_PRICES.mobile_bar[eventType];
  const serviceMultiplier = BASE_PRICES.service_levels[serviceLevel];
  return Math.round(baseForEvent * serviceMultiplier);
}

/**
 * Calculate per-person price with volume discounts
 */
function calculatePerPersonPrice(
  cocktailStyle: CocktailStyle,
  guestCount: number,
  serviceLevel: ServiceLevel
): { perPersonPrice: number; discount: number; savings: number } {
  // Base per-person rate
  let perPersonBase = BASE_PRICES.per_person[cocktailStyle];
  
  // Apply service level adjustment
  perPersonBase = Math.round(perPersonBase * BASE_PRICES.service_levels[serviceLevel]);
  
  // Find applicable volume discount
  const discount = VOLUME_DISCOUNTS.find(tier => guestCount >= tier.min);
  
  if (discount) {
    const discountedPrice = Math.round(perPersonBase * (1 - discount.discount));
    const savings = (perPersonBase - discountedPrice) * guestCount;
    return {
      perPersonPrice: discountedPrice,
      discount: discount.discount,
      savings,
    };
  }
  
  return {
    perPersonPrice: perPersonBase,
    discount: 0,
    savings: 0,
  };
}

/**
 * Calculate extras pricing
 */
function calculateExtras(extras: string[], guestCount: number): number {
  return extras.reduce((total, extra) => {
    const price = EXTRAS_PRICING[extra] || 0;
    
    // Per-guest extras (like custom cans)
    if (extra === 'cans_regalo') {
      return total + (price * guestCount);
    }
    
    // Fixed price extras
    return total + price;
  }, 0);
}

/**
 * Apply date-based multipliers (peak season, weekends)
 */
function getDateMultiplier(eventDate?: Date, isWeekend?: boolean): number {
  let multiplier = 1.0;
  
  // Peak season check
  if (eventDate) {
    const month = eventDate.getMonth() + 1; // getMonth() is 0-indexed
    if (PEAK_MONTHS.includes(month)) {
      multiplier *= PEAK_MULTIPLIER;
    }
  }
  
  // Weekend check
  if (isWeekend || (eventDate && [0, 5, 6].includes(eventDate.getDay()))) {
    multiplier *= WEEKEND_MULTIPLIER;
  }
  
  return multiplier;
}

/**
 * Suggest upgrade opportunity
 */
function getRecommendedUpgrade(
  currentLevel: ServiceLevel,
  eventType: EventType,
  guestCount: number
): PricingBreakdown['recommendedUpgrade'] | undefined {
  if (currentLevel === 'bartender' && guestCount >= 50) {
    return {
      name: 'Full Experience con Show',
      additionalCost: Math.round(BASE_PRICES.mobile_bar[eventType] * 0.35),
      benefit: 'Incluye bartender profesional, estación de garnish premium, y show de mixología',
    };
  }
  
  if (currentLevel === 'self_service' && eventType === 'wedding') {
    return {
      name: 'Upgrade a Bartender Profesional',
      additionalCost: Math.round(BASE_PRICES.mobile_bar[eventType] * 0.3),
      benefit: 'Servicio profesional para que tú disfrutes tu evento sin preocupaciones',
    };
  }
  
  return undefined;
}

/**
 * MAIN PRICING CALCULATOR
 */
export function calculateQuote(input: QuoteInput): PricingBreakdown {
  const {
    eventType,
    guestCount,
    cocktailStyle,
    serviceLevel,
    extras,
    eventDate,
    isWeekend,
  } = input;
  
  // 1. Calculate base price
  const basePrice = calculateBasePrice(eventType, serviceLevel);
  
  // 2. Calculate per-person pricing with volume discounts
  const { perPersonPrice, discount, savings } = calculatePerPersonPrice(
    cocktailStyle,
    guestCount,
    serviceLevel
  );
  const perPersonTotal = perPersonPrice * guestCount;
  
  // 3. Calculate extras
  const extrasPrice = calculateExtras(extras, guestCount);
  
  // 4. Calculate subtotal before date multipliers
  let subtotal = basePrice + perPersonTotal + extrasPrice;
  
  // 5. Apply date-based multipliers
  const dateMultiplier = getDateMultiplier(eventDate, isWeekend);
  if (dateMultiplier > 1.0) {
    subtotal = Math.round(subtotal * dateMultiplier);
  }
  
  // 6. Calculate tax (IVA)
  const tax = Math.round(subtotal * TAX_RATE);
  
  // 7. Calculate total
  const total = subtotal + tax;
  
  // 8. Build breakdown
  const breakdown: PricingBreakdown['breakdown'] = [
    {
      label: 'Setup de Barra Móvil',
      amount: basePrice,
      description: `Incluye barra premium, equipo profesional, y ${serviceLevel === 'full_experience' ? 'experiencia completa' : serviceLevel === 'bartender' ? 'bartender profesional' : 'setup autoservicio'}`,
    },
    {
      label: `Servicio de Cocktails (${guestCount} personas)`,
      amount: perPersonTotal,
      description: `$${perPersonPrice.toLocaleString('es-MX')} por persona • ${cocktailStyle === 'classic' ? 'Cocktails clásicos' : cocktailStyle === 'signature' ? 'Cocktails de autor' : cocktailStyle === 'mocktail' ? 'Mocktails premium' : 'Recetas personalizadas'} • Barra libre 4-6 horas`,
    },
  ];
  
  // Add discount line if applicable
  if (savings > 0) {
    breakdown.push({
      label: `Descuento por volumen (${Math.round(discount * 100)}%)`,
      amount: -savings,
      description: `${guestCount} invitados = tarifa preferencial`,
    });
  }
  
  // Add extras
  if (extrasPrice > 0) {
    const extrasDetails = extras.map(extra => {
      const price = EXTRAS_PRICING[extra] || 0;
      const isPerGuest = extra === 'cans_regalo';
      return {
        label: getExtraLabel(extra),
        amount: isPerGuest ? price * guestCount : price,
      };
    });
    
    breakdown.push({
      label: 'Extras',
      amount: extrasPrice,
      description: extrasDetails.map(e => e.label).join(', '),
    });
  }
  
  // Add date multiplier note
  if (dateMultiplier > 1.0) {
    const multiplierPercent = Math.round((dateMultiplier - 1) * 100);
    breakdown.push({
      label: `Fecha premium (+${multiplierPercent}%)`,
      amount: Math.round((subtotal / dateMultiplier) * (dateMultiplier - 1)),
      description: isWeekend ? 'Fin de semana' : 'Temporada alta',
    });
  }
  
  breakdown.push({
    label: 'IVA (16%)',
    amount: tax,
  });
  
  // 9. Get upgrade recommendation
  const recommendedUpgrade = getRecommendedUpgrade(serviceLevel, eventType, guestCount);
  
  return {
    basePrice,
    perPersonPrice,
    perPersonTotal,
    extrasPrice,
    subtotal,
    tax,
    total,
    breakdown,
    savings: savings > 0 ? savings : undefined,
    recommendedUpgrade,
  };
}

/**
 * Helper to get human-readable extra labels
 */
function getExtraLabel(extraKey: string): string {
  const labels: Record<string, string> = {
    cans_regalo: 'Latas personalizadas de regalo',
    estacion_garnish: 'Estación de garnish premium',
    menu_impreso: 'Menús impresos personalizados',
    fotografo: 'Fotógrafo de evento',
    setup_premium: 'Decoración premium de barra',
    coctelero_extra: 'Bartender adicional',
    barra_extra: 'Segunda estación de bar',
    mixologia_show: 'Show de mixología',
  };
  return labels[extraKey] || extraKey;
}

/**
 * Get all available extras with pricing
 */
export function getAvailableExtras(): { id: string; label: string; price: number; perGuest: boolean }[] {
  return Object.entries(EXTRAS_PRICING).map(([key, price]) => ({
    id: key,
    label: getExtraLabel(key),
    price,
    perGuest: key === 'cans_regalo',
  }));
}

/**
 * Validate quote input
 */
export function validateQuoteInput(input: Partial<QuoteInput>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!input.eventType) errors.push('Tipo de evento requerido');
  if (!input.guestCount || input.guestCount < 15) errors.push('Mínimo 15 invitados');
  if (input.guestCount && input.guestCount > 500) errors.push('Para eventos de más de 500 personas, contáctanos directamente');
  if (!input.cocktailStyle) errors.push('Estilo de cocktails requerido');
  if (!input.serviceLevel) errors.push('Nivel de servicio requerido');
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

