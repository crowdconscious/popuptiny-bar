'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/sections/Navigation';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  playfulDescription: string;
  technicalDescription: string;
  category: 'classic' | 'signature' | 'mocktail';
  abv: number;
  price: number;
  color: string;
  flavorProfile: string[];
  isBestseller: boolean;
  isFlavorOfMonth: boolean;
  ingredients: string[];
  calories?: number;
  sugar?: number;
}

const PRODUCTS: Product[] = [
  {
    id: 'margarita',
    name: 'Margarita Clásica',
    playfulDescription: 'El que nunca falla. Como tu ex, pero mejor.',
    technicalDescription: 'Tequila blanco, triple sec, jugo de limón fresco, sal de mar',
    category: 'classic',
    abv: 15,
    price: 95,
    color: '#f7e7ce',
    flavorProfile: ['sour', 'fresh'],
    isBestseller: true,
    isFlavorOfMonth: false,
    ingredients: ['Tequila blanco', 'Triple sec', 'Limón', 'Sal de mar'],
    calories: 180,
    sugar: 8,
  },
  {
    id: 'mojito',
    name: 'Mojito Premium',
    playfulDescription: 'Frescura que revive el alma. Y el espíritu.',
    technicalDescription: 'Ron blanco, menta fresca, lima, azúcar de caña, agua mineral',
    category: 'classic',
    abv: 12,
    price: 95,
    color: '#a8e6cf',
    flavorProfile: ['fresh', 'sweet'],
    isBestseller: true,
    isFlavorOfMonth: false,
    ingredients: ['Ron blanco', 'Menta fresca', 'Lima', 'Azúcar orgánica'],
    calories: 165,
    sugar: 12,
  },
  {
    id: 'old-fashioned',
    name: 'Old Fashioned',
    playfulDescription: 'Para cuando quieres sentirte sofisticado. Y lo logras.',
    technicalDescription: 'Whiskey, azúcar, bitters de angostura, naranja',
    category: 'classic',
    abv: 18,
    price: 110,
    color: '#d4af37',
    flavorProfile: ['bitter', 'strong'],
    isBestseller: false,
    isFlavorOfMonth: false,
    ingredients: ['Whiskey', 'Azúcar', 'Bitters', 'Naranja'],
    calories: 195,
    sugar: 5,
  },
  {
    id: 'paloma',
    name: 'Paloma Mexicana',
    playfulDescription: 'Mexicano hasta la médula. Y hasta la última gota.',
    technicalDescription: 'Tequila reposado, Jarritos de toronja, limón, sal con chile',
    category: 'signature',
    abv: 14,
    price: 100,
    color: '#ffd3b6',
    flavorProfile: ['sour', 'fresh'],
    isBestseller: false,
    isFlavorOfMonth: true,
    ingredients: ['Tequila reposado', 'Jarritos toronja', 'Limón', 'Chile piquín'],
    calories: 175,
    sugar: 10,
  },
  {
    id: 'mezcalita-jamaica',
    name: 'Mezcalita de Jamaica',
    playfulDescription: 'Mezcal con actitud. Y jamaica con personalidad.',
    technicalDescription: 'Mezcal artesanal, té de flor de jamaica, menta, limón',
    category: 'signature',
    abv: 13,
    price: 100,
    color: '#c44569',
    flavorProfile: ['sour', 'fresh'],
    isBestseller: false,
    isFlavorOfMonth: false,
    ingredients: ['Mezcal', 'Jamaica', 'Menta', 'Limón'],
    calories: 170,
    sugar: 7,
  },
  {
    id: 'mezcal-sunrise',
    name: 'Mezcal Sunrise',
    playfulDescription: 'Amanece que no es poco. Y sabe mejor.',
    technicalDescription: 'Mezcal artesanal, jugo de naranja, granadina, chile',
    category: 'signature',
    abv: 16,
    price: 115,
    color: '#ffaaa5',
    flavorProfile: ['sweet', 'fresh'],
    isBestseller: false,
    isFlavorOfMonth: false,
    ingredients: ['Mezcal', 'Naranja natural', 'Granadina', 'Chile morita'],
    calories: 185,
    sugar: 15,
  },
  {
    id: 'st-germain',
    name: 'St. Germain Spritz',
    playfulDescription: 'Elegante sin esfuerzo. Como debería ser todo.',
    technicalDescription: 'St. Germain, prosecco, soda, limón',
    category: 'signature',
    abv: 11,
    price: 110,
    color: '#ffeaa7',
    flavorProfile: ['sweet', 'fresh'],
    isBestseller: false,
    isFlavorOfMonth: false,
    ingredients: ['St. Germain', 'Prosecco', 'Soda', 'Limón'],
    calories: 150,
    sugar: 12,
  },
  {
    id: 'tropical',
    name: 'Agua Fresca Tropical',
    playfulDescription: 'Para cuando quieres fiesta sin resaca. La mejor decisión.',
    technicalDescription: 'Piña, mango, limón, menta, agua mineral',
    category: 'mocktail',
    abv: 0,
    price: 75,
    color: '#ffeaa7',
    flavorProfile: ['sweet', 'fresh'],
    isBestseller: false,
    isFlavorOfMonth: false,
    ingredients: ['Piña', 'Mango', 'Limón', 'Menta', 'Agua mineral'],
    calories: 120,
    sugar: 18,
  },
  {
    id: 'virgin-mojito',
    name: 'Virgin Mojito de Fresa',
    playfulDescription: 'Todo el sabor, cero el drama. Perfecto.',
    technicalDescription: 'Fresas frescas, menta, lima, jarabe de agave, soda',
    category: 'mocktail',
    abv: 0,
    price: 75,
    color: '#fd79a8',
    flavorProfile: ['sweet', 'fresh'],
    isBestseller: false,
    isFlavorOfMonth: false,
    ingredients: ['Fresas', 'Menta', 'Lima', 'Agave', 'Soda'],
    calories: 95,
    sugar: 14,
  },
  {
    id: 'lavanda',
    name: 'Limonada de Lavanda',
    playfulDescription: 'Relajante como un spa. Pero más divertido.',
    technicalDescription: 'Limones frescos, jarabe de lavanda, agua con gas',
    category: 'mocktail',
    abv: 0,
    price: 75,
    color: '#a29bfe',
    flavorProfile: ['sour', 'fresh'],
    isBestseller: false,
    isFlavorOfMonth: false,
    ingredients: ['Limón', 'Lavanda', 'Agave', 'Agua con gas'],
    calories: 85,
    sugar: 10,
  },
];

