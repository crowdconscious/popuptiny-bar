import { Metadata } from 'next';
import Navigation from '../components/sections/Navigation';
import WhatsAppButton from '../components/ui/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Galería | Popup Tiny Bar - Eventos Realizados',
  description: 'Explora nuestra galería de eventos: bodas, fiestas corporativas y celebraciones únicas con nuestro bar móvil premium.',
};

export default function GaleriaPage() {
  // Placeholder data - will be replaced with Supabase data
  const events = [
    {
      id: 1,
      title: 'Boda Ana & Carlos',
      type: 'wedding',
      date: '2024-06-15',
      guests: 120,
      image: '/Logo1.png', // Placeholder
      testimonial: 'Increíble servicio, nuestros invitados no paraban de hablar de los cocktails!',
    },
    {
      id: 2,
      title: 'Evento Corporativo Tech Summit',
      type: 'corporate',
      date: '2024-05-20',
      guests: 200,
      image: '/logo2.png',
      testimonial: 'Profesionales y creativos. Superaron nuestras expectativas.',
    },
    // Add more placeholder events
  ];

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-background pt-24">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-coral/10 to-electric-purple/10">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-deep-purple mb-6">
              Galería de Eventos
            </h1>
            <p className="text-xl text-deep-purple/70 max-w-2xl mx-auto">
              Cada evento es único. Mira cómo hemos transformado celebraciones en experiencias inolvidables.
            </p>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-coral/20 to-electric-purple/20 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">
                        {event.type === 'wedding' ? '💍' : event.type === 'corporate' ? '🏢' : '🎉'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-serif font-bold text-deep-purple mb-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-deep-purple/60 mb-4">
                      <span>📅 {event.date}</span>
                      <span>👥 {event.guests} personas</span>
                    </div>
                    <p className="text-deep-purple/70 italic mb-4">
                      "{event.testimonial}"
                    </p>
                    <button className="text-coral font-bold hover:text-electric-purple transition-colors">
                      Ver más →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coming Soon Note */}
            <div className="mt-16 text-center bg-mint/10 rounded-3xl p-12">
              <h3 className="text-3xl font-serif font-bold text-deep-purple mb-4">
                Más Eventos Próximamente
              </h3>
              <p className="text-deep-purple/70 mb-6">
                Estamos actualizando nuestra galería con fotos profesionales de eventos recientes.
              </p>
              <a
                href="https://www.instagram.com/popuptinybar/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-electric-purple text-white font-bold rounded-full hover:bg-electric-purple/90 transition-colors"
              >
                📸 Síguenos en Instagram
              </a>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppButton />
    </>
  );
}

