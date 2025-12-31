'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useEffect, useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const { totalCans } = useCart();
  const [shouldBounce, setShouldBounce] = useState(false);

  useEffect(() => {
    if (totalCans > 0) {
      setShouldBounce(true);
      const timer = setTimeout(() => setShouldBounce(false), 600);
      return () => clearTimeout(timer);
    }
  }, [totalCans]);

  const navItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Productos', href: '/productos', icon: '🍹' },
    { 
      name: 'Carrito', 
      href: '/carrito', 
      icon: '🛒',
      badge: totalCans > 0 ? totalCans : null,
    },
    { name: 'Cuenta', href: '/cuenta', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-deep-purple border-t border-rich-gold/20 shadow-2xl">
      <div className="flex items-center justify-around h-16 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === '/productos' && pathname?.startsWith('/productos')) ||
            (item.href === '/' && pathname === '/');
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              <motion.div
                animate={shouldBounce && item.name === 'Carrito' ? {
                  scale: [1, 1.3, 1],
                  rotate: [0, -10, 10, -10, 0],
                } : {}}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <span className="text-2xl">{item.icon}</span>
                {item.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-rich-gold text-deep-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </motion.span>
                )}
              </motion.div>
              <span className={`text-xs mt-1 ${isActive ? 'text-rich-gold font-bold' : 'text-champagne/60'}`}>
                {item.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-rich-gold rounded-b-full"
                  initial={false}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

