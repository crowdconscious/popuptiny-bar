// @ts-nocheck
import { createClient } from '@supabase/supabase-js';

// Database type definitions
export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          email: string;
          phone: string;
          delivery_address?: string;
          city?: string;
          postal_code?: string;
          notes?: string;
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          description: string;
          category: 'classic' | 'signature' | 'mocktail';
          price_per_unit: number;
          bulk_price_12?: number;
          bulk_price_24?: number;
          alcohol_percentage?: number;
          ingredients: string[];
          flavor_profile: string[];
          stock_quantity: number;
          is_available: boolean;
          image_url?: string;
          can_color?: string;
          times_ordered: number;
          popularity_score: number;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at' | 'times_ordered' | 'popularity_score'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          customer_id?: string;
          order_number: string;
          items: Array<{
            product_id: string;
            quantity: number;
            price_at_purchase: number;
          }>;
          customization_data?: Record<string, any>;
          subtotal: number;
          shipping: number;
          discount: number;
          discount_code?: string;
          total: number;
          delivery_address: string;
          delivery_city?: string;
          delivery_postal_code?: string;
          delivery_date?: string;
          delivery_instructions?: string;
          is_gift: boolean;
          gift_message?: string;
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          tracking_number?: string;
          shipped_at?: string;
          delivered_at?: string;
          payment_method?: 'card' | 'oxxo' | 'transfer' | 'paypal' | 'whatsapp';
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          customer_notes?: string;
          internal_notes?: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at' | 'order_number'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      cart_sessions: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          session_id: string;
          items: Array<{
            product_id: string;
            quantity: number;
          }>;
          customization_data?: Record<string, any>;
          expires_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cart_sessions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['cart_sessions']['Insert']>;
      };
      discount_codes: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          code: string;
          discount_percentage: number;
          minimum_items: number;
          minimum_amount: number;
          valid_from: string;
          valid_until?: string;
          usage_limit?: number;
          usage_count: number;
          is_active: boolean;
          applicable_categories?: string[];
          first_time_only: boolean;
          description?: string;
        };
        Insert: Omit<Database['public']['Tables']['discount_codes']['Row'], 'id' | 'created_at' | 'updated_at' | 'usage_count'>;
        Update: Partial<Database['public']['Tables']['discount_codes']['Insert']>;
      };
    };
  };
};

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.'
  );
}

// Create and export Supabase client
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: false,
    },
  }
);

// Helper functions for common operations
export const insertOrder = async (order: Database['public']['Tables']['orders']['Insert']) => {
  const { data, error } = await supabase.from('orders').insert(order).select().single();
  
  if (error) throw error;
  return data;
};

export const getAvailableProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .order('popularity_score', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getProductById = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const validateDiscountCode = async (code: string, itemCount: number, subtotal: number) => {
  const { data, error } = await supabase.rpc('validate_discount_code', {
    p_code: code.toUpperCase(),
    p_item_count: itemCount,
    p_subtotal: subtotal,
  });
  
  if (error) throw error;
  return data?.[0] || { valid: false, discount_percentage: 0, discount_amount: 0, message: 'Error validating code' };
};

export const saveCartSession = async (sessionId: string, items: any[], customizationData?: any) => {
  const { data, error } = await supabase
    .from('cart_sessions')
    .upsert({
      session_id: sessionId,
      items,
      customization_data: customizationData || {},
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }, {
      onConflict: 'session_id',
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getCartSession = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('cart_sessions')
    .select('*')
    .eq('session_id', sessionId)
    .gt('expires_at', new Date().toISOString())
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data;
};

export const getCustomerOrders = async (customerId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getOrderByNumber = async (orderNumber: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single();
  
  if (error) throw error;
  return data;
};
