# 🍹 Popup Tiny Bar - Project Context

## Company Overview
**Name:** Popup Tiny Bar  
**Domain:** popuptinybar.com  
**Concept:** Premium mobile cocktail bar service offering canned craft cocktails for high-end events in Mexico  
**Unique Value:** Luxury cocktails in custom-branded cans with a mobile bar experience  

## Brand Identity
- **Colors:** 
  - Primary: Coral Pink (#FF6B6B)
  - Secondary: Electric Purple (#8B5CF6)
  - Accent: Mint Green (#10B981)
  - Base: Clean White (#FFFFFF)
  - Text: Deep Purple (#4C1D95)
- **Typography:** Bold sans-serif (like Inter or Bricolage Grotesque) for headers, elegant serif for premium touches
- **Voice:** Playful yet sophisticated, Mexican warmth with international quality
- **Visual Style:** Neo-brutalist meets luxury, vibrant gradients, unexpected animations

## Target Audience
- **Primary:** Couples planning weddings (25-40 years old, middle to upper class)
- **Secondary:** Corporate event planners, PR agencies
- **Tertiary:** Private party hosts (birthdays, anniversaries, launches)

## Core Services
1. **Mobile Bar Experience:** Full bar setup with professional bartender at events
2. **Custom Canned Cocktails:** Personalized labels and recipes
3. **Cocktail Delivery:** Pre-made canned cocktails for smaller gatherings
4. **Corporate Packages:** Team building, product launches, corporate gifts

## Website Objectives
1. Generate qualified leads for event bookings
2. Showcase the premium, innovative nature of the service
3. Enable easy customization and visualization of offerings
4. Streamline booking and quoting process
5. Build trust through social proof and professional presentation

## Key Features Required
- 3D Can Customizer (Three.js)
- Smart Quote Calculator with instant estimates
- Real-time Availability Calendar
- WhatsApp Business Integration
- Interactive Service Selector
- Mobile-first responsive design
- Animated interactions and scroll effects
- Multi-language support (Spanish primary, English secondary)

## Technical Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Custom CSS animations
- **Animations:** Framer Motion
- **3D:** Three.js with React Three Fiber
- **Database:** Supabase (already configured)
- **CMS:** Local JSON/MDX initially, then Sanity
- **Calendar:** Cal.com or custom with Google Calendar API
- **Analytics:** Google Analytics 4 + Hotjar
- **Forms:** React Hook Form + Zod validation
- **Payments:** Stripe (for deposits)
- **Email:** Resend or SendGrid
- **Hosting:** Vercel

## User Journeys

### Journey 1: Wedding Couple
1. Land on homepage → See hero with "Cocktails únicos para tu gran día"
2. Click "Bodas" → View wedding packages and gallery
3. Use Can Customizer → Design custom label with wedding date/names
4. Fill Quote Calculator → Get instant estimate
5. Check availability → Book consultation call
6. Receive proposal → Pay deposit
7. Event day → Service delivery

### Journey 2: Corporate Client
1. Land from LinkedIn ad → See corporate section
2. View case studies → Build trust
3. Use quick quote form → Get ballpark pricing
4. Schedule tasting → Experience the product
5. Customize package → Approve branding
6. Sign contract → Event execution

### Journey 3: Curious Browser
1. Discover on Instagram → Visit website
2. Play with Can Customizer → Get engaged
3. Subscribe to newsletter → Nurture sequence
4. Return for personal event → Convert

## Content Sections

### Homepage
- Hero with kinetic typography animation
- Service selector (3 cards with hover animations)
- How it works (4 steps with scroll animations)
- Social proof ticker
- Can customizer preview
- Instagram feed integration
- Footer with WhatsApp floating button

### Services Pages
- Bodas (Weddings)
- Eventos Corporativos (Corporate)
- Fiestas Privadas (Private Parties)
- Entrega a Domicilio (Delivery)

### Interactive Tools
- Can Customizer (3D experience)
- Quote Calculator (multi-step wizard)
- Cocktail Menu Builder
- Availability Checker

### About/Trust
- Our Story
- The Team
- Sustainability Promise
- Press & Recognition

### Resources
- Blog/Magazine
- Cocktail Recipes
- Event Planning Guide
- FAQ

## Unique Animations & Interactions

### Micro-interactions
- Can "pop" effect on hover (fizz particles)
- Liquid fill buttons
- Carbonation bubbles floating throughout
- Magnetic cursor on CTAs
- Shake-to-mix on mobile (randomize cocktail)

### Scroll Animations
- Cans rolling across screen
- Ingredient rain effect
- Bar setup building itself
- Number counters animating
- Parallax layers with depth

### Page Transitions
- Liquid morph between pages
- Can spinning loader
- Smooth fade with scale

## Copy Guidelines

### Spanish (Primary)
- Informal "tú" not "usted"
- Mexican slang when appropriate
- Warm, inviting tone
- Action-oriented CTAs

### Example CTAs:
- "Diseña tu lata" (Design your can)
- "Calcula tu evento" (Calculate your event)
- "¡Probemos juntos!" (Let's taste together!)
- "Agenda tu fecha" (Book your date)

## SEO Keywords
- Primary: "bar móvil cdmx", "cocktails en lata méxico", "bar para bodas"
- Secondary: "servicio de bar para eventos", "cocktails personalizados", "barra libre móvil"
- Long-tail: "renta de bar móvil para bodas cdmx", "cocktails artesanales en lata para eventos"

## Competitor Differentiation
- Unlike traditional bars: We're mobile and leave guests with keepsakes
- Unlike standard catering: We're an experience, not just a service
- Unlike other mobile bars: We offer branded cans as favors
- Unlike bottled cocktails: We're fresh, customizable, and sustainable

## Success Metrics
- Conversion rate: >3% from visitor to lead
- Quote calculator completion: >60%
- Can customizer engagement: >2 minutes average
- Booking rate: >20% from quote to booking
- Mobile engagement: >70% of traffic

## Integration Requirements
- WhatsApp Business API (critical for Mexico market)
- Instagram API for feed and shopping
- Google Calendar for availability
- Stripe for payment processing
- SendGrid/Resend for automated emails
- Supabase for all data storage

## Development Phases
1. **Phase 1 :** Core structure, homepage, basic navigation
2. **Phase 2 :** Can customizer, quote calculator
3. **Phase 3 :** Booking system, calendar integration
4. **Phase 4 :** Animations, polish, mobile optimization
5. **Phase 5 :** Testing, SEO, launch preparation

## Placeholder Content Strategy
While awaiting professional photos:
- Use 3D renders of cans (Spline/Blender)
- Typography-based designs
- Gradient backgrounds with can silhouettes
- Icon-based service representations
- Stock photos with brand overlay (temporary)
- AI-generated venue mockups

## Launch Strategy
1. Soft launch with friends/family for feedback
2. Instagram campaign with behind-the-scenes
3. Partner with wedding planners for initial events
4. Document everything for social proof
5. Collect testimonials aggressively

## Important Notes
- Mobile-first is critical (>70% of Mexican users)
- WhatsApp integration is non-negotiable
- Fast loading despite animations (optimize everything)
- Accessibility considerations (WCAG 2.1 AA minimum)
- GDPR/privacy compliance for data collection

## Supabase Schema (Already Created)
- Tables needed: quotes, bookings, customers, cocktails, events, custom_cans
- Real-time subscriptions for availability
- Row Level Security for customer data
- Storage bucket for can designs and logos

---

