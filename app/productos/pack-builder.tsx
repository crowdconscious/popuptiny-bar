'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

interface Cocktail {
  id: string;
  name: string;
  color: string;
  price: number;
}

interface PackSlot {
  id: string;
  cocktailId: string | null;
  position: number;
}

const COCKTAILS: Cocktail[] = [
  { id: 'margarita', name: 'Margarita Clásica', color: '#f7e7ce', price: 95 },
  { id: 'mojito', name: 'Mojito Premium', color: '#a8e6cf', price: 95 },
  { id: 'old-fashioned', name: 'Old Fashioned', color: '#d4af37', price: 110 },
  { id: 'paloma', name: 'Paloma Mexicana', color: '#ffd3b6', price: 100 },
  { id: 'mojito-jamaica', name: 'Mojito de Jamaica', color: '#c44569', price: 100 },
  { id: 'mezcal-sunrise', name: 'Mezcal Sunrise', color: '#ffaaa5', price: 115 },
  { id: 'tropical', name: 'Agua Fresca Tropical', color: '#ffeaa7', price: 75 },
  { id: 'virgin-mojito', name: 'Virgin Mojito de Fresa', color: '#fd79a8', price: 75 },
  { id: 'lavanda', name: 'Limonada de Lavanda', color: '#a29bfe', price: 75 },
];

const PACK_OF_THE_MONTH = {
  name: 'Pack Verano',
  description: 'Sabores refrescantes para el verano',
  cocktails: [
    { id: 'mojito', qty: 4 },
    { id: 'tropical', qty: 4 },
    { id: 'virgin-mojito', qty: 4 },
  ],
};

