import React from 'react';
import {
  Compass,
  MapPin,
  Bot,
  Shield,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Users,
  Bell,
  Sparkles,
  ChevronRight,
  Ticket,
  Leaf,
  Navigation,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { TRAVEL_IMAGES, POPULAR_DESTINATIONS } from '../data/mockTravelData';
import { SupabaseSyncBanner } from './SupabaseSyncBanner';

export const DashboardView: React.FC = () => {
  const {
    user,
    setCurrentView,
    selectedItinerary,
    contacts,
    notifications,
    triggerEmergencySos,
    bookings,
    handleSearchSubmit,
  } = useTravel();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Welcome Area with Photographic Travel Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E4E7EC] min-h-[220px] flex items-center">
        <img
          src={TRAVEL_IMAGES.scenicBridge}
          alt="Travel Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101828]/95 via-[#101828]/80 to-[#0057FF]/35" />

        <div className="relative z-10 p-6 sm:p-10 max-w-2xl text-white space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#0057FF]" />
            <span>Smart Multimodal Travel Hub</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome to TBS RoamAgent
          </h2>
          <p className="text-sm sm:text-base text-gray-200 font-normal">
            Your journeys, intelligently planned.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentView('assistant')}
              className="px-5 py-2.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold shadow-md shadow-[#0057FF]/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Travel Assistant</span>
            </button>
            <button
              onClick={() => setCurrentView('compare')}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Compare Optimized Routes</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Upcoming Journey */}
        <div className="bg-white rounded-3xl p-6 border border-[#E4E7EC] shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0057FF] flex items-center gap-1.5">
                <Ticket className="w-4 h-4" />
                <span>Upcoming Journey</span>
              </span>
              <span className="text-[10px] font-bold bg-emerald-50 text-[#15803D] px-2 py-0.5 rounded-full">
                Confirmed
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <h4 className="text-base font-bold text-[#101828]">
                {selectedItinerary.origin} → {selectedItinerary.destination}
              </h4>
              <p className="text-xs text-[#667085]">
                Tomorrow • {selectedItinerary.departureTime} (Multimodal: Metro + Vande Bharat + Coach)
              </p>

              <div className="p-3 rounded-xl bg-[#F8F7F4] border border-[#E4E7EC] mt-3 space-y-1 text-xs">
                <div className="flex justify-between text-[#667085]">
                  <span>PNR Reference</span>
                  <span className="font-mono font-bold text-[#101828]">{bookings[0]?.pnr || 'IR8923018'}</span>
                </div>
                <div className="flex justify-between text-[#667085]">
                  <span>Safety Sentinel</span>
                  <span className="font-bold text-[#15803D]">★ {selectedItinerary.overallSafetyScore}/100</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('my-journeys')}
            className="mt-6 w-full py-2.5 rounded-xl bg-[#EAF0FF] hover:bg-[#d8e5ff] text-[#0057FF] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View Boarding Pass & Live Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Plan a New Trip */}
        <div className="bg-white rounded-3xl p-6 border border-[#E4E7EC] shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0057FF] flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>Plan a New Trip</span>
              </span>
              <span className="text-[10px] font-bold bg-[#EAF0FF] text-[#0057FF] px-2 py-0.5 rounded-full">
                Multimodal
              </span>
            </div>

            <p className="text-xs text-[#667085] mt-4">
              Enter any Indian route to synchronize state buses, trains, metros, and pre-booked safe cabs.
            </p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => handleSearchSubmit('Hyderabad to Vijayawada')}
                className="w-full p-2.5 rounded-xl bg-[#F8F7F4] hover:bg-[#EAF0FF] text-xs font-medium text-[#101828] text-left flex justify-between items-center transition-colors cursor-pointer"
              >
                <span>Hyderabad → Vijayawada</span>
                <span className="text-[#0057FF] font-bold text-[11px]">Plan →</span>
              </button>
              <button
                onClick={() => handleSearchSubmit('Bengaluru to Ooty')}
                className="w-full p-2.5 rounded-xl bg-[#F8F7F4] hover:bg-[#EAF0FF] text-xs font-medium text-[#101828] text-left flex justify-between items-center transition-colors cursor-pointer"
              >
                <span>Bengaluru → Ooty</span>
                <span className="text-[#0057FF] font-bold text-[11px]">Plan →</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('plan')}
            className="mt-6 w-full py-2.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Launch Route Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Women's Safety Center */}
        <div className="bg-white rounded-3xl p-6 border border-[#E4E7EC] shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0057FF] flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span>Women's Safety Center</span>
              </span>
              <span className="text-[10px] font-bold bg-emerald-50 text-[#15803D] px-2 py-0.5 rounded-full">
                Active 98/100
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#667085]">Night Transit Filter</span>
                <span className="font-bold text-[#15803D]">Enabled</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#667085]">Live GPS Sharing</span>
                <span className="font-bold text-[#0057FF]">Broadcasting to Contacts</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#667085]">Police Station Proximity</span>
                <span className="font-bold text-[#101828]">&lt; 1.2 km continuous</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={() => setCurrentView('safety')}
              className="flex-1 py-2.5 rounded-xl bg-[#EAF0FF] hover:bg-[#d8e5ff] text-[#0057FF] text-xs font-bold transition-colors cursor-pointer text-center"
            >
              Safety Settings
            </button>
            <button
              onClick={triggerEmergencySos}
              className="px-3.5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              SOS
            </button>
          </div>
        </div>

        {/* Card 4: Disruption Simulator */}
        <div className="bg-white rounded-3xl p-6 border border-[#E4E7EC] shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B45309] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Disruption Simulator</span>
              </span>
              <span className="text-[10px] font-bold bg-amber-50 text-[#B45309] px-2 py-0.5 rounded-full">
                Ready
              </span>
            </div>

            <p className="text-xs text-[#667085] mt-4">
              Simulate 45-min highway bus delay, train cancellation, or monsoon taxi surge to test autonomous agentic recovery.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('disruption')}
            className="mt-6 w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#B45309] border border-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Simulate Disruption Scenarios</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 5: Trusted Contacts */}
        <div className="bg-white rounded-3xl p-6 border border-[#E4E7EC] shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0057FF] flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>Trusted Contacts</span>
              </span>
              <span className="text-[10px] font-bold bg-[#EAF0FF] text-[#0057FF] px-2 py-0.5 rounded-full">
                {contacts.length} Connected
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {contacts.slice(0, 2).map((c) => (
                <div key={c.id} className="p-2.5 rounded-xl bg-[#F8F7F4] border border-[#E4E7EC] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#101828]">{c.name}</span>
                  <span className="text-[#667085]">{c.relationship}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentView('safety')}
            className="mt-6 w-full py-2.5 rounded-xl bg-[#F8F7F4] hover:bg-[#EAF0FF] text-[#101828] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Manage Emergency Circle</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#0057FF]" />
          </button>
        </div>

        {/* Card 6: Travel History & Sustainability */}
        <div className="bg-white rounded-3xl p-6 border border-[#E4E7EC] shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#15803D] flex items-center gap-1.5">
                <Leaf className="w-4 h-4" />
                <span>Travel History & Impact</span>
              </span>
              <span className="text-[10px] font-bold bg-emerald-50 text-[#15803D] px-2 py-0.5 rounded-full">
                Eco-Friendly
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-[#F8F7F4] border border-[#E4E7EC]">
                <span className="text-[10px] text-[#667085] block">CO2 Saved</span>
                <span className="text-lg font-black text-[#15803D]">48.2 kg</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8F7F4] border border-[#E4E7EC]">
                <span className="text-[10px] text-[#667085] block">Multimodal Trips</span>
                <span className="text-lg font-black text-[#0057FF]">4 Completed</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('my-journeys')}
            className="mt-6 w-full py-2.5 rounded-xl bg-[#F8F7F4] hover:bg-[#EAF0FF] text-[#101828] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View Completed Receipts</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0057FF]" />
          </button>
        </div>
      </div>

      {/* Supabase Database & Auth Synchronization Card */}
      <SupabaseSyncBanner />

      {/* Popular Travel Destinations Showcase (Photography-rich section) */}
      <div className="space-y-6 pt-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#101828]">
            Popular Indian Travel Corridors
          </h3>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Curated multimodal journeys with daylight transfers and safety-verified operators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              onClick={() => handleSearchSubmit(dest.name)}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E4E7EC] shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-[#101828]/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {dest.tag}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-[#101828] group-hover:text-[#0057FF] transition-colors">
                    {dest.name}
                  </h4>
                  <p className="text-xs text-[#667085] mt-0.5">{dest.state}</p>

                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    {dest.modes.map((mode, mIdx) => (
                      <span
                        key={mIdx}
                        className="text-[10px] bg-[#F8F7F4] border border-[#E4E7EC] text-[#101828] px-2 py-0.5 rounded-md font-medium"
                      >
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E4E7EC] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#667085] block">Typical Trip</span>
                    <span className="font-bold text-[#0057FF]">{dest.quickFare}</span>
                  </div>
                  <span className="text-[#667085] font-medium">{dest.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
