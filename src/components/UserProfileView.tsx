import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  Heart,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Database,
  Lock,
  LogOut,
  ChevronRight,
  TrendingUp,
  Share2,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { SUPABASE_CONFIG } from '../lib/supabase';
import { MultimodalItinerary } from '../types/travel';

export const UserProfileView: React.FC = () => {
  const {
    user,
    bookings,
    savedTrips,
    removeSavedTrip,
    setSelectedItinerary,
    setCurrentView,
    logout,
    setIsAuthModalOpen,
  } = useTravel();

  const [activeTab, setActiveTab] = useState<'saved-trips' | 'booked-trips' | 'security'>('saved-trips');

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl bg-[#EAF0FF] text-[#0057FF] flex items-center justify-center mx-auto mb-6 shadow-md">
          <User className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
          Sign in to view your Traveler Profile
        </h2>
        <p className="text-sm text-[#667085] mt-2 max-w-md mx-auto">
          Access your liked and saved itineraries, multimodal bookings, and real-time safety credentials stored in Supabase.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-sm font-bold shadow-lg shadow-[#0057FF]/30 transition-all cursor-pointer"
          >
            Sign In / Create Account
          </button>
          <button
            onClick={() => setCurrentView('compare')}
            className="px-5 py-3 rounded-xl border border-[#E4E7EC] bg-white text-[#101828] text-sm font-semibold hover:bg-[#F8F7F4] transition-colors cursor-pointer"
          >
            Explore Routes
          </button>
        </div>
      </div>
    );
  }

  // Find user bookings if any or all
  const userBookings = bookings;

  const handleLaunchSavedTrip = (saved: any) => {
    if (saved.itineraryData) {
      setSelectedItinerary(saved.itineraryData);
    }
    setCurrentView('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-[#E4E7EC] shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#101828] via-[#1b253b] to-[#0057FF] p-6 sm:p-8 text-white relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-xl"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{user.name}</h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Supabase Authenticated</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 mt-1 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-300" />
                  <span>{user.email}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                  <span className="bg-white/10 text-white px-2.5 py-0.5 rounded-lg border border-white/10 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-300" />
                    <span>Women Safety Guard: Active</span>
                  </span>
                  <span className="bg-white/10 text-white px-2.5 py-0.5 rounded-lg border border-white/10 flex items-center gap-1 font-mono">
                    <Database className="w-3 h-3 text-emerald-300" />
                    <span>User ID: {user.id.slice(0, 8)}...</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={() => setCurrentView('compare')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse Routes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={logout}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-semibold border border-red-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#E4E7EC] border-t border-[#E4E7EC] bg-[#F8F7F4]/50 text-center py-4 text-xs">
          <div>
            <span className="text-[#667085] block text-[11px]">Liked & Saved Trips</span>
            <span className="text-xl font-black text-[#0057FF] mt-0.5 block">{savedTrips.length}</span>
          </div>
          <div>
            <span className="text-[#667085] block text-[11px]">Booked Journeys</span>
            <span className="text-xl font-black text-[#101828] mt-0.5 block">{userBookings.length}</span>
          </div>
          <div>
            <span className="text-[#667085] block text-[11px]">Safety Index</span>
            <span className="text-xl font-black text-[#15803D] mt-0.5 block">98/100</span>
          </div>
          <div>
            <span className="text-[#667085] block text-[11px]">Database Link</span>
            <span className="text-xs font-mono font-bold text-[#101828] mt-1 block">TRAVELTECHAI</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-[#E4E7EC] gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('saved-trips')}
          className={`pb-3 flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
            activeTab === 'saved-trips'
              ? 'border-[#0057FF] text-[#0057FF]'
              : 'border-transparent text-[#667085] hover:text-[#101828]'
          }`}
        >
          <Heart className="w-4 h-4 fill-current text-[#0057FF]" />
          <span>Liked & Saved Trips ({savedTrips.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('booked-trips')}
          className={`pb-3 flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
            activeTab === 'booked-trips'
              ? 'border-[#0057FF] text-[#0057FF]'
              : 'border-transparent text-[#667085] hover:text-[#101828]'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>My Booked Journeys ({userBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
            activeTab === 'security'
              ? 'border-[#0057FF] text-[#0057FF]'
              : 'border-transparent text-[#667085] hover:text-[#101828]'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Profile & Supabase Sync</span>
        </button>
      </div>

      {/* Tab 1: Saved / Liked Trips */}
      {activeTab === 'saved-trips' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[#101828]">Your Saved & Liked Itineraries</h2>
              <p className="text-xs text-[#667085]">
                Saved routes are synchronized to the <code className="text-[#0057FF] font-mono">public.saved_trips</code> table in Supabase.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('compare')}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#EAF0FF] hover:bg-[#d8e5ff] text-[#0057FF] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>+ Discover More Trips</span>
            </button>
          </div>

          {savedTrips.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E4E7EC] p-12 text-center max-w-xl mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#101828]">No saved trips yet</h3>
              <p className="text-xs text-[#667085] mt-1.5 leading-relaxed">
                Whenever you find an itinerary you love on the Route Comparison page or AI Assistant, click the heart icon (<strong>Like & Save</strong>) to store it here under your account.
              </p>
              <button
                onClick={() => setCurrentView('compare')}
                className="mt-6 px-6 py-2.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#0057FF]/25"
              >
                Browse Multimodal Routes Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-3xl border border-[#E4E7EC] hover:border-[#0057FF]/40 shadow-md hover:shadow-xl transition-all p-6 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Badge & Unsave button */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EAF0FF] text-[#0057FF] px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Liked Journey</span>
                      </span>
                      <button
                        onClick={() => removeSavedTrip(trip.itineraryId)}
                        className="text-[#667085] hover:text-[#DC2626] p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove from saved trips"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Title & Route */}
                    <h3 className="text-base font-bold text-[#101828] mt-3 group-hover:text-[#0057FF] transition-colors">
                      {trip.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#667085]">
                      <MapPin className="w-3.5 h-3.5 text-[#0057FF] shrink-0" />
                      <span className="font-semibold text-[#101828] truncate">{trip.origin}</span>
                      <span>→</span>
                      <span className="font-semibold text-[#101828] truncate">{trip.destination}</span>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-3 gap-2 py-3 my-3 bg-[#F8F7F4] rounded-2xl border border-[#E4E7EC] text-center text-xs">
                      <div>
                        <span className="text-[10px] text-[#667085] block">Duration</span>
                        <span className="font-bold text-[#101828]">
                          {Math.floor(trip.totalDurationMinutes / 60)}h {trip.totalDurationMinutes % 60}m
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#667085] block">Fare</span>
                        <span className="font-bold text-[#0057FF]">₹{trip.totalFare}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#667085] block">Safety</span>
                        <span className="font-bold text-[#15803D]">{trip.overallSafetyScore}/100</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#667085] flex justify-between items-center">
                      <span>Schedule: {trip.departureTime} → {trip.arrivalTime}</span>
                      <span className="text-emerald-700 font-medium">✓ Synced in Supabase</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-[#E4E7EC] flex gap-2">
                    <button
                      onClick={() => handleLaunchSavedTrip(trip)}
                      className="flex-1 py-2.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-[#0057FF]/20"
                    >
                      <span>View & Book Trip</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Booked Journeys */}
      {activeTab === 'booked-trips' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#101828]">Your Confirmed Bookings</h2>
              <p className="text-xs text-[#667085]">
                All verified multimodal tickets with PNR and allocated coach/seat numbers.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('my-journeys')}
              className="px-4 py-2 rounded-xl bg-[#EAF0FF] text-[#0057FF] text-xs font-bold hover:bg-[#d8e5ff] transition-colors cursor-pointer"
            >
              Print / Download Tickets
            </button>
          </div>

          <div className="space-y-4">
            {userBookings.map((b) => (
              <div
                key={b.bookingId}
                className="bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#0057FF] text-white flex items-center justify-center font-bold shadow-md shadow-[#0057FF]/20 shrink-0">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#0057FF] bg-[#EAF0FF] px-2 py-0.5 rounded">
                        PNR: {b.pnr}
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-50 text-[#15803D] px-2 py-0.5 rounded-full">
                        {b.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#101828] mt-1">
                      {b.itinerary.origin} → {b.itinerary.destination}
                    </h3>
                    <p className="text-xs text-[#667085] mt-0.5">
                      Passenger: <span className="font-medium text-[#101828]">{b.passengerName}</span> • Paid: <span className="font-bold text-[#0057FF]">₹{b.totalPaid}</span> ({b.paymentMethod})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => {
                      setSelectedItinerary(b.itinerary);
                      setCurrentView('compare');
                    }}
                    className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-[#E4E7EC] hover:bg-[#F8F7F4] text-xs font-semibold text-[#101828] transition-colors cursor-pointer"
                  >
                    View Timeline
                  </button>
                  <button
                    onClick={() => setCurrentView('my-journeys')}
                    className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Boarding Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Security & Database Settings */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E4E7EC]">
            <div className="w-10 h-10 rounded-xl bg-[#EAF0FF] text-[#0057FF] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#101828]">Connected Supabase Project</h3>
              <p className="text-xs text-[#667085]">
                Project: <span className="font-semibold text-[#101828]">{SUPABASE_CONFIG.projectName}</span> (ID: <span className="font-mono">{SUPABASE_CONFIG.projectId}</span>)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#E4E7EC] space-y-2">
              <h4 className="font-bold text-[#101828] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                <span>Active Tables Linked to User Profile</span>
              </h4>
              <ul className="space-y-1.5 text-[#667085] pt-1">
                <li className="flex items-center justify-between">
                  <span>• <code className="font-mono text-[#0057FF]">public.saved_trips</code>:</span>
                  <span className="font-semibold text-[#15803D]">Linked via user_id</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>• <code className="font-mono text-[#0057FF]">public.bookings</code>:</span>
                  <span className="font-semibold text-[#15803D]">Linked via user_id</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>• <code className="font-mono text-[#0057FF]">public.trusted_contacts</code>:</span>
                  <span className="font-semibold text-[#15803D]">Emergency contacts</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#E4E7EC] space-y-2">
              <h4 className="font-bold text-[#101828] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#0057FF]" />
                <span>Row Level Security (RLS) Status</span>
              </h4>
              <p className="text-[#667085] leading-relaxed">
                RLS is enabled across all tables. Only authorized sessions can read or write user-linked travel records.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('safety')}
                  className="px-3 py-1.5 rounded-lg bg-[#EAF0FF] text-[#0057FF] font-bold hover:bg-[#d8e5ff] transition-colors cursor-pointer"
                >
                  Manage Emergency Contacts →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
