'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StickyAddToCartProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
  onQuantityChange: (delta: number) => void;
}

export default function StickyAddToCart({ product, quantity, onQuantityChange }: StickyAddToCartProps) {
  const { addToCart, totalCans } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
    });
    
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const totalPrice = product.price * quantity;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-16 left-0 right-0 z-40 lg:hidden safe-area-inset-bottom"
        >
          <div className="bg-deep-purple border-t border-rich-gold/20 shadow-2xl px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-3 bg-midnight-navy/50 rounded-lg px-3 py-2">
                <button
                  onClick={() => onQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-full bg-rich-gold/20 text-rich-gold font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <span className="text-white font-bold min-w-[2rem] text-center">{quantity}</span>
                <button
                  onClick={() => onQuantityChange(1)}
                  className="w-8 h-8 rounded-full bg-rich-gold/20 text-rich-gold font-bold"
                >
                  +
                </button>
              </div>

              {/* Price and Add Button */}
              <div className="flex items-center gap-3 flex-1">
                <div className="text-right">
                  <div className="text-rich-gold font-bold text-lg">${totalPrice.toFixed(2)}</div>
                  <div className="text-champagne/60 text-xs">{quantity} {quantity === 1 ? 'lata' : 'latas'}</div>
                </div>
                <motion.button
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-lg font-bold flex-1 ${
                    justAdded
                      ? 'bg-green-500 text-white'
                      : 'bg-rich-gold text-deep-black'
                  } transition-colors`}
                >
                  {justAdded ? '✓ Agregado' : 'Agregar al Carrito'}
                </motion.button>
              </div>
            </div>
            
            {/* Cart Link */}
            {totalCans > 0 && (
              <Link
                href="/carrito"
                className="block mt-2 text-center text-rich-gold text-sm font-bold"
              >
                Ver carrito ({totalCans} {totalCans === 1 ? 'artículo' : 'artículos'})
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

