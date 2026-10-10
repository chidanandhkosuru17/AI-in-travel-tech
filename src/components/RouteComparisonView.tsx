import React, { useState } from 'react';
import {
  Zap,
  Shield,
  Coins,
  Clock,
  ArrowRight,
  CheckCircle2,
  Bus,
  Train,
  Car,
  Navigation,
  Info,
  Calendar,
  Sparkles,
  MapPin,
  ChevronRight,
  CreditCard,
  Heart,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { MultimodalItinerary, JourneyLeg, ItineraryType } from '../types/travel';
import { MultimodalRouteMap } from './MultimodalRouteMap';

export const RouteComparisonView: React.FC = () => {
  const {
    itineraries,
    selectedItinerary,
    setSelectedItinerary,
    setCurrentView,
    origin,
    destination,
    user,
    toggleSaveTrip,
    isTripSaved,
    setIsAuthModalOpen,
  } = useTravel();

  const [activeTab, setActiveTab] = useState<ItineraryType>(selectedItinerary.type);

  const getTabIcon = (type: ItineraryType) => {
    switch (type) {
      case 'fastest':
        return Zap;
      case 'safety':
        return Shield;
      case 'budget':
        return Coins;
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'train':
        return Train;
      case 'bus':
        return Bus;
      case 'cab':
        return Car;
      default:
        return Navigation;
    }
  };

  const currentItinerary = itineraries.find((it) => it.type === activeTab) || selectedItinerary;

  const handleSelectAndProceed = (itinerary: MultimodalItinerary) => {
    setSelectedItinerary(itinerary);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF0FF] text-[#0057FF] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multimodal Route Optimizer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
              Compare Travel Options: {origin} → {destination}
            </h2>
            <p className="text-sm text-[#667085] mt-1">
              Evaluated across 3 distinct trip philosophies: Fastest speed, Budget thrift, and Safety sentinel.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('assistant')}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl border border-[#E4E7EC] bg-white hover:bg-[#F8F7F4] text-xs font-semibold text-[#101828] flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <span>Adjust Filters in Assistant</span>
            <ChevronRight className="w-4 h-4 text-[#0057FF]" />
          </button>
        </div>
      </div>

      {/* 3 Route Philosophy Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
        {itineraries.map((itin) => {
          const Icon = getTabIcon(itin.type);
          const isSelected = itin.type === activeTab;

          return (
            <div
              key={itin.id}
              onClick={() => {
                setActiveTab(itin.type);
                setSelectedItinerary(itin);
              }}
              className={`rounded-3xl p-6 border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-white border-[#0057FF] ring-2 ring-[#0057FF]/30 shadow-xl shadow-[#0057FF]/10 scale-[1.01]'
                  : 'bg-white/80 border-[#E4E7EC] hover:border-gray-300 shadow-sm'
              }`}
            >
              {itin.isRecommended && (
                <span className="absolute -top-3 right-6 bg-[#0057FF] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  ★ Recommended
                </span>
              )}

              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    isSelected
                      ? 'bg-[#0057FF] text-white shadow-md shadow-[#0057FF]/30'
                      : 'bg-[#EAF0FF] text-[#0057FF]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        setIsAuthModalOpen(true);
                      } else {
                        toggleSaveTrip(itin);
                      }
                    }}
                    className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                      isTripSaved(itin.id)
                        ? 'bg-pink-50 text-pink-600 hover:bg-pink-100 ring-1 ring-pink-200'
                        : 'bg-gray-100 text-[#667085] hover:text-pink-600 hover:bg-pink-50'
                    }`}
                    title={
                      !user
                        ? 'Sign in to like & save trip'
                        : isTripSaved(itin.id)
                        ? 'Remove from liked trips'
                        : 'Like & Save trip to Supabase'
                    }
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform active:scale-125 ${
                        isTripSaved(itin.id) ? 'fill-current text-pink-600' : ''
                      }`}
                    />
                  </button>
                  <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">
                    {itin.badgeLabel}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#101828]">{itin.title}</h3>
              <p className="text-xs text-[#667085] mt-0.5 line-clamp-2">{itin.tagline}</p>

              <div className="grid grid-cols-3 gap-2 py-4 my-4 border-y border-[#E4E7EC] text-center">
                <div>
                  <span className="text-[10px] text-[#667085] block">Duration</span>
                  <span className="text-sm font-bold text-[#101828]">
                    {Math.floor(itin.totalDurationMinutes / 60)}h {itin.totalDurationMinutes % 60}m
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] block">Total Fare</span>
                  <span className="text-sm font-bold text-[#0057FF]">₹{itin.totalFare}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] block">Safety Index</span>
                  <span className="text-sm font-bold text-[#15803D]">{itin.overallSafetyScore}/100</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#667085]">
                <span>
                  {itin.departureTime} → {itin.arrivalTime}
                </span>
                <span>{itin.transfersCount} Transfers</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive SVG Topology Map for Active Itinerary */}
      <div className="mb-8">
        <MultimodalRouteMap itinerary={currentItinerary} />
      </div>

      {/* Leg-by-leg detailed visual timeline */}
      <div className="bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E4E7EC] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#EAF0FF] text-[#0057FF] text-xs font-bold">
                {currentItinerary.badgeLabel}
              </span>
              <span className="text-xs text-[#667085]">{currentItinerary.dataFreshness}</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#101828] mt-2">
              Step-by-Step Multimodal Timeline
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  setIsAuthModalOpen(true);
                } else {
                  toggleSaveTrip(currentItinerary);
                }
              }}
              className={`px-4 py-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isTripSaved(currentItinerary.id)
                  ? 'bg-pink-50 border-pink-200 text-pink-600'
                  : 'bg-white border-[#E4E7EC] text-[#101828] hover:bg-[#F8F7F4] hover:text-pink-600'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  isTripSaved(currentItinerary.id) ? 'fill-current text-pink-600' : ''
                }`}
              />
              <span>
                {isTripSaved(currentItinerary.id) ? 'Saved in Profile' : 'Like & Save Trip'}
              </span>
            </button>

            <button
              onClick={() => handleSelectAndProceed(currentItinerary)}
              className="px-6 py-3.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-sm font-bold shadow-lg shadow-[#0057FF]/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Proceed to Booking Approval (₹{currentItinerary.totalFare})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legs timeline */}
        <div className="mt-8 space-y-6">
          {currentItinerary.legs.map((leg, index) => {
            const Icon = getModeIcon(leg.mode);
            const isLast = index === currentItinerary.legs.length - 1;

            return (
              <div key={leg.id} className="relative">
                {!isLast && (
                  <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-[#E4E7EC] -mb-6" />
                )}

                <div className="flex items-start gap-4 sm:gap-6">
                  {/* Mode Icon circle */}
                  <div className="w-12 h-12 rounded-2xl bg-[#0057FF] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0057FF]/20 z-10">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Leg Content Box */}
                  <div className="flex-1 bg-[#F8F7F4] rounded-2xl p-5 border border-[#E4E7EC]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#0057FF]">
                            Leg {index + 1}: {leg.mode.toUpperCase()}
                          </span>
                          <span className="text-xs bg-white px-2 py-0.5 rounded border border-[#E4E7EC] text-[#101828] font-medium">
                            {leg.operatorName}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-[#101828] mt-1">
                          {leg.from} → {leg.to}
                        </h4>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-lg font-extrabold text-[#0057FF]">₹{leg.fare}</span>
                        <span className="text-xs text-[#667085] block">
                          {leg.durationMinutes} mins
                        </span>
                      </div>
                    </div>

                    {/* Departure / Arrival pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[#E4E7EC] text-xs">
                      <div>
                        <span className="text-[#667085] block text-[10px]">Departure</span>
                        <span className="font-bold text-[#101828]">{leg.departureTime}</span>
                      </div>
                      <div>
                        <span className="text-[#667085] block text-[10px]">Arrival</span>
                        <span className="font-bold text-[#101828]">{leg.arrivalTime}</span>
                      </div>
                      <div>
                        <span className="text-[#667085] block text-[10px]">Safety Score</span>
                        <span className="font-bold text-[#15803D]">★ {leg.safetyScore}/100</span>
                      </div>
                      <div>
                        <span className="text-[#667085] block text-[10px]">Crowd Density</span>
                        <span className="font-bold text-[#101828]">{leg.crowdDensity}</span>
                      </div>
                    </div>

                    {/* Transfer info & safety amenities */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {leg.safetyFeatures.map((feature, fIdx) => (
                          <span
                            key={fIdx}
                            className="inline-flex items-center gap-1 text-[11px] font-medium bg-white text-[#15803D] border border-emerald-200 px-2.5 py-0.5 rounded-full"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{feature}</span>
                          </span>
                        ))}
                      </div>

                      {leg.transferWaitMinutes ? (
                        <div className="flex items-center gap-1 text-xs text-[#B45309] font-medium bg-amber-50 px-2.5 py-1 rounded-lg">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Transfer buffer: {leg.transferWaitMinutes} mins</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
