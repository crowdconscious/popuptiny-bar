'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Integrate with email service (Resend/SendGrid)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setEmail('');
    
    setTimeout(() => setSubmitted(false), 3000);
  };

  const valueProps = [
    { icon: '🚚', text: 'Envío gratis +24 latas' },
    { icon: '🎨', text: 'Personalización disponible' },
    { icon: '⚡', text: 'Hecho fresco, entrega rápida' },
    { icon: '📦', text: 'Empaque 100% reciclable' },
  ];

  const productosLinks = [
    { name: 'Todos los Popits', href: '/cocteles' },
    { name: 'Packs Especiales', href: '/productos#packs' },
    { name: 'Personalizar', href: '/personalizar' },
    { name: 'Regalos Corporativos', href: '/productos#corporativos' },
  ];

  const ayudaLinks = [
    { name: 'Cómo ordenar', href: '/ayuda/como-ordenar' },
    { name: 'Envíos y entregas', href: '/ayuda/envios' },
    { name: 'Cambios y devoluciones', href: '/ayuda/devoluciones' },
    { name: 'Preguntas frecuentes', href: '/ayuda/faq' },
  ];

  const empresaLinks = [
    { name: 'Nuestra historia', href: '/nosotros' },
    { name: 'Calidad Popit', href: '/nosotros#calidad' },
    { name: 'Sustentabilidad', href: '/nosotros#sustentabilidad' },
    { name: 'Contacto', href: '/contacto' },
  ];

  return (
    <footer className="bg-deep-purple text-white">
      {/* Value Props Top Section */}
      <section className="border-b border-rich-gold/20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valueProps.map((prop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 text-center md:text-left"
              >
                <span className="text-3xl flex-shrink-0">{prop.icon}</span>
                <span className="text-sm font-medium text-champagne">{prop.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Column 1: Productos */}
            <div>
              <h3 className="font-serif text-xl font-bold text-rich-gold mb-4">
                Productos
              </h3>
              <ul className="space-y-2">
                {productosLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-champagne/80 hover:text-rich-gold transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Ayuda */}
            <div>
              <h3 className="font-serif text-xl font-bold text-rich-gold mb-4">
                Ayuda
              </h3>
              <ul className="space-y-2">
                {ayudaLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-champagne/80 hover:text-rich-gold transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Empresa */}
            <div>
              <h3 className="font-serif text-xl font-bold text-rich-gold mb-4">
                Empresa
              </h3>
              <ul className="space-y-2">
                {empresaLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-champagne/80 hover:text-rich-gold transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h3 className="font-serif text-xl font-bold text-rich-gold mb-4">
                Newsletter
              </h3>
              <p className="text-champagne/80 text-sm mb-4">
                Recibe 10% en tu primera orden
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="flex-1 px-4 py-2 bg-midnight-navy/50 border border-rich-gold/30 rounded-lg text-white placeholder-champagne/50 focus:outline-none focus:border-rich-gold focus:ring-2 focus:ring-rich-gold/20 text-sm"
                  />
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || submitted}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-rich-gold text-deep-black font-bold rounded-lg hover:bg-rich-gold/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {submitted ? '✓' : isSubmitting ? '...' : '→'}
                  </motion.button>
                </div>
                {submitted && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-rich-gold text-xs"
                  >
                    ¡Bienvenido! Revisa tu email para tu código de descuento.
                  </motion.p>
                )}
              </form>

              {/* Social Media Links */}
              <div className="mt-6 flex gap-4">
                <a
                  href="https://instagram.com/popuptinybar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-midnight-navy/50 border border-rich-gold/30 flex items-center justify-center hover:bg-rich-gold hover:text-deep-black transition-all"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://facebook.com/popuptinybar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-midnight-navy/50 border border-rich-gold/30 flex items-center justify-center hover:bg-rich-gold hover:text-deep-black transition-all"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5215512345678'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-midnight-navy/50 border border-rich-gold/30 flex items-center justify-center hover:bg-rich-gold hover:text-deep-black transition-all"
                  aria-label="WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
                <a
                  href="https://tiktok.com/@popuptinybar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-midnight-navy/50 border border-rich-gold/30 flex items-center justify-center hover:bg-rich-gold hover:text-deep-black transition-all"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges & Bottom Bar */}
      <section className="border-t border-rich-gold/20 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            {/* Secure Checkout */}
            <div className="flex items-center gap-2 text-champagne/80 text-xs">
              <svg className="w-5 h-5 text-rich-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Pago seguro</span>
            </div>

            {/* Made in Mexico */}
            <div className="flex items-center gap-2 text-champagne/80 text-xs">
              <span className="text-xl">🇲🇽</span>
              <span>Hecho en México</span>
            </div>

            {/* Recycling */}
            <div className="flex items-center gap-2 text-champagne/80 text-xs">
              <svg className="w-5 h-5 text-rich-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>100% Reciclable</span>
            </div>

            {/* SSL */}
            <div className="flex items-center gap-2 text-champagne/80 text-xs">
              <svg className="w-5 h-5 text-rich-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>SSL Seguro</span>
            </div>
          </div>

          {/* Age Disclaimer & Copyright */}
          <div className="text-center space-y-2">
            <p className="text-champagne/60 text-xs">
              <span className="font-bold text-champagne">18+</span> Solo para mayores de edad. Bebe con responsabilidad.
            </p>
            <p className="text-champagne/60 text-xs">
              © {new Date().getFullYear()} Popup Tiny Bar. Todos los derechos reservados.
            </p>
            <div className="flex items-center justify-center gap-4 text-champagne/60 text-xs mt-4">
              <Link href="/legal/privacidad" className="hover:text-rich-gold transition-colors">
                Política de Privacidad
              </Link>
              <span>•</span>
              <Link href="/legal/terminos" className="hover:text-rich-gold transition-colors">
                Términos y Condiciones
              </Link>
              <span>•</span>
              <Link href="/legal/cookies" className="hover:text-rich-gold transition-colors">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}

