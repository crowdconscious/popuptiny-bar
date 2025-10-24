# 🍸 Popup Tiny Bar

Premium mobile cocktail bar service in Mexico featuring custom-branded canned craft cocktails for high-end events.

## ✨ Features

- 🎨 **Interactive Can Customizer** - Upload logos and customize labels
- 💰 **Smart Quote Calculator** - AI-powered pricing for events
- 📱 **Mobile-Optimized** - Beautiful responsive design
- 🌐 **Bilingual** - Spanish/English content for premium market
- 🎭 **3D Animations** - Framer Motion powered interactions
- 🥫 **Transparent PET Cans** - Eco-friendly, customizable packaging

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Database:** Supabase
- **Language:** TypeScript
- **Fonts:** Inter & Playfair Display

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your environment variables to .env.local:
# NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# NEXT_PUBLIC_WHATSAPP_NUMBER=5215512345678
```

### Development

```bash
# Run development server
npm run dev

# Access at http://localhost:3000
```

## 🗂️ Project Structure

```
popup-tiny-bar/
├── app/
│   ├── components/
│   │   ├── sections/      # Hero, Navigation, Services
│   │   ├── interactive/   # Quote Calculator, Can Customizer
│   │   └── ui/           # WhatsApp Button, etc.
│   ├── cocteles/         # Cocktail menu page
│   ├── galeria/          # Event gallery
│   ├── nosotros/         # About us
│   └── admin/            # Admin dashboard
├── lib/
│   ├── supabase.ts       # Supabase client
│   └── pricing-calculator.ts  # Quote logic
└── public/
    ├── can.png           # Can image for customizer
    └── Logo*.png         # Brand assets
```

## 🎨 Key Components

### Can Customizer
Interactive label designer with logo upload and real-time preview

### Quote Calculator
6-step wizard for event quotes:
1. Event type selection
2. Guest count
3. Cocktail style
4. Service level
5. Extras & add-ons
6. Final quote with WhatsApp CTA

### Pricing Logic
Industry-standard pricing with:
- Base costs by event type
- Per-person rates
- Volume discounts (10-30%)
- Premium add-ons
- Service level multipliers

## 🌐 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/popup-tiny-bar)

### Environment Variables

Required for production:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

## 📊 Database Setup

Run the Supabase schema:

```bash
# See supabase-schema.sql for database setup
```

Tables:
- `quotes` - Customer quote requests
- `bookings` - Confirmed events
- `customers` - Client information
- `cocktails` - Menu items
- `events` - Completed events
- `custom_cans` - Label designs

## 🎯 Features Roadmap

- [x] Homepage with hero section
- [x] Quote calculator
- [x] Can customizer
- [x] WhatsApp integration
- [ ] Email notifications
- [ ] Instagram feed integration
- [ ] Online payments (Stripe)
- [ ] Customer dashboard
- [ ] Admin analytics

## 📱 Mobile Testing

Access on mobile devices via:
```
http://[your-local-ip]:3000
```

## 🤝 Contributing

This is a private project for Popup Tiny Bar.

## 📄 License

All rights reserved - Popup Tiny Bar © 2024

---

Built with ❤️ for unforgettable events in Mexico 🇲🇽
