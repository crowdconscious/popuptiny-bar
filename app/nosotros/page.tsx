import { Metadata } from 'next';
import Navigation from '../components/sections/Navigation';
import WhatsAppButton from '../components/ui/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Nosotros | Popup Tiny Bar - Nuestra Historia',
  description: 'Conoce la historia detrás de Popup Tiny Bar, el bar móvil premium que está revolucionando los eventos en México.',
};

export default function NosotrosPage() {
  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-background pt-32">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-coral/10 via-background to-mint/10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-deep-purple mb-6">
              Nuestra Historia
            </h1>
            <p className="text-2xl text-deep-purple/80">
              Cocktails de autor en lata, llevando experiencias únicas a cada celebración
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg mx-auto">
              <h2 className="text-4xl font-serif font-bold text-deep-purple mb-6">
                ¿Cómo nació Popup Tiny Bar?
              </h2>
              <p className="text-lg text-deep-purple/80 leading-relaxed mb-6">
                Todo comenzó con una pregunta simple: <strong>¿Por qué los eventos especiales no pueden tener cocktails tan buenos como los de un bar premium?</strong>
              </p>
              <p className="text-lg text-deep-purple/80 leading-relaxed mb-6">
                Cansados de ver bodas y eventos corporativos con barra libre genérica, decidimos crear algo diferente. Combinamos la experiencia de un bar de autor con la flexibilidad de un servicio móvil, y agregamos un toque único: <strong>cocktails artesanales en latas transparentes personalizadas.</strong>
              </p>
              <p className="text-lg text-deep-purple/80 leading-relaxed mb-6">
                Cada lata es preparada en el momento, sellada con tapa de aluminio, y lista para disfrutar. Pero más que eso, se convierte en un <strong>recuerdo único</strong> de tu evento especial.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-6 bg-electric-purple/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-deep-purple text-center mb-12">
              Nuestros Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 text-center">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-2xl font-bold text-deep-purple mb-3">Creatividad</h3>
                <p className="text-deep-purple/70">
                  Cada cocktail es una obra de arte. Experimentamos con sabores, técnicas y presentaciones para sorprender.
                </p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 text-center">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="text-2xl font-bold text-deep-purple mb-3">Sostenibilidad</h3>
                <p className="text-deep-purple/70">
                  Latas de PET reciclables, ingredientes locales y orgánicos, cero desperdicio.
                </p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 text-center">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-deep-purple mb-3">Excelencia</h3>
                <p className="text-deep-purple/70">
                  No hay atajos en calidad. Ingredientes premium, bartenders profesionales, servicio impecable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-deep-purple text-center mb-12">
              ¿Qué nos hace diferentes?
            </h2>
            
            <div className="space-y-6">
              <div className="bg-coral/10 border-l-4 border-coral rounded-r-3xl p-6">
                <h3 className="text-xl font-bold text-deep-purple mb-2">
                  🥫 Latas Transparentes Personalizadas
                </h3>
                <p className="text-deep-purple/80">
                  A diferencia de los bares móviles tradicionales, cada invitado se lleva un recuerdo único: su cocktail en una lata con el diseño de tu evento.
                </p>
              </div>

              <div className="bg-mint/10 border-l-4 border-mint rounded-r-3xl p-6">
                <h3 className="text-xl font-bold text-deep-purple mb-2">
                  👨‍🍳 Bartenders Certificados
                </h3>
                <p className="text-deep-purple/80">
                  Nuestro equipo no solo sabe hacer cocktails, son artistas de la mixología que crean experiencias memorables.
                </p>
              </div>

              <div className="bg-electric-purple/10 border-l-4 border-electric-purple rounded-r-3xl p-6">
                <h3 className="text-xl font-bold text-deep-purple mb-2">
                  🌶️ Sabores Mexicanos Auténticos
                </h3>
                <p className="text-deep-purple/80">
                  Trabajamos con productores locales para traer los mejores ingredientes mexicanos a cada copa.
                </p>
              </div>

              <div className="bg-coral/10 border-l-4 border-coral rounded-r-3xl p-6">
                <h3 className="text-xl font-bold text-deep-purple mb-2">
                  💻 Tecnología y Transparencia
                </h3>
                <p className="text-deep-purple/80">
                  Cotizador en línea, diseño 3D de latas, comunicación directa. Todo digital, todo transparente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Promise */}
        <section className="py-20 px-6 bg-deep-purple text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Nuestra Promesa
            </h2>
            <p className="text-2xl leading-relaxed mb-8 text-white/90">
              "Transformar cada evento en una experiencia inolvidable, donde cada cocktail cuenta una historia y cada invitado se va con un recuerdo único."
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <span>✓ Sabor excepcional</span>
              <span>✓ Servicio profesional</span>
              <span>✓ Experiencia única</span>
              <span>✓ Recuerdos inolvidables</span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold text-deep-purple mb-6">
              ¿Listo para conocernos?
            </h2>
            <p className="text-xl text-deep-purple/70 mb-8">
              Agenda una degustación gratuita y descubre por qué nuestros clientes nos recomiendan una y otra vez.
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5215512345678'}?text=${encodeURIComponent('¡Hola! Me gustaría agendar una degustación gratuita')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-5 bg-mint text-white font-bold text-xl rounded-full hover:bg-mint/90 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              💬 ¡Probemos juntos!
            </a>
          </div>
        </section>
      </main>

      <WhatsAppButton />
    </>
  );
}