const REVIEWS = [
  {
    id: 1,
    name: 'Ana G.',
    rating: 5,
    text: '¡Increíble! Los mejores cocktails en lata que he probado. La Margarita es perfecta.',
    product: 'Margarita Clásica',
    date: 'Hace 2 días',
  },
  {
    id: 2,
    name: 'Carlos M.',
    rating: 5,
    text: 'El Mojito Premium es mi favorito. Fresco, delicioso y llega perfecto.',
    product: 'Mojito Premium',
    date: 'Hace 5 días',
  },
  {
    id: 3,
    name: 'María L.',
    rating: 5,
    text: 'Pedí el Pack Fiesta para mi cumpleaños y fue un éxito total. Todos amaron los sabores.',
    product: 'Pack Fiesta',
    date: 'Hace 1 semana',
  },
  {
    id: 4,
    name: 'Roberto S.',
    rating: 5,
    text: 'La Paloma Mexicana es increíble. Sabor auténtico y entrega súper rápida.',
    product: 'Paloma Mexicana',
    date: 'Hace 3 días',
  },
  {
    id: 5,
    name: 'Sofia R.',
    rating: 5,
    text: 'Los mocktails son deliciosos. Perfectos para cuando no quiero alcohol pero sí sabor.',
    product: 'Agua Fresca Tropical',
    date: 'Hace 1 semana',
  },
];

type Filter = 'all' | 'alcoholic' | 'non-alcoholic' | 'favorites';

const FLAVOR_ICONS: Record<string, string> = {
  sweet: '🍯',
  sour: '🍋',
  fresh: '🌿',
  bitter: '☕',
  strong: '💪',
};

