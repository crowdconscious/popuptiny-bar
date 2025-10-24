🎯 PHASE 1: MVP Launch Strategy
Core Design Philosophy

Aesthetic: Neo-brutalist meets luxury - bold typography, vibrant gradients, unexpected animations
Colors: Based on your cans - coral pink, electric purple, mint green, with clean white space
Typography: Bold sans-serif (like your can design) mixed with elegant serifs for premium feel

Initial Tech Stack for Cursor
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS + Framer Motion
- 3D Elements: Three.js (for can customizer)
- Booking: Cal.com embedded or Calendly API
- Database: Supabase (for quotes/bookings)
- CMS: Sanity or Contentful (easy content updates)
- Payments: Stripe (for deposits)
📁 File Structure & Code Instructions
1. Hero Section with Kinetic Typography
jsx// components/Hero.jsx
// Instructions for Cursor:
// Create an animated hero where "Popup", "Tiny", "Bar" appear sequentially
// Add floating 3D cans that rotate on scroll
// Implement a "liquid fill" animation for CTA buttons
// Use Lottie animations for background elements
Key Features:

Typewriter effect revealing tagline: "Cócteles de autor. En lata. En tu evento."
Parallax scrolling cans
Magnetic cursor effect on CTAs

2. Interactive Service Selector
jsx// components/ServiceSelector.jsx
// Create a card-based selector with:
// - Hover effects that "pop" like opening a can
// - Sound effects (optional fizz sound)
// - Progressive disclosure of options
Three Main Paths:

"Quiero un bar móvil" → Event configurator
"Necesito cocteles personalizados" → Can designer
"Explorar paquetes" → Pre-built packages

3. The Can Customizer (Hero Feature)
jsx// components/CanCustomizer.jsx
// Build a real-time 3D can preview using Three.js
// Features:
// - Rotate can with mouse/touch
// - Live label editing
// - Color picker for can base
// - Pattern/texture library
// - Logo upload with AI background removal
4. Smart Quote Calculator
jsx// components/QuoteWizard.jsx
// Multi-step form with personality:

const steps = [
  {
    id: 'event-vibe',
    title: '¿Cuál es la vibe?',
    options: ['Boda Elegante', 'Fiesta Corporativa', 'Cumpleaños Epic', 'Lanzamiento de Producto']
  },
  {
    id: 'guest-count',
    title: '¿Cuántos sedientos?',
    input: 'slider', // Visual slider 10-500+ guests
  },
  {
    id: 'cocktail-style',
    title: 'Elige tu arsenal',
    options: [
      { name: 'Clásicos Reimaginados', preview: true },
      { name: 'Autor Mexicano', preview: true },
      { name: 'Mocktails Increíbles', preview: true },
      { name: 'Créalo Conmigo', collaborative: true }
    ]
  },
  {
    id: 'service-level',
    title: 'Nivel de servicio',
    options: [
      'Self-Service Station',
      'Bartender Incluido',
      'Full Experience + Show'
    ]
  },
  {
    id: 'extras',
    title: '¿Algo más?',
    multiSelect: [
      'Cans de regalo para llevar',
      'Estación de garnish',
      'Menú impreso',
      'Fotógrafo del momento'
    ]
  }
];
5. Dynamic Availability Calendar
jsx// components/BookingCalendar.jsx
// Integrate with Google Calendar API or Cal.com
// Show real-time availability with:
// - Peak season pricing indicators
// - "Almost booked" urgency markers
// - Quick-reserve functionality (15-min hold)
6. Placeholder Content Strategy
Since you don't have photos yet, create:
jsx// components/PlaceholderGallery.jsx
// Use:
// 1. Animated illustrations (hire from Fiverr/99designs)
// 2. 3D renders of your setup (use Spline or Blender)
// 3. Typography-based designs showing cocktail names
// 4. Client testimonial cards (even if hypothetical initially)
// 5. Behind-the-scenes sketches/mockups
🎨 Unique Animation Ideas
Micro-interactions:
css/* Custom CSS animations to add */

.can-pop {
  /* Trigger on hover - can "pops" open with fizz particles */
}

.liquid-fill {
  /* Buttons fill with liquid color on hover */
}

.shake-to-mix {
  /* Mobile: shake phone to randomize cocktail suggestion */
}

.carbonation-bubbles {
  /* Floating bubbles throughout the site */
}
Scroll-triggered Animations:

Can Assembly Line: Cans roll across screen as user scrolls
Ingredient Rain: Cocktail ingredients fall into frame
Number Counters: Animate stats (events served, cans produced)
Parallax Layers: Bar setup builds itself on scroll

💡 Innovative Features
1. "Mixology Match" Quiz
jsx// components/MixologyQuiz.jsx
// Tinder-style swiper for cocktail preferences
// Generates personalized menu recommendation
// Shareable results for social media
2. AR Can Preview
jsx// components/ARPreview.jsx
// Using WebAR (8th Wall or AR.js)
// Clients can see how cans look in their space
// Share AR experiences with guests pre-event
3. Live Availability Ticker
jsx// components/AvailabilityTicker.jsx
// Shows real-time bookings happening
// "María just booked Popup Tiny Bar for Dec 15"
// Creates FOMO and social proof
4. Cocktail Playlist Generator
jsx// components/PlaylistGenerator.jsx
// Based on selected cocktails, generate Spotify playlist
// "Your event's soundtrack, mixed perfectly"
📱 Mobile-First Features

Swipe through packages like Instagram stories
Pull-to-refresh quote calculator
Haptic feedback on selections
One-thumb navigation throughout

🚀 Launch Sequence
Week 1-2: Core Structure
bash# Terminal commands for Cursor
npx create-next-app@latest popup-tiny-bar --tailwind --app
npm install framer-motion @react-three/fiber @react-three/drei
npm install @supabase/supabase-js stripe @stripe/stripe-js
Week 3-4: Interactive Elements

Build can customizer
Implement quote calculator
Set up booking system

Week 5-6: Polish & Launch

Add animations
Mobile optimization
SEO setup
Analytics integration

🎯 Conversion Optimization
Smart CTAs:
jsxconst ctaVariations = {
  morning: "¿Café? Mejor un Espresso Martini",
  afternoon: "Tu tarde necesita burbujas",
  evening: "Es hora del cocktail",
  weekend: "Fin de semana = Popup Tiny Bar"
};
Exit Intent:
jsx// components/ExitIntent.jsx
// Detect exit intent and show:
// "¡Espera! 10% off si agendas una degustación"
// With can opening animation
📊 Analytics to Track

Can customizer engagement time
Quote calculator completion rate
Most selected cocktail combinations
Peak browsing times for retargeting

🔗 Key Integrations

WhatsApp Business API - Critical for Mexico
Instagram Shopping - Tag products in posts
Google My Business - Local SEO
Pixel de Facebook - Retargeting
Hotjar - Heatmaps to optimize

Content While You Build

Create "Coming Soon" campaign with can customizer preview
Launch Instagram with behind-the-scenes of building the bar
Partner with micro-influencers for launch events
Document your journey on TikTok/Reels