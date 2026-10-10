import React, { useState } from 'react';
import { Bus, Train, Navigation, Shield, CheckCircle2, Info, MapPin } from 'lucide-react';
import { MultimodalItinerary, JourneyLeg } from '../types/travel';

interface MultimodalRouteMapProps {
  itinerary: MultimodalItinerary;
  onSelectLeg?: (leg: JourneyLeg) => void;
}

export const MultimodalRouteMap: React.FC<MultimodalRouteMapProps> = ({ itinerary, onSelectLeg }) => {
  const [activeLegIndex, setActiveLegIndex] = useState<number>(0);

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'train':
        return Train;
      case 'bus':
        return Bus;
      default:
        return Navigation;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E4E7EC] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0057FF]" />
            <h4 className="text-sm font-bold text-[#101828]">Interactive Multimodal Route Topology</h4>
          </div>
          <p className="text-xs text-[#667085]">
            Verified corridor: <span className="font-semibold text-[#101828]">{itinerary.origin}</span> →{' '}
            <span className="font-semibold text-[#101828]">{itinerary.destination}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-[#EAF0FF] text-[#0057FF] font-bold">
            {itinerary.legs.length} Segments • {itinerary.transfersCount} Transfers
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#15803D] font-bold">
            {itinerary.overallSafetyScore}/100 Safety
          </span>
        </div>
      </div>

      {/* Visual SVG Map Diagram */}
      <div className="py-6 px-2 sm:px-4">
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1.5 bg-[#E4E7EC] rounded-full hidden md:block">
            <div
              className="h-full bg-[#0057FF] rounded-full transition-all duration-500"
              style={{
                width: `${((activeLegIndex + 1) / itinerary.legs.length) * 100}%`,
              }}
            />
          </div>

          {/* Stepper nodes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {itinerary.legs.map((leg, idx) => {
              const Icon = getModeIcon(leg.mode);
              const isSelected = activeLegIndex === idx;

              return (
                <div
                  key={leg.id}
                  onClick={() => {
                    setActiveLegIndex(idx);
                    if (onSelectLeg) onSelectLeg(leg);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#EAF0FF] border-[#0057FF] shadow-lg shadow-[#0057FF]/15 scale-[1.02]'
                      : 'bg-[#F8F7F4] border-[#E4E7EC] hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-[#0057FF] text-white' : 'bg-white text-[#101828] border border-[#E4E7EC]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#101828]">
                        Leg {idx + 1}: {leg.mode}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#0057FF]">₹{leg.fare}</span>
                  </div>

                  <p className="text-xs font-semibold text-[#101828] line-clamp-1">{leg.from}</p>
                  <p className="text-[11px] text-[#667085] flex items-center gap-1 mt-0.5">
                    <span>↓</span>
                    <span className="line-clamp-1">{leg.to}</span>
                  </p>

                  <div className="mt-3 pt-2 border-t border-[#E4E7EC]/60 flex items-center justify-between text-[11px]">
                    <span className="text-[#667085]">
                      {leg.departureTime} - {leg.arrivalTime} ({leg.durationMinutes}m)
                    </span>
                    <span className="font-semibold text-[#15803D]">★ {leg.safetyScore}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Leg Deep-Dive Card */}
      {itinerary.legs[activeLegIndex] && (
        <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#E4E7EC]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#0057FF]">
                Selected Transit Leg Details
              </span>
              <h5 className="text-sm font-bold text-[#101828]">
                {itinerary.legs[activeLegIndex].operatorName}
              </h5>
            </div>
            <div className="flex items-center gap-2">
              {itinerary.legs[activeLegIndex].vehicleNumber && (
                <span className="text-xs font-semibold bg-white border border-[#E4E7EC] px-2 py-0.5 rounded-lg text-[#101828]">
                  ID: {itinerary.legs[activeLegIndex].vehicleNumber}
                </span>
              )}
              <span className="text-xs font-semibold bg-white border border-[#E4E7EC] px-2 py-0.5 rounded-lg text-[#101828]">
                Seat: {itinerary.legs[activeLegIndex].seatType || 'Reserved'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-[#E4E7EC]">
              <span className="text-[#667085] block text-[10px]">Segment Fare</span>
              <span className="font-bold text-[#101828]">₹{itinerary.legs[activeLegIndex].fare}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#E4E7EC]">
              <span className="text-[#667085] block text-[10px]">Transfer Wait</span>
              <span className="font-bold text-[#101828]">
                {itinerary.legs[activeLegIndex].transferWaitMinutes || 0} mins
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#E4E7EC]">
              <span className="text-[#667085] block text-[10px]">Walk to Platform</span>
              <span className="font-bold text-[#101828]">
                {itinerary.legs[activeLegIndex].walkingDistanceMeters || 60}m
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#E4E7EC]">
              <span className="text-[#667085] block text-[10px]">Terminal Crowd</span>
              <span className="font-bold text-[#101828]">{itinerary.legs[activeLegIndex].crowdDensity}</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {itinerary.legs[activeLegIndex].safetyFeatures.map((feat, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#15803D] font-medium border border-emerald-100"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>{feat}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