export default function CoctelesPage() {
  const { addToCart } = useCart();
  const [filter, setFilter] = useState<Filter>('all');
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const filteredProducts = PRODUCTS.filter(product => {
    if (filter === 'alcoholic') return product.abv > 0;
    if (filter === 'non-alcoholic') return product.abv === 0;
    if (filter === 'favorites') return product.isBestseller;
    return true;
  });

  const flavorOfMonth = PRODUCTS.find(p => p.isFlavorOfMonth);

  const handleAddSix = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 6,
    });
  };

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-background pt-32">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-rich-gold/10 via-background to-copper/10">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-deep-purple mb-6">
              Nuestros Popits
            </h1>
            <p className="text-xl text-deep-purple/70 max-w-2xl mx-auto mb-8">
              Cocteles premium en lata. Frescos, deliciosos y listos para disfrutar.
            </p>
          </div>
        </section>

        {/* Flavor of the Month Spotlight */}
        {flavorOfMonth && (
          <section className="py-12 px-6 bg-gradient-to-r from-rich-gold/20 via-copper/20 to-rich-gold/20 border-y-2 border-rich-gold/30">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-2xl">🌟</span>
                <h2 className="text-2xl font-serif font-bold text-deep-purple">
                  Sabor del Mes
                </h2>
                <span className="text-2xl">🌟</span>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-rich-gold/50">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <motion.div
                    className="relative w-24 h-36 flex-shrink-0"
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <div
                      className="w-full h-full rounded-t-lg rounded-b-sm"
                      style={{ backgroundColor: flavorOfMonth.color }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg"></div>
                      <div className="absolute top-4 left-2 right-2 bottom-2 flex items-center justify-center">
                        <span className="text-xs font-bold text-deep-black">POPIT</span>
                      </div>
                    </div>
                  </motion.div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-serif font-bold text-deep-purple mb-2">
                      {flavorOfMonth.name}
                    </h3>
                    <p className="text-lg text-deep-purple/70 mb-4 italic">
                      {flavorOfMonth.playfulDescription}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                      <span className="text-2xl font-bold text-rich-gold">
                        ${flavorOfMonth.price}
                      </span>
                      <span className="text-deep-purple/60">/lata</span>
                      <span className="px-3 py-1 bg-rich-gold/20 text-rich-gold font-bold rounded-full text-sm">
                        -15% OFF este mes
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddSix(flavorOfMonth)}
                      className="px-6 py-3 bg-rich-gold text-deep-black font-bold rounded-full hover:bg-rich-gold/80 transition-colors"
                    >
                      Agregar 6 Latas
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filter Pills */}
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              {(['all', 'alcoholic', 'non-alcoholic', 'favorites'] as Filter[]).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-6 py-3 rounded-full font-bold transition-all ${
                    filter === filterOption
                      ? 'bg-rich-gold text-deep-black shadow-lg scale-105'
                      : 'bg-white text-deep-purple border-2 border-rich-gold/30 hover:border-rich-gold'
                  }`}
                >
                  {filterOption === 'all' && 'Todos'}
                  {filterOption === 'alcoholic' && 'Con Alcohol'}
                  {filterOption === 'non-alcoholic' && 'Sin Alcohol'}
                  {filterOption === 'favorites' && 'Los Favoritos'}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                const isFlipped = flippedCard === product.id;
                
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group"
                  >
                    <div
                      className="relative h-[500px] perspective-1000"
                      onMouseEnter={() => setFlippedCard(product.id)}
                      onMouseLeave={() => setFlippedCard(null)}
                    >
                      {/* Card Front */}
                      <motion.div
                        className="absolute inset-0 bg-white rounded-2xl p-6 shadow-lg border-2 border-rich-gold/20 cursor-pointer backface-hidden"
                        animate={{
                          rotateY: isFlipped ? 180 : 0,
                          opacity: isFlipped ? 0 : 1,
                        }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Can Animation */}
                        <div className="relative h-48 flex items-center justify-center mb-4">
                          <motion.div
                            className="relative w-20 h-32"
                            animate={{
                              rotateY: [0, 15, -15, 0],
                              rotateX: [0, 5, -5, 0],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          >
                            <div
                              className="w-full h-full rounded-t-lg rounded-b-sm shadow-lg"
                              style={{ backgroundColor: product.color }}
                            >
                              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg"></div>
                              <div className="absolute top-3 left-2 right-2 bottom-2 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-deep-black">POPIT</span>
                              </div>
                            </div>
                          </motion.div>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          {product.isBestseller && (
                            <span className="px-3 py-1 bg-rich-gold text-deep-black text-xs font-bold rounded-full">
                              ⭐ Bestseller
                            </span>
                          )}
                          {product.isFlavorOfMonth && (
                            <span className="px-3 py-1 bg-copper text-white text-xs font-bold rounded-full">
                              🌟 Sabor del Mes
                            </span>
                          )}
                        </div>

                        {/* Product Info */}
                        <div>
                          <h3 className="text-2xl font-serif font-bold text-deep-purple mb-2">
                            {product.name}
                          </h3>
                          <p className="text-deep-purple/70 mb-4 italic text-sm">
                            {product.playfulDescription}
                          </p>

                          {/* Flavor Profile */}
                          <div className="flex gap-2 mb-4">
                            {product.flavorProfile.map((flavor) => (
                              <span
                                key={flavor}
                                className="px-2 py-1 bg-rich-gold/10 text-rich-gold text-xs font-bold rounded"
                                title={flavor}
                              >
                                {FLAVOR_ICONS[flavor]} {flavor}
                              </span>
                            ))}
                          </div>

                          {/* ABV Badge */}
                          {product.abv > 0 && (
                            <div className="mb-4">
                              <span className="px-3 py-1 bg-rich-gold/20 text-rich-gold text-sm font-bold rounded">
                                {product.abv}% ABV
                              </span>
                            </div>
                          )}

                          {/* Price and Quick Add */}
                          <div className="flex items-center justify-between mt-6">
                            <div>
                              <div className="text-2xl font-bold text-rich-gold">
                                ${product.price}
                              </div>
                              <div className="text-xs text-deep-purple/60">por lata</div>
                            </div>
                            <button
                              onClick={() => handleAddSix(product)}
                              className="px-4 py-2 bg-rich-gold text-deep-black font-bold rounded-full hover:bg-rich-gold/80 transition-colors text-sm"
                            >
                              +6
                            </button>
                          </div>
                        </div>
                      </motion.div>

                      {/* Card Back (Nutrition Info) */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-rich-gold/10 to-copper/10 rounded-2xl p-6 shadow-lg border-2 border-rich-gold/20 cursor-pointer backface-hidden"
                        animate={{
                          rotateY: isFlipped ? 0 : -180,
                          opacity: isFlipped ? 1 : 0,
                        }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: 'preserve-3d', transform: 'rotateY(180deg)' }}
                      >
                        <div className="h-full flex flex-col justify-between">
                          <div>
                            <h3 className="text-2xl font-serif font-bold text-deep-purple mb-4">
                              {product.name}
                            </h3>
                            
                            {/* Technical Description */}
                            <p className="text-deep-purple/80 mb-6 text-sm">
                              {product.technicalDescription}
                            </p>

                            {/* Ingredients */}
                            <div className="mb-6">
                              <h4 className="text-sm font-bold text-deep-purple mb-2">
                                Ingredientes:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {product.ingredients.map((ingredient, i) => (
                                  <span
                                    key={i}
                                    className="text-xs px-2 py-1 bg-white/50 text-deep-purple rounded"
                                  >
                                    {ingredient}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Nutrition Info */}
                            <div className="space-y-2">
                              {product.calories && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-deep-purple/70">Calorías</span>
                                  <span className="font-bold text-deep-purple">{product.calories}</span>
                                </div>
                              )}
                              {product.sugar && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-deep-purple/70">Azúcar</span>
                                  <span className="font-bold text-deep-purple">{product.sugar}g</span>
                                </div>
                              )}
                              {product.abv > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-deep-purple/70">Alcohol</span>
                                  <span className="font-bold text-deep-purple">{product.abv}%</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddSix(product)}
                            className="w-full px-4 py-3 bg-rich-gold text-deep-black font-bold rounded-full hover:bg-rich-gold/80 transition-colors"
                          >
                            Agregar 6 Latas
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Reviews Carousel */}
        <section className="py-20 px-6 bg-gradient-to-br from-rich-gold/5 to-copper/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-deep-purple text-center mb-12">
              Lo que dicen nuestros Popiters
            </h2>
            
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: [0, -1200],
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                {/* Duplicate reviews for seamless loop */}
                {[...REVIEWS, ...REVIEWS].map((review, index) => (
                  <motion.div
                    key={`${review.id}-${index}`}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 shadow-lg border border-rich-gold/20"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-full bg-rich-gold/20 flex items-center justify-center font-bold text-rich-gold">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-deep-purple">{review.name}</div>
                        <div className="text-xs text-deep-purple/60">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-rich-gold">⭐</span>
                      ))}
                    </div>
                    <p className="text-deep-purple/80 mb-2 text-sm">{review.text}</p>
                    <div className="text-xs text-deep-purple/60 italic">
                      - {review.product}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-deep-purple mb-6">
              ¿Listo para probar Popit?
            </h2>
            <p className="text-xl text-deep-purple/70 mb-8">
              Arma tu pack personalizado y recibe cocteles premium en lata directamente en tu puerta.
            </p>
            <Link
              href="/productos"
              className="inline-block px-10 py-5 bg-rich-gold text-deep-black font-bold text-xl rounded-full hover:bg-rich-gold/80 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Arma tu Pack
            </Link>
          </div>
        </section>
      </main>

      <WhatsAppButton />
    </>
  );
}
