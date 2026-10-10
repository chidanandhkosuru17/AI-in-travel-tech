import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://isjuyszkbxreenmzdfih.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_5eGdoCVDtRUVWX0T3kHnOQ_PM7XecJu';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const SUPABASE_CONFIG = {
  projectName: 'TRAVELTECHAI',
  projectId: 'isjuyszkbxreenmzdfih',
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY,
};

// Database helper functions for bookings
export async function saveBookingToSupabase(bookingData: any) {
  try {
    const { data, error } = await supabase.from('bookings').insert([
      {
        booking_id: bookingData.bookingId,
        pnr: bookingData.pnr,
        passenger_name: bookingData.passengerName,
        passenger_age: bookingData.passengerAge,
        passenger_gender: bookingData.passengerGender,
        emergency_contact: bookingData.emergencyContact,
        origin: bookingData.itinerary?.origin,
        destination: bookingData.itinerary?.destination,
        total_paid: bookingData.totalPaid,
        payment_method: bookingData.paymentMethod,
        status: bookingData.status,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.warn('Supabase booking sync warning (table may need schema creation):', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase booking error:', err?.message || err);
    return { success: false, error: err?.message };
  }
}

// Database helper functions for trusted contacts
export async function saveContactToSupabase(contact: any, userId?: string) {
  try {
    const { data, error } = await supabase.from('trusted_contacts').insert([
      {
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship,
        is_primary: contact.isPrimary,
        user_id: userId || null,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.warn('Supabase contact sync warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase contact error:', err?.message || err);
    return { success: false, error: err?.message };
  }
}

// SQL Schema for user to copy-paste into Supabase SQL Editor if desired
export const SUPABASE_SQL_SCHEMA = `-- TRAVELTECHAI Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/isjuyszkbxreenmzdfih/sql)

-- 1. Bookings Table
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  booking_id text not null,
  pnr text not null,
  passenger_name text not null,
  passenger_age integer,
  passenger_gender text,
  emergency_contact text,
  origin text not null,
  destination text not null,
  total_paid numeric not null,
  payment_method text not null,
  status text default 'Confirmed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Trusted Contacts Table
create table if not exists public.trusted_contacts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  phone text not null,
  relationship text not null,
  is_primary boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) & Policies
alter table public.bookings enable row level security;
alter table public.trusted_contacts enable row level security;

create policy "Allow public anonymous read and insert for demo bookings"
on public.bookings for all
using (true) with check (true);

create policy "Allow public anonymous read and insert for trusted contacts"
on public.trusted_contacts for all
using (true) with check (true);
`;
