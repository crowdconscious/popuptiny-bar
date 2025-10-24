-- Popup Tiny Bar - Supabase Database Schema
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  notes TEXT,
  CONSTRAINT customers_email_key UNIQUE (email)
);

-- ============================================
-- QUOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Customer Info
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  
  -- Event Details
  event_type TEXT NOT NULL CHECK (event_type IN ('wedding', 'corporate', 'private', 'other')),
  event_date DATE,
  guest_count INTEGER NOT NULL CHECK (guest_count > 0),
  venue_address TEXT,
  
  -- Service Selection
  cocktail_style TEXT NOT NULL, -- 'classic', 'signature', 'mocktail', 'custom'
  service_level TEXT NOT NULL CHECK (service_level IN ('self_service', 'bartender', 'full_experience')),
  
  -- Extras (stored as JSON array)
  extras JSONB DEFAULT '[]'::jsonb,
  
  -- Pricing
  base_price DECIMAL(10,2) NOT NULL,
  per_person_price DECIMAL(10,2) NOT NULL,
  extras_price DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'declined', 'expired')),
  
  -- Notes
  special_requests TEXT,
  internal_notes TEXT
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Relations
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  
  -- Event Details
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  venue_name TEXT,
  venue_address TEXT NOT NULL,
  setup_time TIME NOT NULL,
  event_duration INTEGER NOT NULL DEFAULT 4, -- hours
  
  -- Pricing
  final_price DECIMAL(10,2) NOT NULL,
  deposit_amount DECIMAL(10,2) NOT NULL,
  deposit_paid BOOLEAN DEFAULT FALSE,
  deposit_paid_date TIMESTAMP WITH TIME ZONE,
  balance_paid BOOLEAN DEFAULT FALSE,
  balance_paid_date TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  
  -- Contract
  contract_signed BOOLEAN DEFAULT FALSE,
  contract_url TEXT,
  
  -- Notes
  notes TEXT
);

-- ============================================
-- COCKTAILS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cocktails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic Info
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT NOT NULL,
  description_en TEXT,
  
  -- Details
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of ingredient objects
  category TEXT NOT NULL CHECK (category IN ('classic', 'signature', 'mocktail', 'seasonal')),
  abv DECIMAL(4,2), -- Alcohol by volume percentage
  
  -- Pricing
  base_cost DECIMAL(10,2) NOT NULL, -- Cost to make
  price_per_can DECIMAL(10,2), -- If sold as canned cocktail
  
  -- Media
  image_url TEXT,
  can_design_url TEXT,
  
  -- Availability
  available BOOLEAN DEFAULT TRUE,
  seasonal BOOLEAN DEFAULT FALSE,
  season_start DATE,
  season_end DATE,
  
  -- Popularity
  popularity_score INTEGER DEFAULT 0,
  times_ordered INTEGER DEFAULT 0
);

-- ============================================
-- CUSTOM CANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS custom_cans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Relations
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  
  -- Design Data
  design_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- All 3D customizer settings
  logo_url TEXT,
  label_text TEXT NOT NULL,
  color_scheme TEXT NOT NULL,
  pattern TEXT,
  
  -- Cocktail Selection
  cocktail_ids UUID[] DEFAULT ARRAY[]::UUID[], -- Array of cocktail IDs
  custom_recipe JSONB, -- If custom cocktail
  
  -- Order Details
  quantity INTEGER NOT NULL CHECK (quantity >= 50),
  price_per_unit DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'in_production', 'completed', 'delivered')),
  
  -- Production
  production_notes TEXT,
  estimated_delivery DATE,
  actual_delivery DATE
);

-- ============================================
-- EVENTS TABLE (for portfolio/gallery)
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Relations
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  
  -- Event Info
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('wedding', 'corporate', 'private', 'other')),
  event_date DATE NOT NULL,
  guest_count INTEGER,
  
  -- Media
  photo_urls JSONB DEFAULT '[]'::jsonb, -- Array of photo URLs
  video_url TEXT,
  featured_image_url TEXT,
  
  -- Social Proof
  testimonial TEXT,
  testimonial_author TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  
  -- Display
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0
);

