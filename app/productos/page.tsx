'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '../components/sections/Navigation';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import { useCart } from '../context/CartContext';
import PackBuilder from './pack-builder';

interface Cocktail {
  id: string;
  name: string;
  description: string;
  abv: number;
  price: number;
  category: string;
  color: string;
}

interface CartItem extends Cocktail {
  quantity: number;
}

const COCKTAILS: Cocktail[] = [
  // Clásicos
  { id: 'margarita', name: 'Margarita Clásica', description: 'Tequila blanco, triple sec, jugo de limón fresco, sal de mar', abv: 15, price: 95, category: 'classic', color: '#f7e7ce' },
  { id: 'mojito', name: 'Mojito Premium', description: 'Ron blanco, menta fresca, lima, azúcar de caña, agua mineral', abv: 12, price: 95, category: 'classic', color: '#a8e6cf' },
  { id: 'old-fashioned', name: 'Old Fashioned', description: 'Whiskey, azúcar, bitters de angostura, naranja', abv: 18, price: 110, category: 'classic', color: '#d4af37' },
  // Autor Mexicano
  { id: 'paloma', name: 'Paloma Mexicana', description: 'Tequila reposado, Jarritos de toronja, limón, sal con chile', abv: 14, price: 100, category: 'signature', color: '#ffd3b6' },
  { id: 'mojito-jamaica', name: 'Mojito de Jamaica', description: 'Ron blanco, té de flor de jamaica, menta, limón', abv: 13, price: 100, category: 'signature', color: '#c44569' },
  { id: 'mezcal-sunrise', name: 'Mezcal Sunrise', description: 'Mezcal artesanal, jugo de naranja, granadina, chile', abv: 16, price: 115, category: 'signature', color: '#ffaaa5' },
  // Mocktails
  { id: 'tropical', name: 'Agua Fresca Tropical', description: 'Piña, mango, limón, menta, agua mineral', abv: 0, price: 75, category: 'mocktail', color: '#ffeaa7' },
  { id: 'virgin-mojito', name: 'Virgin Mojito de Fresa', description: 'Fresas frescas, menta, lima, jarabe de agave, soda', abv: 0, price: 75, category: 'mocktail', color: '#fd79a8' },
  { id: 'lavanda', name: 'Limonada de Lavanda', description: 'Limones frescos, jarabe de lavanda, agua con gas', abv: 0, price: 75, category: 'mocktail', color: '#a29bfe' },
];

const FEATURED_PACKS = [
  {
    id: 'pack-fiesta',
    name: 'Pack Fiesta',
    description: '24 latas mixtas',
    cocktails: [
      { id: 'margarita', qty: 6 },
      { id: 'mojito', qty: 6 },
      { id: 'paloma', qty: 6 },
      { id: 'mezcal-sunrise', qty: 6 },
    ],
    price: 2280,
    savings: 120,
  },
  {
    id: 'pack-clasicos',
    name: 'Pack Clásicos',
    description: '12 latas (6 Margaritas + 6 Mojitos)',
    cocktails: [
      { id: 'margarita', qty: 6 },
      { id: 'mojito', qty: 6 },
    ],
    price: 1140,
    savings: 0,
  },
  {
    id: 'pack-explorador',
    name: 'Pack Explorador',
    description: '6 sabores diferentes',
    cocktails: [
      { id: 'margarita', qty: 1 },
      { id: 'mojito', qty: 1 },
      { id: 'old-fashioned', qty: 1 },
      { id: 'paloma', qty: 1 },
      { id: 'mojito-jamaica', qty: 1 },
      { id: 'mezcal-sunrise', qty: 1 },
    ],
    price: 600,
    savings: 0,
  },
  {
    id: 'pack-sin-alcohol',
    name: 'Pack Sin Alcohol',
    description: '12 mocktails premium',
    cocktails: [
      { id: 'tropical', qty: 4 },
      { id: 'virgin-mojito', qty: 4 },
      { id: 'lavanda', qty: 4 },
    ],
    price: 900,
    savings: 0,
  },
];

