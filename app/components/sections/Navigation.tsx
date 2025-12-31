'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { totalCans, lastAddedItem } = useCart();
  const [shouldBounce, setShouldBounce] = useState(false);
  
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.85]);
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ['rgba(10, 10, 10, 0)', 'rgba(10, 10, 10, 0.98)']
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (lastAddedItem) {
      setShouldBounce(true);
      const timer = setTimeout(() => setShouldBounce(false), 600);
      return () => clearTimeout(timer);
    }
  }, [lastAddedItem]);

  const menuItems = [
    { name: 'Productos', href: '/productos' },
    { name: 'Personalizar', href: '/personalizar' },
    { name: 'Packs Especiales', href: '/productos#packs' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Mi Carrito', href: '/carrito', badge: totalCans },
  ];

  const menuVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const itemVariants = {
    closed: { x: 50, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  return (
    <>
      {/* Header Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-rich-gold text-deep-black text-center py-2 px-4 text-sm font-montserrat font-bold">
        🎉 Envío gratis en pedidos +24 latas 🎉
      </div>

      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'shadow-2xl backdrop-blur-xl border-b border-rich-gold/10' : ''
        }`}
        style={{ 
          backgroundColor: headerBg,
          top: '32px',
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a
              href="/"
              className="flex items-center gap-3"
              style={{ scale: logoScale }}
            >
              <div className="flex flex-col items-start">
                <span className="font-accent text-2xl md:text-3xl text-champagne tracking-[0.2em]">
                  POPUP
                </span>
                <span className="font-serif text-sm text-rich-gold italic -mt-1">
                  Tiny Bar
                </span>
              </div>
            </motion.a>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative font-montserrat text-sm text-champagne/80 hover:text-rich-gold uppercase tracking-wider transition-colors duration-300 group"
                >
                  {item.name}
                  {item.badge !== undefined && item.badge > 0 && (
                    <motion.span
                      animate={shouldBounce && item.name === 'Mi Carrito' ? {
                        scale: [1, 1.5, 1],
                        rotate: [0, -10, 10, -10, 0],
                      } : {}}
                      transition={{ duration: 0.5 }}
                      className="absolute -top-2 -right-4 bg-rich-gold text-deep-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-rich-gold group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Social Icons & Contact */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/popuptinybar/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-rich-gold/30 flex items-center justify-center text-rich-gold hover:bg-rich-gold hover:text-deep-black transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5215512345678'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 border border-rich-gold text-rich-gold hover:bg-rich-gold hover:text-deep-black font-montserrat text-sm uppercase tracking-wider transition-all duration-300"
              >
                Contacto
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-6 h-px bg-champagne group-hover:bg-rich-gold transition-colors duration-300"
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-px bg-champagne group-hover:bg-rich-gold transition-colors duration-300"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-6 h-px bg-champagne group-hover:bg-rich-gold transition-colors duration-300"
              />
            </button>
          </div>
        </nav>

        {/* Gold accent line */}
        {isScrolled && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="h-px bg-gradient-to-r from-transparent via-rich-gold/30 to-transparent"
          />
        )}
      </motion.header>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={menuVariants}
        className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-midnight-navy z-40 lg:hidden shadow-2xl"
      >
        <div className="flex flex-col h-full pt-32 px-8 pb-8">
          <nav className="flex-1 flex flex-col gap-6">
            {menuItems.map((item, i) => (
              <motion.div
                key={item.name}
                custom={i}
                variants={itemVariants}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block font-serif text-3xl text-champagne hover:text-rich-gold transition-colors duration-300 py-2 border-b border-rich-gold/10 hover:border-rich-gold/30 relative"
                >
                  {item.name}
                  {item.badge !== undefined && item.badge > 0 && (
                    <motion.span
                      animate={shouldBounce && item.name === 'Mi Carrito' ? {
                        scale: [1, 1.3, 1],
                        rotate: [0, -10, 10, -10, 0],
                      } : {}}
                      transition={{ duration: 0.5 }}
                      className="ml-3 inline-block bg-rich-gold text-deep-black text-sm font-bold rounded-full px-2 py-0.5"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="pt-8 border-t border-rich-gold/20">
            <div className="flex items-center gap-4 mb-6">
              <a
                href="https://www.instagram.com/popuptinybar/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border-2 border-rich-gold/30 flex items-center justify-center text-rich-gold hover:bg-rich-gold hover:text-deep-black transition-all duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5215512345678'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 text-center border-2 border-rich-gold text-rich-gold hover:bg-rich-gold hover:text-deep-black font-montserrat text-sm uppercase tracking-wider transition-all duration-300"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Close overlay on background click */}
        <div
          className="absolute inset-0 -z-10"
          onClick={() => setIsOpen(false)}
        />
      </motion.div>

      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-deep-black/80 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
}
