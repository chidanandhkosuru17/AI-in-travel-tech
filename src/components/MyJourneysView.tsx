import React from 'react';
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ArrowRight,
  Download,
  Share2,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';

export const MyJourneysView: React.FC = () => {
  const { bookings, setCurrentView, triggerEmergencySos, toggleLiveSharing, isLiveSharingActive } = useTravel();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">My Journeys & Tickets</h2>
        <p className="text-sm text-[#667085] mt-1">
          Access your digital multimodal boarding passes, PNR status, and verified travel receipts.
        </p>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking.bookingId}
            className="bg-white rounded-3xl border border-[#E4E7EC] shadow-lg overflow-hidden"
          >
            {/* Header banner */}
            <div className="bg-[#101828] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0057FF] flex items-center justify-center font-bold text-white shadow-md">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-bold bg-white/10 px-2.5 py-0.5 rounded-full text-blue-300">
                      Confirmed Multimodal Ticket
                    </span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      {booking.status}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mt-1">
                    {booking.itinerary.origin} → {booking.itinerary.destination}
                  </h3>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-gray-300 block">PNR Number</span>
                <span className="font-mono text-base font-extrabold text-white">{booking.pnr}</span>
              </div>
            </div>

            {/* Content info */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs p-4 rounded-2xl bg-[#F8F7F4] border border-[#E4E7EC]">
                <div>
                  <span className="text-[#667085] block text-[10px]">Passenger</span>
                  <span className="font-bold text-[#101828]">{booking.passengerName}</span>
                </div>
                <div>
                  <span className="text-[#667085] block text-[10px]">Departure</span>
                  <span className="font-bold text-[#101828]">{booking.itinerary.departureTime}</span>
                </div>
                <div>
                  <span className="text-[#667085] block text-[10px]">Paid Amount</span>
                  <span className="font-bold text-[#0057FF]">₹{booking.totalPaid} ({booking.paymentMethod})</span>
                </div>
                <div>
                  <span className="text-[#667085] block text-[10px]">Safety Sentinel</span>
                  <span className="font-bold text-[#15803D]">★ {booking.itinerary.overallSafetyScore}/100</span>
                </div>
              </div>

              {/* Legs summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#101828] mb-3">
                  Reserved Multimodal Legs
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {booking.itinerary.legs.map((leg, i) => (
                    <div key={leg.id} className="p-3.5 rounded-xl border border-[#E4E7EC] bg-white text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#0057FF]">Leg {i + 1}: {leg.mode.toUpperCase()}</span>
                        <span className="text-[10px] bg-[#F8F7F4] px-1.5 py-0.5 rounded text-[#667085]">
                          {leg.durationMinutes}m
                        </span>
                      </div>
                      <p className="font-semibold text-[#101828] truncate">{leg.operatorName}</p>
                      <p className="text-[11px] text-[#667085] truncate mt-0.5">{leg.from} → {leg.to}</p>
                      <div className="mt-2 pt-2 border-t border-[#E4E7EC] text-[10px] text-[#15803D] font-medium">
                        ✓ Seat Allotted: {booking.seatSelections[i]?.seat || 'Reserved'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions footer */}
              <div className="pt-4 border-t border-[#E4E7EC] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView('safety')}
                    className="px-4 py-2 rounded-xl bg-[#EAF0FF] text-[#0057FF] text-xs font-bold hover:bg-[#d8e5ff] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Live Sentinel Tracking</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('disruption')}
                    className="px-4 py-2 rounded-xl bg-amber-50 text-[#B45309] border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Test Disruption Engine</span>
                  </button>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl border border-[#E4E7EC] text-[#101828] text-xs font-semibold hover:bg-[#F8F7F4] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-[#667085]" />
                  <span>Download Boarding Pass</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
