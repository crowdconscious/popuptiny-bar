'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navigation from '../components/sections/Navigation';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import { useCart } from '../context/CartContext';
import PaymentButtons from '../components/mobile/PaymentButtons';
import { hapticFeedback } from '../utils/haptics';

interface DeliveryInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryDate: string;
  instructions: string;
  isGift: boolean;
  giftMessage: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card', name: 'Tarjeta de Crédito/Débito', icon: '💳' },
  { id: 'oxxo', name: 'OXXO Pay', icon: '🏪' },
  { id: 'transfer', name: 'Transferencia Bancaria', icon: '🏦' },
  { id: 'paypal', name: 'PayPal', icon: '🅿️' },
  { id: 'whatsapp', name: 'Ordenar por WhatsApp', icon: '💬' },
];

const COCKTAILS_DATA: Record<string, { name: string; color: string }> = {
  margarita: { name: 'Margarita Clásica', color: '#f7e7ce' },
  mojito: { name: 'Mojito Premium', color: '#a8e6cf' },
  'old-fashioned': { name: 'Old Fashioned', color: '#d4af37' },
  paloma: { name: 'Paloma Mexicana', color: '#ffd3b6' },
  'mojito-jamaica': { name: 'Mojito de Jamaica', color: '#c44569' },
  'mezcal-sunrise': { name: 'Mezcal Sunrise', color: '#ffaaa5' },
  tropical: { name: 'Agua Fresca Tropical', color: '#ffeaa7' },
  'virgin-mojito': { name: 'Virgin Mojito de Fresa', color: '#fd79a8' },
  lavanda: { name: 'Limonada de Lavanda', color: '#a29bfe' },
};