export default function ProductosPage() {
  const router = useRouter();
  const { cart, addToCart: addToCartContext, updateQuantity: updateQuantityContext, totalCans } = useCart();
  const [fizzAnimations, setFizzAnimations] = useState<number[]>([]);
  const [celebrating, setCelebrating] = useState(false);
  const [shaking, setShaking] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = totalCans >= 24 ? 0 : 150;
  
  // Check for saved customization
  const [hasCustomization, setHasCustomization] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('popit-customization');
    setHasCustomization(!!saved);
  }, []);
  
  const customizationCost = hasCustomization ? (() => {
    try {
      const custom = JSON.parse(localStorage.getItem('popit-customization') || '{}');
      if (custom.labelType === 'default') return 0;
      const cansToCustomize = custom.applyTo === 'all' 
        ? totalCans 
        : cart.find(item => item.id === custom.applyTo)?.quantity || 0;
      if (custom.labelType === 'custom-text' || custom.labelType === 'template') {
        return cansToCustomize * 20;
      } else if (custom.labelType === 'logo') {
        return cansToCustomize * 30;
      }
    } catch (e) {
      return 0;
    }
    return 0;
  })() : 0;
  
  const total = subtotal + shipping + customizationCost;

  const addToCart = (cocktail: Cocktail, quantity: number = 1) => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);

    addToCartContext({
      id: cocktail.id,
      name: cocktail.name,
      price: cocktail.price,
      quantity,
    });

    // Fizz animation
    const timestamp = Date.now();
    setFizzAnimations(prev => [...prev, timestamp]);
    setTimeout(() => {
      setFizzAnimations(prev => prev.filter(t => t !== timestamp));
    }, 600);

    // Celebration at milestones
    if (totalCans + quantity >= 6 && totalCans < 6) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 2000);
    } else if (totalCans + quantity >= 12 && totalCans < 12) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 2000);
    } else if (totalCans + quantity >= 24 && totalCans < 24) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 2000);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    updateQuantityContext(id, delta);
  };

  const addPack = (pack: typeof FEATURED_PACKS[0]) => {
    pack.cocktails.forEach(({ id, qty }) => {
      const cocktail = COCKTAILS.find(c => c.id === id);
      if (cocktail) {
        addToCart(cocktail, qty);
      }
    });
  };


  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-background pt-32">
        {/* Header */}
        <section className="py-12 px-6 bg-gradient-to-br from-rich-gold/10 via-background to-copper/10 border-b border-rich-gold/20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-deep-purple mb-4">
              Arma tu Pack de Popits
            </h1>
            <p className="text-xl text-deep-purple/70">
              Mínimo 6 latas • Mezcla como quieras • Entrega el mismo día
            </p>
          </div>
        </section>

        {/* Pack Builder Section */}
        <section className="py-12 px-6 bg-gradient-to-br from-rich-gold/5 to-copper/5">
          <div className="max-w-7xl mx-auto mb-12">
            <PackBuilder />
          </div>
        </section>

        {/* Main Interface */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT: Product Grid */}
              <div className="lg:col-span-5">
                <h2 className="text-2xl font-serif font-bold text-deep-purple mb-6">
                  Nuestros Sabores
                </h2>
                <div className="space-y-6">
                  {COCKTAILS.map((cocktail) => {
                    const cartItem = cart.find(item => item.id === cocktail.id);
                    const quantity = cartItem?.quantity || 0;

                    return (
                      <motion.div
                        key={cocktail.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-rich-gold/20 hover:shadow-xl transition-all"
                      >
                        <div className="flex gap-4">
                          {/* Can Image */}
                          <div className="relative flex-shrink-0">
                            <motion.div
                              className="w-16 h-24 rounded-t-lg rounded-b-sm"
                              style={{ backgroundColor: cocktail.color }}
                              animate={shaking && cartItem ? { rotate: [0, -5, 5, -5, 0] } : {}}
                              transition={{ duration: 0.5 }}
                            >
                              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg"></div>
                              <div className="absolute top-3 left-1 right-1 bottom-2 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-deep-black">POPIT</span>
                              </div>
                            </motion.div>
                            {quantity > 0 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-rich-gold rounded-full flex items-center justify-center text-xs font-bold text-deep-black"
                              >
                                {quantity}
                              </motion.div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-serif font-bold text-deep-purple">
                                  {cocktail.name}
                                </h3>
                                <p className="text-sm text-deep-purple/70 mt-1">
                                  {cocktail.description}
                                </p>
                              </div>
                              {cocktail.abv > 0 && (
                                <span className="px-2 py-1 bg-rich-gold/20 text-rich-gold text-xs font-bold rounded">
                                  {cocktail.abv}%
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <div className="text-2xl font-bold text-deep-purple">
                                ${cocktail.price.toLocaleString('es-MX')}
                                <span className="text-sm font-normal text-deep-purple/60">/lata</span>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3">
                                {quantity > 0 ? (
                                  <>
                                    <button
                                      onClick={() => updateQuantity(cocktail.id, -1)}
                                      className="w-8 h-8 rounded-full bg-rich-gold/20 text-rich-gold font-bold hover:bg-rich-gold hover:text-white transition-colors"
                                    >
                                      −
                                    </button>
                                    <span className="w-8 text-center font-bold text-deep-purple">
                                      {quantity}
                                    </span>
                                    <button
                                      onClick={() => updateQuantity(cocktail.id, 1)}
                                      className="w-8 h-8 rounded-full bg-rich-gold text-white font-bold hover:bg-rich-gold/80 transition-colors"
                                    >
                                      +
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => addToCart(cocktail, 1)}
                                      className="px-4 py-2 bg-rich-gold text-white font-bold rounded-full hover:bg-rich-gold/80 transition-colors text-sm"
                                    >
                                      Agregar
                                    </button>
                                    <button
                                      onClick={() => addToCart(cocktail, 6)}
                                      className="px-3 py-2 bg-rich-gold/10 text-rich-gold font-bold rounded-full hover:bg-rich-gold/20 transition-colors text-xs border border-rich-gold/30"
                                    >
                                      +6
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* CENTER: Order Summary (Sticky) */}
              <div className="lg:col-span-4">
                <div className="sticky top-24">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-xl border-2 border-rich-gold/30"
                  >
                    <h2 className="text-2xl font-serif font-bold text-deep-purple mb-6">
                      Tu Pedido
                    </h2>

                    {/* Visual Can Counter */}
                    <div className="mb-6 p-4 bg-rich-gold/5 rounded-xl border border-rich-gold/20">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-deep-purple/70">
                          Total de latas
                        </span>
                        <motion.span
                          key={totalCans}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className={`text-3xl font-bold ${totalCans >= 6 ? 'text-rich-gold' : 'text-deep-purple/40'}`}
                        >
                          {totalCans}
                        </motion.span>
                      </div>
                      
                      {/* Stacked Cans Visual */}
                      <div className="flex gap-1 flex-wrap min-h-[60px] items-end">
                        {Array.from({ length: Math.min(totalCans, 24) }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-4 h-6 rounded-t-sm rounded-b-xs bg-rich-gold"
                            style={{
                              animationDelay: `${i * 0.05}s`,
                            }}
                          />
                        ))}
                        {totalCans === 0 && (
                          <p className="text-sm text-deep-purple/40 italic w-full text-center py-2">
                            Mínimo 6 latas
                          </p>
                        )}
                      </div>

                      {/* Celebration Messages */}
                      <AnimatePresence>
                        {celebrating && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-2 text-center"
                          >
                            <span className="text-rich-gold font-bold text-sm">
                              {totalCans >= 24 ? '🎉 ¡Envío GRATIS!' : totalCans >= 12 ? '🎊 ¡Gran pedido!' : '✨ ¡Mínimo alcanzado!'}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Cart Items List */}
                    {cart.length > 0 ? (
                      <div className="mb-6 space-y-3 max-h-64 overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <div className="flex-1">
                              <div className="font-bold text-deep-purple">{item.name}</div>
                              <div className="text-deep-purple/60">
                                {item.quantity} × ${item.price.toLocaleString('es-MX')}
                              </div>
                            </div>
                            <div className="font-bold text-deep-purple">
                              ${(item.quantity * item.price).toLocaleString('es-MX')}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mb-6 text-center text-deep-purple/40 py-8">
                        <p className="text-sm">Tu pack aparecerá aquí</p>
                      </div>
                    )}

                    {/* Custom Labels Link */}
                    <div className="mb-6 p-4 bg-rich-gold/5 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-deep-purple">
                          ¿Quieres personalizar las etiquetas?
                        </span>
                      </div>
                      <Link
                        href="/personalizar"
                        className="block w-full mt-3 px-4 py-2 bg-rich-gold/20 hover:bg-rich-gold/30 text-rich-gold font-bold rounded-lg transition-colors text-center text-sm"
                      >
                        Personalizar Etiquetas →
                      </Link>
                    </div>

                    {/* Shipping Calculator */}
                    <div className="mb-6 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-deep-purple/70">Subtotal</span>
                        <span className="font-bold text-deep-purple">
                          ${subtotal.toLocaleString('es-MX')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-deep-purple/70">Envío</span>
                        <span className={`font-bold ${shipping === 0 ? 'text-rich-gold' : 'text-deep-purple'}`}>
                          {shipping === 0 ? 'GRATIS' : `$${shipping.toLocaleString('es-MX')}`}
                        </span>
                      </div>
                      {customizationCost > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-deep-purple/70">Personalización</span>
                          <span className="font-bold text-deep-purple">
                            ${customizationCost.toLocaleString('es-MX')}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-rich-gold/20 pt-2 flex justify-between">
                        <span className="font-bold text-deep-purple">Total</span>
                        <span className="text-2xl font-bold text-rich-gold">
                          ${total.toLocaleString('es-MX')}
                        </span>
                      </div>
                    </div>

                    {/* Continue Button */}
                    <button
                      onClick={() => {
                        if (totalCans >= 6) {
                          router.push('/carrito');
                        }
                      }}
                      disabled={totalCans < 6}
                      className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
                        totalCans >= 6
                          ? 'bg-rich-gold text-deep-black hover:bg-rich-gold/80 shadow-lg hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {totalCans < 6
                        ? `Agrega ${6 - totalCans} lata${6 - totalCans > 1 ? 's' : ''} más`
                        : 'Ir al Carrito'}
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* RIGHT: Featured Packs */}
              <div className="lg:col-span-3">
                <h2 className="text-2xl font-serif font-bold text-deep-purple mb-6">
                  Packs Populares
                </h2>
                <div className="space-y-4">
                  {FEATURED_PACKS.map((pack) => (
                    <motion.div
                      key={pack.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl p-4 shadow-lg border border-rich-gold/20 hover:shadow-xl transition-all cursor-pointer"
                      onClick={() => addPack(pack)}
                    >
                      <h3 className="font-serif font-bold text-deep-purple mb-1">
                        {pack.name}
                      </h3>
                      <p className="text-sm text-deep-purple/70 mb-3">
                        {pack.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-rich-gold">
                          ${pack.price.toLocaleString('es-MX')}
                        </div>
                        {pack.savings > 0 && (
                          <span className="text-xs text-rich-gold font-bold">
                            Ahorra ${pack.savings}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fizz Animations */}
        <AnimatePresence>
          {fizzAnimations.map((timestamp) => (
            <motion.div
              key={timestamp}
              initial={{ opacity: 0, scale: 0.3, y: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 1.2], y: -100 }}
              exit={{ opacity: 0 }}
              className="fixed pointer-events-none z-50"
              style={{
                left: '50%',
                top: '50%',
                fontSize: '2rem',
              }}
            >
              ✨
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      <WhatsAppButton />
    </>
  );
}

