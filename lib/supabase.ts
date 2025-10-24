import { createClient } from '@supabase/supabase-js';

// Database type definitions
export type Database = {
  public: {
    Tables: {
      quotes: {
        Row: {
          id: string;
          created_at: string;
          event_type: string;
          guest_count: number;
          date: string;
          cocktail_style: string;
          service_level: string;
          extras: string[];
          estimated_price: number;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          status: 'pending' | 'contacted' | 'confirmed' | 'completed';
        };
        Insert: Omit<Database['public']['Tables']['quotes']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['quotes']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          created_at: string;
          quote_id: string;
          event_date: string;
          venue_address: string;
          setup_time: string;
          event_duration: number;
          final_price: number;
          deposit_paid: boolean;
          deposit_amount: number;
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      customers: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          phone: string;
          company?: string;
          notes?: string;
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      cocktails: {
        Row: {
          id: string;
          name: string;
          name_en: string;
          description: string;
          description_en: string;
          ingredients: string[];
          category: 'classic' | 'signature' | 'mocktail';
          image_url?: string;
          available: boolean;
        };
        Insert: Omit<Database['public']['Tables']['cocktails']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['cocktails']['Insert']>;
      };
      custom_cans: {
        Row: {
          id: string;
          created_at: string;
          customer_id: string;
          design_data: Record<string, any>;
          logo_url?: string;
          label_text: string;
          color_scheme: string;
          quantity: number;
          status: 'draft' | 'approved' | 'in_production' | 'completed';
        };
        Insert: Omit<Database['public']['Tables']['custom_cans']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['custom_cans']['Insert']>;
      };
      events: {
        Row: {
          id: string;
          created_at: string;
          booking_id: string;
          name: string;
          type: 'wedding' | 'corporate' | 'private' | 'other';
          photo_urls: string[];
          testimonial?: string;
          featured: boolean;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
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
export const insertQuote = async (quote: Database['public']['Tables']['quotes']['Insert']) => {
  const { data, error } = await supabase.from('quotes').insert(quote).select().single();
  
  if (error) throw error;
  return data;
};

export const getAvailableCocktails = async () => {
  const { data, error } = await supabase
    .from('cocktails')
    .select('*')
    .eq('available', true);
  
  if (error) throw error;
  return data;
};

export const checkAvailability = async (date: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('event_date')
    .eq('event_date', date)
    .in('status', ['confirmed', 'in_progress']);
  
  if (error) throw error;
  return data.length === 0; // Returns true if date is available
};

