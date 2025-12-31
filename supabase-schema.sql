-- Popup Tiny Bar - Supabase Database Schema (Updated for Canned Cocktails Business Model)
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
  delivery_address TEXT,
  city TEXT DEFAULT 'CDMX',
  postal_code TEXT,
  notes TEXT,
  CONSTRAINT customers_email_key UNIQUE (email)
);

-- ============================================
-- PRODUCTS TABLE (renamed from cocktails)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic Info
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('classic', 'signature', 'mocktail')),
  
  -- Pricing
  price_per_unit DECIMAL(10,2) NOT NULL,
  bulk_price_12 DECIMAL(10,2), -- Price per unit when buying 12+
  bulk_price_24 DECIMAL(10,2), -- Price per unit when buying 24+
  
  -- Product Details
  alcohol_percentage DECIMAL(4,2), -- ABV percentage (NULL for mocktails)
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of ingredient strings
  flavor_profile TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array: ['sweet', 'sour', 'bitter', 'fresh']
  
  -- Inventory
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  
  -- Visual
  image_url TEXT,
  can_color TEXT, -- Hex color code for can display
  
  -- Popularity Tracking
  times_ordered INTEGER DEFAULT 0,
  popularity_score INTEGER DEFAULT 0
);

-- ============================================
-- ORDERS TABLE (replaces quotes/bookings)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Relations
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL UNIQUE, -- Format: POPIT-XXXXXXXX
  
  -- Order Items (JSONB array of {product_id, quantity, price_at_purchase})
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Customization Data (JSONB with label customization details)
  customization_data JSONB DEFAULT '{}'::jsonb,
  
  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  discount_code TEXT,
  total DECIMAL(10,2) NOT NULL,
  
  -- Delivery Information
  delivery_address TEXT NOT NULL,
  delivery_city TEXT DEFAULT 'CDMX',
  delivery_postal_code TEXT,
  delivery_date DATE,
  delivery_instructions TEXT,
  is_gift BOOLEAN DEFAULT FALSE,
  gift_message TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  
  -- Tracking
  tracking_number TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Payment
  payment_method TEXT CHECK (payment_method IN ('card', 'oxxo', 'transfer', 'paypal', 'whatsapp')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  
  -- Notes
  customer_notes TEXT,
  internal_notes TEXT
);

-- ============================================
-- CART_SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cart_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Session identifier (can be user ID or anonymous session ID)
  session_id TEXT NOT NULL,
  
  -- Cart Items (JSONB array of {product_id, quantity})
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Customization data if any
  customization_data JSONB DEFAULT '{}'::jsonb,
  
  -- Expires after 7 days of inactivity
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- ============================================
-- DISCOUNT_CODES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Code Info
  code TEXT NOT NULL UNIQUE,
  discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  
  -- Requirements
  minimum_items INTEGER DEFAULT 0,
  minimum_amount DECIMAL(10,2) DEFAULT 0,
  
  -- Validity
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  
  -- Usage Limits
  usage_limit INTEGER, -- NULL = unlimited
  usage_count INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Restrictions
  applicable_categories TEXT[], -- NULL = all categories
  first_time_only BOOLEAN DEFAULT FALSE,
  
  -- Description
  description TEXT
);

-- ============================================
-- INDEXES for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX IF NOT EXISTS idx_cart_sessions_session_id ON cart_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_sessions_expires_at ON cart_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Public read access for available products
CREATE POLICY "Public can view available products" ON products FOR SELECT USING (is_available = true);

-- Public read access for active discount codes
CREATE POLICY "Public can view active discount codes" ON discount_codes FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

-- Customers can view their own orders
CREATE POLICY "Customers can view own orders" ON orders FOR SELECT USING (
  auth.uid()::text = customer_id::text OR
  customer_id IN (SELECT id FROM customers WHERE email = auth.jwt() ->> 'email')
);

-- Customers can insert orders
CREATE POLICY "Customers can insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Cart sessions are user-specific
CREATE POLICY "Users can manage own cart sessions" ON cart_sessions FOR ALL USING (
  session_id = auth.uid()::text OR
  session_id = (SELECT id::text FROM customers WHERE email = auth.jwt() ->> 'email')
);

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

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'POPIT-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- Function to check and apply discount code
CREATE OR REPLACE FUNCTION validate_discount_code(
  p_code TEXT,
  p_item_count INTEGER,
  p_subtotal DECIMAL
)
RETURNS TABLE (
  valid BOOLEAN,
  discount_percentage DECIMAL,
  discount_amount DECIMAL,
  message TEXT
) AS $$
DECLARE
  v_discount discount_codes%ROWTYPE;
BEGIN
  SELECT * INTO v_discount
  FROM discount_codes
  WHERE code = UPPER(p_code)
    AND is_active = true
    AND (valid_until IS NULL OR valid_until > NOW())
    AND (usage_limit IS NULL OR usage_count < usage_limit);
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 0::DECIMAL, 'Código inválido o expirado'::TEXT;
    RETURN;
  END IF;
  
  IF p_item_count < v_discount.minimum_items THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 0::DECIMAL, 
      format('Mínimo %s latas requeridas', v_discount.minimum_items)::TEXT;
    RETURN;
  END IF;
  
  IF p_subtotal < v_discount.minimum_amount THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 0::DECIMAL,
      format('Monto mínimo: $%s', v_discount.minimum_amount)::TEXT;
    RETURN;
  END IF;
  
  RETURN QUERY SELECT 
    true,
    v_discount.discount_percentage,
    (p_subtotal * v_discount.discount_percentage / 100)::DECIMAL,
    'Descuento aplicado'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist, then create new ones
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_cart_sessions_updated_at ON cart_sessions;
DROP TRIGGER IF EXISTS update_discount_codes_updated_at ON discount_codes;
DROP TRIGGER IF EXISTS set_order_number_trigger ON orders;
DROP TRIGGER IF EXISTS increment_discount_usage_trigger ON orders;

