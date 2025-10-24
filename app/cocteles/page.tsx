import { Metadata } from 'next';
import Navigation from '../components/sections/Navigation';
import WhatsAppButton from '../components/ui/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Menú de Cocktails | Popup Tiny Bar',
  description: 'Explora nuestro menú de cocktails artesanales: clásicos reimaginados, recetas de autor mexicanas y mocktails premium.',
};

export default function CoctelesPage() {
  const cocktailCategories = [
    {
      id: 'classic',
      name: 'Clásicos Reimaginados',
      emoji: '🍸',
      description: 'Cocktails icónicos con nuestro twist único',
      cocktails: [
        {
          name: 'Margarita Clásica',
          description: 'Tequila blanco, triple sec, jugo de limón fresco, sal de mar',
          ingredients: ['Tequila blanco', 'Triple sec', 'Limón', 'Sal de mar'],
          abv: 15,
        },
        {
          name: 'Mojito Premium',
          description: 'Ron blanco, menta fresca, lima, azúcar de caña, agua mineral',
          ingredients: ['Ron blanco', 'Menta fresca', 'Lima', 'Azúcar orgánica'],
          abv: 12,
        },
        {
          name: 'Old Fashioned',
          description: 'Whiskey, azúcar, bitters de angostura, naranja',
          ingredients: ['Whiskey', 'Azúcar', 'Bitters', 'Naranja'],
          abv: 18,
        },
      ],
    },
    {
      id: 'signature',
      name: 'Autor Mexicano',
      emoji: '🌶️',
      description: 'Recetas únicas con ingredientes locales',
      cocktails: [
        {
          name: 'Paloma Mexicana',
          description: 'Tequila reposado, Jarritos de toronja, limón, sal con chile',
          ingredients: ['Tequila reposado', 'Jarritos toronja', 'Limón', 'Chile piquín'],
          abv: 14,
        },
        {
          name: 'Mojito de Jamaica',
          description: 'Ron blanco, té de flor de jamaica, menta, limón',
          ingredients: ['Ron blanco', 'Jamaica', 'Menta', 'Limón'],
          abv: 13,
        },
        {
          name: 'Mezcal Sunrise',
          description: 'Mezcal artesanal, jugo de naranja, granadina, chile',
          ingredients: ['Mezcal', 'Naranja natural', 'Granadina', 'Chile morita'],
          abv: 16,
        },
      ],
    },
    {
      id: 'mocktail',
      name: 'Mocktails Premium',
      emoji: '🍹',
      description: 'Opciones sin alcohol igual de sofisticadas',
      cocktails: [
        {
          name: 'Agua Fresca Tropical',
          description: 'Piña, mango, limón, menta, agua mineral',
          ingredients: ['Piña', 'Mango', 'Limón', 'Menta', 'Agua mineral'],
          abv: 0,
        },
        {
          name: 'Virgin Mojito de Fresa',
          description: 'Fresas frescas, menta, lima, jarabe de agave, soda',
          ingredients: ['Fresas', 'Menta', 'Lima', 'Agave', 'Soda'],
          abv: 0,
        },
        {
          name: 'Limonada de Lavanda',
          description: 'Limones frescos, jarabe de lavanda, agua con gas',
          ingredients: ['Limón', 'Lavanda', 'Agave', 'Agua con gas'],
          abv: 0,
        },
      ],
    },
  ];

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-background pt-24">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-mint/10 via-background to-coral/10">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-deep-purple mb-6">
              Nuestro Menú
            </h1>
            <p className="text-xl text-deep-purple/70 max-w-2xl mx-auto mb-8">
              Cocktails artesanales preparados con ingredientes premium y mucho amor
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-6 py-2 bg-mint/20 text-mint font-bold rounded-full">
                🌱 Ingredientes Naturales
              </span>
              <span className="px-6 py-2 bg-coral/20 text-coral font-bold rounded-full">
                🎨 Recetas Personalizables
              </span>
              <span className="px-6 py-2 bg-electric-purple/20 text-electric-purple font-bold rounded-full">
                ✨ Barra Libre Ilimitada
              </span>
            </div>
          </div>
        </section>

        {/* Cocktail Categories */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto space-y-20">
            {cocktailCategories.map((category) => (
              <div key={category.id}>
                <div className="text-center mb-12">
                  <div className="text-6xl mb-4">{category.emoji}</div>
                  <h2 className="text-4xl font-serif font-bold text-deep-purple mb-3">
                    {category.name}
                  </h2>
                  <p className="text-lg text-deep-purple/70">
                    {category.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {category.cocktails.map((cocktail, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                    >
                      <h3 className="text-2xl font-serif font-bold text-deep-purple mb-3">
                        {cocktail.name}
                      </h3>
                      <p className="text-deep-purple/70 mb-4">
                        {cocktail.description}
                      </p>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-deep-purple/60 mb-2">
                          INGREDIENTES:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {cocktail.ingredients.map((ingredient, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1 bg-mint/10 text-mint rounded-full"
                            >
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>

                      {cocktail.abv > 0 && (
                        <div className="text-sm text-deep-purple/60">
                          <strong>ABV:</strong> {cocktail.abv}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Cocktails CTA */}
        <section className="py-20 px-6 bg-gradient-to-br from-electric-purple/10 to-coral/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-deep-purple mb-6">
              ¿No ves tu cocktail favorito?
            </h2>
            <p className="text-xl text-deep-purple/70 mb-8">
              Podemos crear cualquier receta que imagines. Nuestros bartenders son expertos en mixología y están listos para sorprenderte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#cotizador"
                className="px-8 py-4 bg-coral text-white font-bold text-lg rounded-full hover:bg-coral/90 transition-colors shadow-xl"
              >
                Personalizar Menú
              </a>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5215512345678'}?text=${encodeURIComponent('¡Hola! Me gustaría crear un menú personalizado de cocktails')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-deep-purple text-deep-purple font-bold rounded-full hover:bg-deep-purple hover:text-white transition-colors"
              >
                💬 Hablar con un Mixólogo
              </a>
            </div>
          </div>
        </section>

        {/* Note about fresh preparation */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto bg-mint/10 border-2 border-mint rounded-3xl p-8">
            <h3 className="text-2xl font-serif font-bold text-deep-purple mb-4 text-center">
              ✨ Frescura Garantizada
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-deep-purple/80">
              <div>
                <strong className="text-deep-purple">🍋 Ingredientes Frescos:</strong> Jugos naturales exprimidos al momento, frutas frescas y hierbas de temporada.
              </div>
              <div>
                <strong className="text-deep-purple">🥫 Sellado al Momento:</strong> Cada lata se prepara y sella justo antes de servir o entregar.
              </div>
              <div>
                <strong className="text-deep-purple">🌱 PET Reciclable:</strong> Latas transparentes donde puedes ver tu cocktail y reciclar después.
              </div>
              <div>
                <strong className="text-deep-purple">🔒 Tapa de Aluminio:</strong> Sellado hermético para máxima frescura.
              </div>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppButton />
    </>
  );
}