export default function CarritoPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, totalCans, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [shippingOption, setShippingOption] = useState<'same-day' | 'standard'>('same-day');
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'CDMX',
    postalCode: '',
    deliveryDate: '',
    instructions: '',
    isGift: false,
    giftMessage: '',
  });
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');

  // Redirect if cart is empty
  useEffect(() => {
    if (totalCans === 0 && currentStep === 1) {
      router.push('/productos');
    }
  }, [totalCans, router, currentStep]);

  // Load customization
  const [customization, setCustomization] = useState<any>(null);
  useEffect(() => {
    const saved = localStorage.getItem('popit-customization');
    if (saved) {
      try {
        setCustomization(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading customization', e);
      }
    }
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const customizationCost = customization && customization.labelType !== 'default' ? (() => {
    const cansToCustomize = customization.applyTo === 'all' 
      ? totalCans 
      : cart.find(item => item.id === customization.applyTo)?.quantity || 0;
    if (customization.labelType === 'custom-text' || customization.labelType === 'template') {
      return cansToCustomize * 20;
    } else if (customization.labelType === 'logo') {
      return cansToCustomize * 30;
    }
    return 0;
  })() : 0;
  
  const shippingCost = shippingOption === 'same-day' 
    ? (totalCans >= 24 ? 0 : 99)
    : (totalCans >= 24 ? 0 : 150);
  
  const discountAmount = discountApplied && discountCode.toLowerCase() === 'popiteverywhere' 
    ? Math.round(subtotal * 0.1)
    : 0;
  
  const total = subtotal + customizationCost + shippingCost - discountAmount;

  const handleApplyDiscount = () => {
    if (discountCode.toLowerCase() === 'popiteverywhere') {
      setDiscountApplied(true);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && totalCans < 6) {
      alert('Mínimo 6 latas requeridas');
      return;
    }
    if (currentStep === 2) {
      // Validate delivery info
      if (!deliveryInfo.name || !deliveryInfo.email || !deliveryInfo.phone || !deliveryInfo.address) {
        alert('Por favor completa todos los campos requeridos');
        return;
      }
    }
    if (currentStep === 3 && !selectedPayment) {
      alert('Por favor selecciona un método de pago');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePlaceOrder = () => {
    if (selectedPayment === 'whatsapp') {
      const message = `¡Hola! Quiero hacer mi pedido:\n\n${cart.map(item => `• ${item.name}: ${item.quantity} latas`).join('\n')}\n\n${customization ? '✅ Personalización incluida\n' : ''}Total: $${total.toLocaleString('es-MX')} MXN\n\nDatos de entrega:\n${deliveryInfo.name}\n${deliveryInfo.address}\n${deliveryInfo.phone}`;
      window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5215512345678'}?text=${encodeURIComponent(message)}`, '_blank');
    }
    
    // Generate order number
    const orderNum = `POPIT-${Date.now().toString().slice(-8)}`;
    setOrderNumber(orderNum);
    
    // Save order to localStorage
    localStorage.setItem('popit-last-order', JSON.stringify({
      orderNumber: orderNum,
      cart,
      customization,
      deliveryInfo,
      total,
      date: new Date().toISOString(),
    }));
    
    // Clear cart
    clearCart();
    localStorage.removeItem('popit-customization');
    
    setCurrentStep(4);
  };

  const progressPercentage = (currentStep / 4) * 100;

  if (totalCans === 0 && currentStep === 1) {
    return null;
  }

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-background pt-32">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Progress Bar - Cans Filling Up */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-deep-purple">
                Paso {currentStep} de 4
              </span>
              <span className="text-sm text-deep-purple/70">
                {Math.round(progressPercentage)}% completado
              </span>
            </div>
            
            {/* Can Progress Bar */}
            <div className="relative h-16 bg-gray-200 rounded-full overflow-hidden border-2 border-rich-gold/30">
              {/* Filled Cans */}
              <motion.div
                className="absolute inset-0 flex items-center gap-1 px-2"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              >
                {Array.from({ length: Math.floor((progressPercentage / 100) * 20) }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.05, type: 'spring' }}
                    className="w-6 h-10 rounded-t-sm rounded-b-xs bg-rich-gold flex-shrink-0"
                    style={{
                      backgroundColor: cart[i % cart.length] 
                        ? COCKTAILS_DATA[cart[i % cart.length].id]?.color || '#d4af37'
                        : '#d4af37',
                    }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-sm"></div>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Step Labels */}
              <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                <div className={`text-xs font-bold ${currentStep >= 1 ? 'text-rich-gold' : 'text-deep-purple/40'}`}>
                  Revisar
                </div>
                <div className={`text-xs font-bold ${currentStep >= 2 ? 'text-rich-gold' : 'text-deep-purple/40'}`}>
                  Entrega
                </div>
                <div className={`text-xs font-bold ${currentStep >= 3 ? 'text-rich-gold' : 'text-deep-purple/40'}`}>
                  Pago
                </div>
                <div className={`text-xs font-bold ${currentStep >= 4 ? 'text-rich-gold' : 'text-deep-purple/40'}`}>
                  Confirmar
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Review Order */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-xl border-2 border-rich-gold/20"
            >
              <h2 className="text-3xl font-serif font-bold text-deep-purple mb-6">
                Revisa tu Pedido
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => {
                  const cocktailData = COCKTAILS_DATA[item.id];
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-rich-gold/5 rounded-lg border border-rich-gold/20"
                    >
                      {/* Can Preview */}
                      <div
                        className="w-12 h-16 rounded-t-sm rounded-b-xs flex-shrink-0"
                        style={{ backgroundColor: cocktailData?.color || '#d4af37' }}
                      >
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-sm"></div>
                      </div>

                      {/* Item Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-deep-purple">{item.name}</h3>
                        <p className="text-sm text-deep-purple/60">
                          ${item.price.toLocaleString('es-MX')} MXN por lata
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full bg-rich-gold/20 text-rich-gold font-bold hover:bg-rich-gold hover:text-white transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-bold text-deep-purple">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full bg-rich-gold text-white font-bold hover:bg-rich-gold/80 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="font-bold text-deep-purple min-w-[100px] text-right">
                        ${(item.quantity * item.price).toLocaleString('es-MX')}
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Personalization Info */}
              {customization && customization.labelType !== 'default' && (
                <div className="mb-6 p-4 bg-rich-gold/10 rounded-lg border border-rich-gold/30">
                  <h3 className="font-bold text-deep-purple mb-2">✨ Personalización Incluida</h3>
                  <p className="text-sm text-deep-purple/70">
                    Tipo: {customization.labelType === 'custom-text' ? 'Texto Personalizado' :
                           customization.labelType === 'logo' ? 'Logo/Design' : 'Plantilla'}
                  </p>
                  {customization.line1 && (
                    <p className="text-sm text-deep-purple/70">
                      Texto: {customization.line1} {customization.line2 && `- ${customization.line2}`}
                    </p>
                  )}
                </div>
              )}

              {/* Discount Code */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-deep-purple mb-2">
                  Código de Descuento
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Ej: Popiteverywhere"
                    className="flex-1 px-4 py-2 border-2 border-rich-gold/30 rounded-lg focus:border-rich-gold focus:outline-none"
                  />
                  <button
                    onClick={handleApplyDiscount}
                    disabled={discountApplied}
                    className={`px-6 py-2 rounded-lg font-bold transition-colors ${
                      discountApplied
                        ? 'bg-rich-gold/20 text-rich-gold cursor-not-allowed'
                        : 'bg-rich-gold text-deep-black hover:bg-rich-gold/80'
                    }`}
                  >
                    {discountApplied ? '✓ Aplicado' : 'Aplicar'}
                  </button>
                </div>
                {discountApplied && (
                  <p className="text-sm text-rich-gold mt-2 font-bold">
                    ¡10% de descuento aplicado!
                  </p>
                )}
              </div>

              {/* Shipping Options */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-deep-purple mb-3">Opciones de Envío</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-rich-gold transition-colors"
                    style={{ borderColor: shippingOption === 'same-day' ? '#d4af37' : '#e5e7eb' }}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value="same-day"
                      checked={shippingOption === 'same-day'}
                      onChange={(e) => setShippingOption(e.target.value as 'same-day' | 'standard')}
                      className="w-5 h-5 text-rich-gold focus:ring-rich-gold"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-deep-purple">CDMX: Entrega el mismo día</div>
                      <div className="text-sm text-deep-purple/60">
                        {totalCans >= 24 ? 'GRATIS' : '$99 MXN'} • Ordena antes de las 2pm
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-rich-gold transition-colors"
                    style={{ borderColor: shippingOption === 'standard' ? '#d4af37' : '#e5e7eb' }}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={shippingOption === 'standard'}
                      onChange={(e) => setShippingOption(e.target.value as 'same-day' | 'standard')}
                      className="w-5 h-5 text-rich-gold focus:ring-rich-gold"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-deep-purple">Envío Estándar</div>
                      <div className="text-sm text-deep-purple/60">
                        {totalCans >= 24 ? 'GRATIS' : '$150 MXN'} • 2-3 días hábiles
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-rich-gold/20 pt-4 space-y-2">
                <div className="flex justify-between text-deep-purple">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString('es-MX')}</span>
                </div>
                {customizationCost > 0 && (
                  <div className="flex justify-between text-deep-purple">
                    <span>Personalización</span>
                    <span>${customizationCost.toLocaleString('es-MX')}</span>
                  </div>
                )}
                <div className="flex justify-between text-deep-purple">
                  <span>Envío</span>
                  <span className={shippingCost === 0 ? 'text-rich-gold font-bold' : ''}>
                    {shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toLocaleString('es-MX')}`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-rich-gold font-bold">
                    <span>Descuento</span>
                    <span>-${discountAmount.toLocaleString('es-MX')}</span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-bold text-rich-gold pt-2 border-t border-rich-gold/20">
                  <span>Total</span>
                  <span>${total.toLocaleString('es-MX')} MXN</span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => router.push('/productos')}
                  className="flex-1 px-6 py-3 border-2 border-rich-gold text-rich-gold font-bold rounded-lg hover:bg-rich-gold hover:text-deep-black transition-colors"
                >
                  Seguir Comprando
                </button>
                <motion.button
                  onClick={() => {
                    hapticFeedback.medium();
                    handleNext();
                  }}
                  disabled={totalCans < 6}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
                    totalCans >= 6
                      ? 'bg-rich-gold text-deep-black hover:bg-rich-gold/80 shadow-lg hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continuar
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Delivery Information */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-xl border-2 border-rich-gold/20"
            >
              <h2 className="text-3xl font-serif font-bold text-deep-purple mb-6">
                Información de Entrega
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-deep-purple mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.name}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border-2 border-rich-gold/30 rounded-lg focus:border-rich-gold focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-deep-purple mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={deliveryInfo.email}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 border-2 border-rich-gold/30 rounded-lg focus:border-rich-gold focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-deep-purple mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={deliveryInfo.phone}
                    onChange={(e) => setDeliveryInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-rich-gold/30 rounded-lg focus:border-rich-gold focus:outline-none"
                    placeholder="+52 55 1234 5678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-deep-purple mb-2">
                    Dirección de Entrega *
                  </label>
                  <input
                    type="text"
                    value={deliveryInfo.address}
                    onChange={(e) => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-rich-gold/30 rounded-lg focus:border-rich-gold focus:outline-none"
                    placeholder="Calle, número, colonia"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-deep-purple mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.city}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-2 border-2 border-rich-gold/30 rounded-lg focus:border-rich-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-deep-purple mb-2">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.postalCode}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                      className="w-full px-4 py-2 border-2 border-rich-gold/30 rounded-lg focus:border-rich-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-deep-purple mb-2">
                    Fecha Preferida de Entrega
                  </label>
                  <input
                    type="date"
                    value={deliveryInfo.deliveryDate}
                    onChange={(e) => setDeliveryInfo(prev => ({ ...prev, deliveryDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border-2 border-rich-gold/30 rounded-lg focus:border-rich-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-deep-purple mb-2">
                    Instrucciones Especiales
                  </label>
                  <textarea
                    value={deliveryInfo.instructions}
                    onChange={(e) => setDeliveryInfo(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-rich-gold/30 rounded-lg focus:border-rich-gold focus:outline-none"
                    rows={3}
                    placeholder="Ej: Llamar antes de llegar, dejar en recepción..."
                  />
                </div>

                <div className="p-4 bg-rich-gold/5 rounded-lg border border-rich-gold/20">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deliveryInfo.isGift}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, isGift: e.target.checked }))}
                      className="w-5 h-5 rounded text-rich-gold focus:ring-rich-gold"
                    />
                    <span className="font-bold text-deep-purple">¿Es un regalo?</span>
                  </label>
                  
                  {deliveryInfo.isGift && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4"
                    >
                      <label className="block text-sm font-bold text-deep-purple mb-2">
                        Mensaje para el Regalo
                      </label>
                      <textarea
                        value={deliveryInfo.giftMessage}
                        onChange={(e) => setDeliveryInfo(prev => ({ ...prev, giftMessage: e.target.value }))}
                        className="w-full px-4 py-2 border-2 border-rich-gold/30 rounded-lg focus:border-rich-gold focus:outline-none"
                        rows={3}
                        placeholder="Escribe un mensaje especial..."
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 border-2 border-rich-gold text-rich-gold font-bold rounded-lg hover:bg-rich-gold hover:text-deep-black transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-rich-gold text-deep-black font-bold rounded-lg hover:bg-rich-gold/80 shadow-lg hover:scale-105 transition-all"
                >
                  Continuar al Pago
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-xl border-2 border-rich-gold/20"
            >
              <h2 className="text-3xl font-serif font-bold text-deep-purple mb-6">
                Método de Pago
              </h2>

              {/* Mobile Payment Buttons (Apple Pay / Google Pay) */}
              <div className="mb-6 lg:hidden">
                <PaymentButtons
                  onApplePay={() => {
                    hapticFeedback.success();
                    setSelectedPayment('apple-pay');
                    // Handle Apple Pay
                  }}
                  onGooglePay={() => {
                    hapticFeedback.success();
                    setSelectedPayment('google-pay');
                    // Handle Google Pay
                  }}
                  amount={total}
                />
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-rich-gold/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-deep-purple/60">O elige otro método</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPayment === method.id
                        ? 'border-rich-gold bg-rich-gold/10'
                        : 'border-gray-200 hover:border-rich-gold/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="w-5 h-5 text-rich-gold focus:ring-rich-gold"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <span className="flex-1 font-bold text-deep-purple">{method.name}</span>
                  </label>
                ))}
              </div>

              {/* Payment Form Placeholder */}
              {selectedPayment === 'card' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-rich-gold/5 rounded-lg border border-rich-gold/20 mb-6"
                >
                  <p className="text-sm text-deep-purple/70">
                    Integración con Stripe próximamente. Por ahora, usa "Ordenar por WhatsApp" para completar tu pedido.
                  </p>
                </motion.div>
              )}

              <div className="border-t border-rich-gold/20 pt-4 mb-6">
                <div className="flex justify-between text-2xl font-bold text-rich-gold">
                  <span>Total a Pagar</span>
                  <span>${total.toLocaleString('es-MX')} MXN</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 border-2 border-rich-gold text-rich-gold font-bold rounded-lg hover:bg-rich-gold hover:text-deep-black transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={!selectedPayment}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
                    selectedPayment
                      ? 'bg-rich-gold text-deep-black hover:bg-rich-gold/80 shadow-lg hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedPayment === 'whatsapp' ? 'Ordenar por WhatsApp' : 'Realizar Pago'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 shadow-xl border-2 border-rich-gold/20 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              
              <h2 className="text-3xl font-serif font-bold text-deep-purple mb-4">
                ¡Pedido Confirmado!
              </h2>
              
              <div className="mb-6 p-6 bg-rich-gold/10 rounded-lg border border-rich-gold/30">
                <p className="text-lg font-bold text-deep-purple mb-2">
                  Número de Orden
                </p>
                <p className="text-3xl font-bold text-rich-gold font-mono">
                  {orderNumber}
                </p>
              </div>

              <div className="space-y-4 mb-6 text-left">
                <div>
                  <p className="text-sm text-deep-purple/60">Estimado de Entrega</p>
                  <p className="font-bold text-deep-purple">
                    {shippingOption === 'same-day' ? 'Hoy (mismo día)' : '2-3 días hábiles'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-deep-purple/60">Total Pagado</p>
                  <p className="font-bold text-deep-purple text-xl">
                    ${total.toLocaleString('es-MX')} MXN
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5215512345678'}?text=${encodeURIComponent(`Hola, tengo una pregunta sobre mi pedido ${orderNumber}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-rich-gold text-deep-black font-bold rounded-lg hover:bg-rich-gold/80 transition-colors"
                >
                  💬 Rastrear Pedido por WhatsApp
                </a>
              </div>

              <div className="border-t border-rich-gold/20 pt-6 mb-6">
                <p className="text-sm font-bold text-deep-purple mb-4">
                  Comparte tu pedido y obtén 10% OFF en tu próximo pedido
                </p>
                <div className="flex gap-4 justify-center">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Facebook
                  </button>
                  <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                    Instagram
                  </button>
                  <button className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">
                    Twitter
                  </button>
                </div>
                <p className="text-xs text-deep-purple/60 mt-4">
                  Código de descuento: <span className="font-bold text-rich-gold">SHARE10</span>
                </p>
              </div>

              <button
                onClick={() => router.push('/productos')}
                className="w-full px-6 py-3 bg-rich-gold text-deep-black font-bold rounded-lg hover:bg-rich-gold/80 transition-colors"
              >
                Hacer Otro Pedido
              </button>
            </motion.div>
          )}
        </div>
      </main>

      <WhatsAppButton />
    </>
  );
}

