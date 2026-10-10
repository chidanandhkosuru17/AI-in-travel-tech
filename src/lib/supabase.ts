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
export async function saveBookingToSupabase(bookingData: any, userId?: string) {
  try {
    const { data, error } = await supabase.from('bookings').insert([
      {
        booking_id: bookingData.bookingId,
        pnr: bookingData.pnr,
        user_id: userId || null,
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

// Database helper functions for inquiries
export async function saveInquiryToSupabase(inquiryData: {
  fullName: string;
  email: string;
  phone?: string;
  category: string;
  subject: string;
  message: string;
  preferredContact?: string;
  pnrOrBookingId?: string;
}) {
  try {
    const { data, error } = await supabase.from('inquiries').insert([
      {
        full_name: inquiryData.fullName,
        email: inquiryData.email,
        phone: inquiryData.phone || null,
        category: inquiryData.category,
        subject: inquiryData.subject,
        message: inquiryData.message,
        preferred_contact: inquiryData.preferredContact || 'email',
        pnr_or_booking_id: inquiryData.pnrOrBookingId || null,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.warn('Supabase inquiry sync warning (table may need schema creation):', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase inquiry error:', err?.message || err);
    return { success: false, error: err?.message };
  }
}

// Database helper functions for saved trips
export async function saveTripToSupabase(tripData: {
  userId: string;
  itineraryId: string;
  title: string;
  origin: string;
  destination: string;
  totalFare: number;
  totalDurationMinutes: number;
  overallSafetyScore: number;
  transfersCount: number;
  departureTime: string;
  arrivalTime: string;
  itineraryData?: any;
}) {
  try {
    const { data, error } = await supabase.from('saved_trips').insert([
      {
        user_id: tripData.userId,
        itinerary_id: tripData.itineraryId,
        title: tripData.title,
        origin: tripData.origin,
        destination: tripData.destination,
        total_fare: tripData.totalFare,
        total_duration_minutes: tripData.totalDurationMinutes,
        overall_safety_score: tripData.overallSafetyScore,
        transfers_count: tripData.transfersCount,
        departure_time: tripData.departureTime,
        arrival_time: tripData.arrivalTime,
        itinerary_data: tripData.itineraryData || null,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.warn('Supabase save trip sync warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase save trip error:', err?.message || err);
    return { success: false, error: err?.message };
  }
}

export async function removeSavedTripFromSupabase(userId: string, itineraryId: string) {
  try {
    const { data, error } = await supabase
      .from('saved_trips')
      .delete()
      .match({ user_id: userId, itinerary_id: itineraryId });

    if (error) {
      console.warn('Supabase delete trip warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase delete trip error:', err?.message || err);
    return { success: false, error: err?.message };
  }
}

export async function fetchUserSavedTripsFromSupabase(userId: string) {
  try {
    const { data, error } = await supabase
      .from('saved_trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch saved trips warning:', error.message);
      return { success: false, error: error.message, data: [] };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase fetch saved trips error:', err?.message || err);
    return { success: false, error: err?.message, data: [] };
  }
}

// SQL Schema for user to copy-paste into Supabase SQL Editor if desired
export const SUPABASE_SQL_SCHEMA = `-- TRAVELTECHAI Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/isjuyszkbxreenmzdfih/sql)

-- =========================================================
-- 1. Saved Trips / Liked Trips Table (Linked to Logged-in Users)
-- =========================================================
create table if not exists public.saved_trips (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  itinerary_id text not null,
  title text not null,
  origin text not null,
  destination text not null,
  total_fare numeric not null,
  total_duration_minutes integer not null,
  overall_safety_score integer default 95,
  transfers_count integer default 0,
  departure_time text not null,
  arrival_time text not null,
  itinerary_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_itinerary unique (user_id, itinerary_id)
);

-- Index for speedy queries by user_id
create index if not exists idx_saved_trips_user_id on public.saved_trips(user_id);
create index if not exists idx_saved_trips_created_at on public.saved_trips(created_at desc);

-- =========================================================
-- 2. Inquiries Table (Customer / Passenger Support Requests)
-- =========================================================
create table if not exists public.inquiries (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null,
  phone text,
  category text not null default 'general',
  subject text not null,
  message text not null,
  preferred_contact text default 'email',
  pnr_or_booking_id text,
  status text not null default 'pending', -- pending, in_review, resolved, closed
  resolved_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for speedy queries by email, status and date
create index if not exists idx_inquiries_email on public.inquiries(email);
create index if not exists idx_inquiries_status on public.inquiries(status);
create index if not exists idx_inquiries_created_at on public.inquiries(created_at desc);

-- =========================================================
-- 3. Bookings Table
-- =========================================================
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  booking_id text not null,
  pnr text not null,
  user_id text,
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

-- Index for speedy queries by user_id and pnr
create index if not exists idx_bookings_user_id on public.bookings(user_id);
create index if not exists idx_bookings_pnr on public.bookings(pnr);

-- =========================================================
-- 4. Trusted Contacts Table
-- =========================================================
create table if not exists public.trusted_contacts (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  name text not null,
  phone text not null,
  relationship text not null,
  is_primary boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================
-- 5. Enable Row Level Security (RLS) & Policies
-- =========================================================
alter table public.saved_trips enable row level security;
alter table public.inquiries enable row level security;
alter table public.bookings enable row level security;
alter table public.trusted_contacts enable row level security;

-- Policy for saved_trips: Allow logged in / authenticated users to manage their saved trips
create policy "Allow all users to manage saved trips"
on public.saved_trips for all
using (true) with check (true);

-- Policy: Allow anyone (passengers/visitors) to submit inquiries and view them
create policy "Allow anonymous and authenticated insert on inquiries"
on public.inquiries for insert
with check (true);

create policy "Allow read on inquiries"
on public.inquiries for select
using (true);

create policy "Allow update on inquiries"
on public.inquiries for update
using (true) with check (true);

-- Policy for bookings
create policy "Allow public anonymous read and insert for demo bookings"
on public.bookings for all
using (true) with check (true);

-- Policy for trusted contacts
create policy "Allow public anonymous read and insert for trusted contacts"
on public.trusted_contacts for all
using (true) with check (true);
`;
