import Navigation from './components/sections/Navigation';
import Hero from './components/sections/Hero';
import ServiceSelector from './components/sections/ServiceSelector';
import QuoteCalculator from './components/interactive/QuoteCalculator';
import CanCustomizer3D from './components/interactive/CanCustomizer3D';
import WhatsAppButton from './components/ui/WhatsAppButton';

export default function Home() {
  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-background">
        <Hero />
        <ServiceSelector />
        <CanCustomizer3D />
        <QuoteCalculator />

        {/* Quick Stats Section */}
        <section className="py-20 px-6 bg-deep-purple text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
              <div className="animate-slide-up-fade">
                <div className="text-5xl font-bold text-coral mb-2">500+</div>
                <div className="text-white/80">Eventos realizados</div>
              </div>
              <div className="animate-slide-up-fade" style={{ animationDelay: '0.1s' }}>
                <div className="text-5xl font-bold text-electric-purple mb-2">50+</div>
                <div className="text-white/80">Recetas únicas</div>
              </div>
              <div className="animate-slide-up-fade" style={{ animationDelay: '0.2s' }}>
                <div className="text-5xl font-bold text-mint mb-2">10k+</div>
                <div className="text-white/80">Cocktails servidos</div>
              </div>
              <div className="animate-slide-up-fade" style={{ animationDelay: '0.3s' }}>
                <div className="text-5xl font-bold text-coral mb-2">100%</div>
                <div className="text-white/80">Satisfacción</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 bg-gradient-to-b from-coral/10 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-deep-purple mb-6">
              ¿Listo para crear algo único?
            </h2>
            <p className="text-xl text-deep-purple/70 mb-12">
              Agenda una degustación gratuita y descubre cómo podemos hacer de tu evento una experiencia inolvidable.
            </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5215512345678'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-mint text-white font-bold text-xl rounded-full hover:bg-mint/90 transition-all duration-300 hover:scale-105 shadow-xl"
          >
              <span>💬</span>
              ¡Probemos juntos!
            </a>
          </div>
        </section>
      </main>

      <WhatsAppButton />
    </>
  );
}