-- Drop existing triggers if they exist (for idempotent schema updates)
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_cart_sessions_updated_at ON cart_sessions;
DROP TRIGGER IF EXISTS update_discount_codes_updated_at ON discount_codes;
DROP TRIGGER IF EXISTS set_order_number_trigger ON orders;
DROP TRIGGER IF EXISTS increment_discount_usage_trigger ON orders;

-- Add triggers to all tables
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_sessions_updated_at BEFORE UPDATE ON cart_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discount_codes_updated_at BEFORE UPDATE ON discount_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- Trigger to increment discount code usage
CREATE OR REPLACE FUNCTION increment_discount_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.discount_code IS NOT NULL AND NEW.status = 'confirmed' THEN
    UPDATE discount_codes
    SET usage_count = usage_count + 1
    WHERE code = NEW.discount_code;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_discount_usage_trigger AFTER UPDATE ON orders FOR EACH ROW 
  WHEN (OLD.status != 'confirmed' AND NEW.status = 'confirmed')
  EXECUTE FUNCTION increment_discount_usage();

-- ============================================
-- SEED DATA - Products
-- ============================================
INSERT INTO products (name, description, category, price_per_unit, bulk_price_12, bulk_price_24, alcohol_percentage, ingredients, flavor_profile, can_color, stock_quantity, is_available) VALUES
('Margarita Clásica', 'Tequila blanco, triple sec, jugo de limón fresco, sal de mar', 'classic', 95.00, 85.50, 80.75, 15.00, '["Tequila blanco", "Triple sec", "Limón", "Sal de mar"]'::jsonb, ARRAY['sour', 'fresh'], '#f7e7ce', 1000, true),
('Mojito Premium', 'Ron blanco, menta fresca, lima, azúcar de caña, agua mineral', 'classic', 95.00, 85.50, 80.75, 12.00, '["Ron blanco", "Menta fresca", "Lima", "Azúcar orgánica"]'::jsonb, ARRAY['fresh', 'sweet'], '#a8e6cf', 1000, true),
('Old Fashioned', 'Whiskey, azúcar, bitters de angostura, naranja', 'classic', 110.00, 99.00, 93.50, 18.00, '["Whiskey", "Azúcar", "Bitters", "Naranja"]'::jsonb, ARRAY['bitter', 'sweet'], '#d4af37', 500, true),
('Paloma Mexicana', 'Tequila reposado, Jarritos de toronja, limón, sal con chile', 'signature', 100.00, 90.00, 85.00, 14.00, '["Tequila reposado", "Jarritos toronja", "Limón", "Chile piquín"]'::jsonb, ARRAY['sour', 'fresh'], '#ffd3b6', 800, true),
('Mezcalita de Jamaica', 'Mezcal artesanal, té de flor de jamaica, menta, limón', 'signature', 100.00, 90.00, 85.00, 13.00, '["Mezcal", "Jamaica", "Menta", "Limón"]'::jsonb, ARRAY['sour', 'fresh'], '#c44569', 600, true),
('Mezcal Sunrise', 'Mezcal artesanal, jugo de naranja, granadina, chile', 'signature', 115.00, 103.50, 97.75, 16.00, '["Mezcal", "Naranja natural", "Granadina", "Chile morita"]'::jsonb, ARRAY['sweet', 'fresh'], '#ffaaa5', 600, true),
('St. Germain Spritz', 'St. Germain, prosecco, soda, limón', 'signature', 110.00, 99.00, 93.50, 11.00, '["St. Germain", "Prosecco", "Soda", "Limón"]'::jsonb, ARRAY['sweet', 'fresh'], '#ffeaa7', 400, true),
('Agua Fresca Tropical', 'Piña, mango, limón, menta, agua mineral', 'mocktail', 75.00, 67.50, 63.75, NULL, '["Piña", "Mango", "Limón", "Menta", "Agua mineral"]'::jsonb, ARRAY['sweet', 'fresh'], '#ffeaa7', 800, true),
('Virgin Mojito de Fresa', 'Fresas frescas, menta, lima, jarabe de agave, soda', 'mocktail', 75.00, 67.50, 63.75, NULL, '["Fresas", "Menta", "Lima", "Agave", "Soda"]'::jsonb, ARRAY['sweet', 'fresh'], '#fd79a8', 800, true),
('Limonada de Lavanda', 'Limones frescos, jarabe de lavanda, agua con gas', 'mocktail', 75.00, 67.50, 63.75, NULL, '["Limón", "Lavanda", "Agave", "Agua con gas"]'::jsonb, ARRAY['sour', 'fresh'], '#a29bfe', 600, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA - Discount Codes
-- ============================================
INSERT INTO discount_codes (code, discount_percentage, minimum_items, valid_from, valid_until, usage_limit, description) VALUES
('POPITEVERYWHERE', 10.00, 6, NOW(), NULL, NULL, '10% OFF para primera vez - Mínimo 6 latas'),
('EARLYBIRD', 5.00, 0, NOW(), NULL, NULL, '5% OFF para pedidos antes de las 12pm'),
('SHARE10', 10.00, 0, NOW(), NULL, NULL, '10% OFF tu próximo pedido si compartes')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE customers IS 'Customer information and delivery addresses';
COMMENT ON TABLE products IS 'Canned cocktail products with pricing tiers';
COMMENT ON TABLE orders IS 'Customer orders for canned cocktails';
COMMENT ON TABLE cart_sessions IS 'Shopping cart sessions (persisted for 7 days)';
COMMENT ON TABLE discount_codes IS 'Discount codes and promotional offers';