export default function PackBuilder() {
  const { addToCart } = useCart();
  const [packSize, setPackSize] = useState<6 | 12 | 24>(6);
  const [slots, setSlots] = useState<PackSlot[]>([]);
  const [draggedCocktail, setDraggedCocktail] = useState<string | null>(null);
  const [savedPacks, setSavedPacks] = useState<any[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [userStats, setUserStats] = useState({
    flavorsTried: new Set<string>(),
    totalOrders: 0,
    points: 0,
    badges: [] as string[],
  });

  // Initialize slots based on pack size
  useEffect(() => {
    setSlots(Array.from({ length: packSize }, (_, i) => ({
      id: `slot-${i}`,
      cocktailId: null,
      position: i,
    })));
  }, [packSize]);

  // Load user stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('popit-user-stats');
    if (saved) {
      try {
        const stats = JSON.parse(saved);
        setUserStats({
          ...stats,
          flavorsTried: new Set(stats.flavorsTried || []),
        });
      } catch (e) {
        console.error('Error loading user stats', e);
      }
    }
  }, []);

  // Check for early bird discount
  const isEarlyBird = new Date().getHours() < 12;
  const filledSlots = slots.filter(s => s.cocktailId !== null).length;
  const isMinimumReached = filledSlots >= 6;

  // Calculate discount
  const getDiscount = () => {
    if (filledSlots >= 24) return 0.15;
    if (filledSlots >= 12) return 0.10;
    return 0;
  };

  const discount = getDiscount();
  const earlyBirdDiscount = isEarlyBird ? 0.05 : 0;
  const totalDiscount = Math.min(discount + earlyBirdDiscount, 0.20); // Max 20% off

  const calculateTotal = () => {
    const baseTotal = slots
      .filter(s => s.cocktailId)
      .reduce((sum, slot) => {
        const cocktail = COCKTAILS.find(c => c.id === slot.cocktailId);
        return sum + (cocktail?.price || 0);
      }, 0);
    
    return Math.round(baseTotal * (1 - totalDiscount));
  };

  const handleDragStart = (cocktailId: string) => {
    setDraggedCocktail(cocktailId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (slotId: string) => {
    if (draggedCocktail) {
      setSlots(prev => prev.map(slot =>
        slot.id === slotId
          ? { ...slot, cocktailId: draggedCocktail }
          : slot
      ));
      
      // Track flavor tried
      setUserStats(prev => {
        const newTried = new Set(prev.flavorsTried);
        newTried.add(draggedCocktail);
        const newStats = {
          ...prev,
          flavorsTried: newTried,
        };
        
        // Check for Mixólogo badge
        if (newTried.size === COCKTAILS.length && !prev.badges.includes('mixologo')) {
          newStats.badges = [...prev.badges, 'mixologo'];
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        }
        
        localStorage.setItem('popit-user-stats', JSON.stringify({
          ...newStats,
          flavorsTried: Array.from(newTried),
        }));
        
        return newStats;
      });
      
      setDraggedCocktail(null);
    }
  };

  const handleRemove = (slotId: string) => {
    setSlots(prev => prev.map(slot =>
      slot.id === slotId
        ? { ...slot, cocktailId: null }
        : slot
    ));
  };

  const handleShake = () => {
    setIsShaking(true);
    const filled = slots.filter(s => s.cocktailId !== null).length;
    if (filled === 0) return;
    
    const availableCocktails = COCKTAILS.map(c => c.id);
    const shuffled = [...availableCocktails].sort(() => Math.random() - 0.5);
    
    setSlots(prev => prev.map((slot, i) => ({
      ...slot,
      cocktailId: i < filled ? shuffled[i % shuffled.length] : null,
    })));
    
    setTimeout(() => setIsShaking(false), 1000);
  };

  const handleSavePack = () => {
    const pack = {
      id: Date.now().toString(),
      name: `Mi Pack ${savedPacks.length + 1}`,
      size: packSize,
      slots: slots.filter(s => s.cocktailId !== null).map(s => ({
        cocktailId: s.cocktailId!,
      })),
      createdAt: new Date().toISOString(),
    };
    
    const newSaved = [...savedPacks, pack];
    setSavedPacks(newSaved);
    localStorage.setItem('popit-saved-packs', JSON.stringify(newSaved));
  };

  const handleLoadPack = (pack: any) => {
    setPackSize(pack.size as 6 | 12 | 24);
    // Slots will be updated by useEffect
    setTimeout(() => {
      const newSlots = Array.from({ length: pack.size }, (_, i) => ({
        id: `slot-${i}`,
        cocktailId: pack.slots[i]?.cocktailId || null,
        position: i,
      }));
      setSlots(newSlots);
    }, 0);
  };

  const handleAddPackOfMonth = () => {
    setPackSize(12);
    setTimeout(() => {
      const newSlots: PackSlot[] = [];
      let position = 0;
      PACK_OF_THE_MONTH.cocktails.forEach(({ id, qty }) => {
        for (let i = 0; i < qty; i++) {
          newSlots.push({
            id: `slot-${position}`,
            cocktailId: id,
            position: position++,
          });
        }
      });
      setSlots(newSlots);
    }, 0);
  };

  const handleAddToCart = () => {
    const cocktailsToAdd = slots
      .filter(s => s.cocktailId)
      .reduce((acc, slot) => {
        const id = slot.cocktailId!;
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    Object.entries(cocktailsToAdd).forEach(([id, qty]) => {
      const cocktail = COCKTAILS.find(c => c.id === id);
      if (cocktail) {
        addToCart({
          id: cocktail.id,
          name: cocktail.name,
          price: cocktail.price,
          quantity: qty,
        });
      }
    });

    // Award points
    setUserStats(prev => {
      const points = prev.points + filledSlots * 10;
      const newStats = {
        ...prev,
        totalOrders: prev.totalOrders + 1,
        points,
      };
      localStorage.setItem('popit-user-stats', JSON.stringify({
        ...newStats,
        flavorsTried: Array.from(newStats.flavorsTried),
      }));
      return newStats;
    });
  };

  const handleShare = () => {
    const packDescription = slots
      .filter(s => s.cocktailId)
      .map(s => {
        const cocktail = COCKTAILS.find(c => c.id === s.cocktailId);
        return cocktail?.name;
      })
      .join(', ');
    
    const text = `¡Mira mi pack personalizado de Popits! ${packDescription}`;
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({ text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert('¡Link copiado al portapapeles!');
    }
  };

  // Load saved packs
  useEffect(() => {
    const saved = localStorage.getItem('popit-saved-packs');
    if (saved) {
      try {
        setSavedPacks(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved packs', e);
      }
    }
  }, []);

  const getPackContainerClass = () => {
    if (packSize === 6) return 'grid-cols-3 grid-rows-2';
    if (packSize === 12) return 'grid-cols-4 grid-rows-3';
    return 'grid-cols-6 grid-rows-4';
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-rich-gold/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-serif font-bold text-deep-purple">
          Arma tu Pack Visual
        </h2>
        
        {/* User Stats */}
        <div className="flex items-center gap-4">
          {userStats.badges.includes('mixologo') && (
            <div className="px-3 py-1 bg-rich-gold text-deep-black rounded-full text-xs font-bold">
              🏆 Mixólogo
            </div>
          )}
          <div className="text-sm text-deep-purple/70">
            <span className="font-bold text-rich-gold">{userStats.points}</span> puntos
          </div>
        </div>
      </div>

      {/* Pack Size Selector */}
      <div className="mb-6">
        <div className="flex gap-3">
          {[6, 12, 24].map(size => (
            <button
              key={size}
              onClick={() => setPackSize(size as 6 | 12 | 24)}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                packSize === size
                  ? 'bg-rich-gold text-deep-black shadow-lg'
                  : 'bg-rich-gold/10 text-deep-purple hover:bg-rich-gold/20'
              }`}
            >
              Pack {size}
            </button>
          ))}
        </div>
        
        {/* Discount Info */}
        <div className="mt-4 p-4 bg-rich-gold/5 rounded-lg border border-rich-gold/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-deep-purple/70">Descuentos por cantidad:</span>
            <div className="flex gap-4">
              <span className={filledSlots >= 6 ? 'text-deep-purple' : 'text-deep-purple/40'}>
                6-11: Regular
              </span>
              <span className={filledSlots >= 12 ? 'text-rich-gold font-bold' : 'text-deep-purple/40'}>
                12-23: 10% OFF
              </span>
              <span className={filledSlots >= 24 ? 'text-rich-gold font-bold' : 'text-deep-purple/40'}>
                24+: 15% OFF + Envío GRATIS
              </span>
            </div>
          </div>
          {isEarlyBird && (
            <div className="mt-2 text-sm text-rich-gold font-bold">
              🐦 Early Bird Bonus: +5% OFF (Ordena antes de las 12pm)
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Available Cocktails */}
        <div>
          <h3 className="text-xl font-bold text-deep-purple mb-4">
            Arrastra los Sabores
          </h3>
          <div className="space-y-2">
            {COCKTAILS.map(cocktail => {
              const tried = userStats.flavorsTried.has(cocktail.id);
              return (
                <motion.div
                  key={cocktail.id}
                  draggable
                  onDragStart={() => handleDragStart(cocktail.id)}
                  className={`p-3 rounded-lg border-2 cursor-move transition-all ${
                    tried
                      ? 'border-rich-gold bg-rich-gold/10'
                      : 'border-gray-200 hover:border-rich-gold/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileDrag={{ scale: 1.1, opacity: 0.8 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-12 rounded-t-sm rounded-b-xs flex-shrink-0"
                      style={{ backgroundColor: cocktail.color }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-sm"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-deep-purple">{cocktail.name}</div>
                      <div className="text-xs text-deep-purple/60">
                        ${cocktail.price} MXN
                      </div>
                    </div>
                    {tried && <span className="text-xs">✓</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Shake Button */}
          <button
            onClick={handleShake}
            disabled={filledSlots === 0}
            className={`w-full mt-4 px-4 py-3 rounded-lg font-bold transition-all ${
              filledSlots > 0
                ? 'bg-rich-gold text-deep-black hover:bg-rich-gold/80'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isShaking ? '🎲 Mezclando...' : '🎲 Agitar para Aleatorizar'}
          </button>
        </div>

        {/* CENTER: Pack Container */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-deep-purple">
              Tu Pack ({filledSlots}/{packSize})
            </h3>
            {isMinimumReached && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 bg-rich-gold text-deep-black rounded-full text-sm font-bold"
              >
                ✨ Mínimo Alcanzado
              </motion.div>
            )}
          </div>

          {/* Pack Crate Visual */}
          <motion.div
            animate={isShaking ? { x: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
            className={`relative bg-gradient-to-br from-amber-900/20 to-amber-800/30 rounded-xl p-6 border-4 border-amber-800/50 ${
              isMinimumReached ? 'ring-4 ring-rich-gold ring-opacity-50' : ''
            }`}
          >
            {/* Crate Texture */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)`,
            }}></div>
            
            {/* Slots Grid */}
            <div className={`grid ${getPackContainerClass()} gap-3 relative z-10`}>
              {slots.map((slot, index) => {
                const cocktail = slot.cocktailId ? COCKTAILS.find(c => c.id === slot.cocktailId) : null;
                return (
                  <motion.div
                    key={slot.id}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(slot.id)}
                    className={`aspect-[3/4] rounded-lg border-2 border-dashed transition-all ${
                      slot.cocktailId
                        ? 'border-rich-gold bg-rich-gold/10'
                        : 'border-gray-300 bg-gray-100/50 hover:border-rich-gold/50'
                    } ${draggedCocktail ? 'border-rich-gold border-solid' : ''}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {cocktail ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="w-12 h-16 rounded-t-sm rounded-b-xs relative"
                          style={{ backgroundColor: cocktail.color }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-sm"></div>
                          <div className="absolute top-2 left-1 right-1 bottom-1 flex items-center justify-center">
                            <span className="text-[6px] font-bold text-deep-black">POPIT</span>
                          </div>
                        </motion.div>
                        <button
                          onClick={() => handleRemove(slot.id)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        {index + 1}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Pack Summary */}
          <div className="mt-6 p-4 bg-rich-gold/5 rounded-lg border border-rich-gold/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-deep-purple font-bold">Subtotal</span>
              <span className="text-deep-purple">
                ${slots.filter(s => s.cocktailId).reduce((sum, s) => {
                  const cocktail = COCKTAILS.find(c => c.id === s.cocktailId);
                  return sum + (cocktail?.price || 0);
                }, 0).toLocaleString('es-MX')}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-deep-purple/70">Descuento ({Math.round(discount * 100)}%)</span>
                <span className="text-rich-gold font-bold">
                  -${Math.round(slots.filter(s => s.cocktailId).reduce((sum, s) => {
                    const cocktail = COCKTAILS.find(c => c.id === s.cocktailId);
                    return sum + (cocktail?.price || 0);
                  }, 0) * discount).toLocaleString('es-MX')}
                </span>
              </div>
            )}
            {earlyBirdDiscount > 0 && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-deep-purple/70">Early Bird (5%)</span>
                <span className="text-rich-gold font-bold">
                  -${Math.round(slots.filter(s => s.cocktailId).reduce((sum, s) => {
                    const cocktail = COCKTAILS.find(c => c.id === s.cocktailId);
                    return sum + (cocktail?.price || 0);
                  }, 0) * earlyBirdDiscount).toLocaleString('es-MX')}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-rich-gold/20">
              <span className="text-xl font-bold text-deep-purple">Total</span>
              <span className="text-2xl font-bold text-rich-gold">
                ${calculateTotal().toLocaleString('es-MX')} MXN
              </span>
            </div>
            {filledSlots >= 24 && (
              <div className="mt-2 text-sm text-rich-gold font-bold">
                🎉 ¡Envío GRATIS incluido!
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!isMinimumReached}
              className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
                isMinimumReached
                  ? 'bg-rich-gold text-deep-black hover:bg-rich-gold/80 shadow-lg hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Agregar al Carrito
            </button>
            <button
              onClick={handleSavePack}
              disabled={!isMinimumReached}
              className="px-6 py-3 bg-rich-gold/10 text-rich-gold font-bold rounded-lg hover:bg-rich-gold/20 transition-colors"
            >
              💾 Guardar Pack
            </button>
            <button
              onClick={handleShare}
              disabled={!isMinimumReached}
              className="px-6 py-3 bg-rich-gold/10 text-rich-gold font-bold rounded-lg hover:bg-rich-gold/20 transition-colors"
            >
              📤 Compartir
            </button>
          </div>
        </div>
      </div>

      {/* Pack of the Month */}
      <div className="mt-8 p-6 bg-gradient-to-r from-rich-gold/20 to-copper/20 rounded-xl border-2 border-rich-gold/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-deep-purple mb-1">
              🌟 Pack del Mes: {PACK_OF_THE_MONTH.name}
            </h3>
            <p className="text-deep-purple/70">{PACK_OF_THE_MONTH.description}</p>
          </div>
          <button
            onClick={handleAddPackOfMonth}
            className="px-6 py-3 bg-rich-gold text-deep-black font-bold rounded-lg hover:bg-rich-gold/80 transition-colors"
          >
            Usar este Pack
          </button>
        </div>
      </div>

      {/* Saved Packs */}
      {savedPacks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-deep-purple mb-4">
            Mis Packs Favoritos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {savedPacks.map(pack => (
              <div
                key={pack.id}
                className="p-4 bg-rich-gold/5 rounded-lg border border-rich-gold/20 hover:border-rich-gold transition-colors cursor-pointer"
                onClick={() => handleLoadPack(pack)}
              >
                <div className="font-bold text-deep-purple mb-2">{pack.name}</div>
                <div className="text-sm text-deep-purple/60">
                  {pack.slots.length} latas • {new Date(pack.createdAt).toLocaleDateString('es-MX')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-8 text-center max-w-md"
            >
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-3xl font-bold text-deep-purple mb-2">
                ¡Badge Desbloqueado!
              </h3>
              <p className="text-lg text-deep-purple/70 mb-6">
                Has probado todos los sabores. ¡Eres un verdadero Mixólogo!
              </p>
              <button
                onClick={() => setShowCelebration(false)}
                className="px-6 py-3 bg-rich-gold text-deep-black font-bold rounded-lg"
              >
                ¡Genial!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

