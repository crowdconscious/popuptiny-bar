'use server';

import { supabase } from '@/lib/supabase';
import type { QuoteInput, PricingBreakdown } from '@/lib/pricing-calculator';

export interface SaveQuoteData {
  // Customer Info
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Event Details
  eventType: QuoteInput['eventType'];
  eventDate?: string;
  guestCount: number;
  venueAddress?: string;
  
  // Service Selection
  cocktailStyle: QuoteInput['cocktailStyle'];
  serviceLevel: QuoteInput['serviceLevel'];
  extras: string[];
  
  // Pricing
  pricing: PricingBreakdown;
  
  // Optional
  specialRequests?: string;
}

export async function saveQuote(data: SaveQuoteData) {
  try {
    // 1. First, check if customer exists or create new one
    const { data: existingCustomer, error: customerCheckError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', data.customerEmail)
      .maybeSingle();

    let customerId = existingCustomer?.id as string | undefined;

    // If customer doesn't exist, create one
    if (!customerId && !customerCheckError) {
      const { data: newCustomer, error: customerCreateError } = await supabase
        .from('customers')
        .insert({
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
        })
        .select('id')
        .single();

      if (customerCreateError) {
        console.error('Error creating customer:', customerCreateError);
        return { success: false, error: 'Error al crear el cliente' };
      }

      customerId = newCustomer.id;
    }

    // 2. Save the quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        customer_id: customerId,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        
        event_type: data.eventType,
        event_date: data.eventDate || null,
        guest_count: data.guestCount,
        venue_address: data.venueAddress || null,
        
        cocktail_style: data.cocktailStyle,
        service_level: data.serviceLevel,
        extras: data.extras,
        
        base_price: data.pricing.basePrice,
        per_person_price: data.pricing.perPersonPrice,
        extras_price: data.pricing.extrasPrice,
        subtotal: data.pricing.subtotal,
        tax: data.pricing.tax,
        total_price: data.pricing.total,
        
        special_requests: data.specialRequests || null,
        status: 'pending',
      })
      .select()
      .single();

    if (quoteError) {
      console.error('Error saving quote:', quoteError);
      return { success: false, error: 'Error al guardar la cotización' };
    }

    return {
      success: true,
      data: quote,
      message: '¡Cotización guardada exitosamente!',
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'Error inesperado al guardar' };
  }
}

export async function getQuote(quoteId: string) {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (error) {
      console.error('Error fetching quote:', error);
      return { success: false, error: 'Quote not found' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'Unexpected error' };
  }
}

export async function getAllQuotes(status?: string) {
  try {
    let query = supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching quotes:', error);
      return { success: false, error: 'Error fetching quotes' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'Unexpected error' };
  }
}

export async function updateQuoteStatus(quoteId: string, status: 'pending' | 'contacted' | 'converted' | 'declined' | 'expired') {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', quoteId)
      .select()
      .single();

    if (error) {
      console.error('Error updating quote:', error);
      return { success: false, error: 'Error updating quote' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'Unexpected error' };
  }
}