-- ============================================
-- PRICING RULES TABLE (for dynamic pricing)
-- ============================================
CREATE TABLE IF NOT EXISTS pricing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Rule Info
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  
  -- Pricing
  service_type TEXT NOT NULL, -- 'mobile_bar', 'custom_cans', 'package'
  base_price DECIMAL(10,2) NOT NULL,
  per_person_min DECIMAL(10,2),
  per_person_max DECIMAL(10,2),
  
  -- Volume Discounts
  volume_tiers JSONB DEFAULT '[]'::jsonb, -- Array of {min, max, price} objects
  
  -- Season/Date Multipliers
  peak_season_multiplier DECIMAL(4,2) DEFAULT 1.0,
  weekend_multiplier DECIMAL(4,2) DEFAULT 1.0,
  
  -- Minimums
  minimum_guests INTEGER,
  minimum_order DECIMAL(10,2)
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_quotes_customer_email ON quotes(customer_email);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_event_date ON quotes(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_cocktails_category ON cocktails(category);
CREATE INDEX IF NOT EXISTS idx_cocktails_available ON cocktails(available);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);
CREATE INDEX IF NOT EXISTS idx_events_published ON events(published);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cocktails ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_cans ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

-- Public read access for cocktails and published events
CREATE POLICY "Public can view available cocktails" ON cocktails FOR SELECT USING (available = true);
CREATE POLICY "Public can view published events" ON events FOR SELECT USING (published = true);

-- Customers can view their own data
CREATE POLICY "Customers can view own quotes" ON quotes FOR SELECT USING (auth.uid()::text = customer_id::text);
CREATE POLICY "Customers can insert quotes" ON quotes FOR INSERT WITH CHECK (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to all tables
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cocktails_updated_at BEFORE UPDATE ON cocktails FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_custom_cans_updated_at BEFORE UPDATE ON custom_cans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA - Initial Pricing Rules
-- ============================================
INSERT INTO pricing_rules (name, description, service_type, base_price, per_person_min, per_person_max, minimum_guests, active) VALUES
('Mobile Bar - Wedding Package', 'Premium mobile bar service for weddings', 'mobile_bar', 12000.00, 300.00, 450.00, 30, true),
('Mobile Bar - Corporate Event', 'Professional bar service for corporate events', 'mobile_bar', 10000.00, 250.00, 400.00, 20, true),
('Mobile Bar - Private Party', 'Fun bar service for private celebrations', 'mobile_bar', 8000.00, 280.00, 420.00, 15, true),
('Custom Cans - Standard', 'Custom branded cocktail cans', 'custom_cans', 0.00, 0.00, 0.00, 50, true);

-- ============================================
-- SEED DATA - Sample Cocktails
-- ============================================
INSERT INTO cocktails (name, name_en, description, description_en, category, ingredients, base_cost, price_per_can, available) VALUES
('Margarita Clásica', 'Classic Margarita', 'Tequila, triple sec, jugo de limón, sal en el borde', 'Tequila, triple sec, lime juice, salt rim', 'classic', '["Tequila blanco", "Triple sec", "Jugo de limón", "Sal"]'::jsonb, 45.00, 95.00, true),
('Paloma Mexicana', 'Mexican Paloma', 'Tequila, refresco de toronja, limón, sal', 'Tequila, grapefruit soda, lime, salt', 'signature', '["Tequila blanco", "Jarritos toronja", "Limón", "Sal"]'::jsonb, 40.00, 90.00, true),
('Mojito de Jamaica', 'Hibiscus Mojito', 'Ron, té de jamaica, menta, limón, soda', 'Rum, hibiscus tea, mint, lime, soda', 'signature', '["Ron blanco", "Té de jamaica", "Menta", "Limón", "Agua mineral"]'::jsonb, 42.00, 92.00, true),
('Espresso Martini', 'Espresso Martini', 'Vodka, licor de café, espresso, jarabe simple', 'Vodka, coffee liqueur, espresso, simple syrup', 'classic', '["Vodka", "Kahlúa", "Espresso", "Jarabe simple"]'::jsonb, 55.00, 110.00, true),
('Agua Fresca Tropical', 'Tropical Agua Fresca', 'Jugo de piña, mango, limón, menta (sin alcohol)', 'Pineapple juice, mango, lime, mint (non-alcoholic)', 'mocktail', '["Piña", "Mango", "Limón", "Menta", "Agua mineral"]'::jsonb, 25.00, 60.00, true);

COMMENT ON TABLE quotes IS 'Customer quote requests and pricing calculations';
COMMENT ON TABLE bookings IS 'Confirmed event bookings';
COMMENT ON TABLE customers IS 'Customer contact information';
COMMENT ON TABLE cocktails IS 'Cocktail menu and recipes';
COMMENT ON TABLE custom_cans IS 'Custom branded can orders';
COMMENT ON TABLE events IS 'Past events for portfolio/gallery';
COMMENT ON TABLE pricing_rules IS 'Dynamic pricing rules and tiers';

