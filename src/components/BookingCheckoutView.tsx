import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  User,
  Phone,
  ArrowRight,
  Printer,
  Download,
  AlertCircle,
  Clock,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { BookingDetails } from '../types/travel';

export const BookingCheckoutView: React.FC = () => {
  const { selectedItinerary, createBooking, setCurrentView, user } = useTravel();

  const [passengerName, setPassengerName] = useState(user?.name || 'Chidanandh Kosuru');
  const [passengerAge, setPassengerAge] = useState('27');
  const [passengerGender, setPassengerGender] = useState('Male');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98765 43210 (Sister)');
  const [paymentMethod, setPaymentMethod] = useState<'UPI Demo' | 'Card Demo' | 'Cash on Boarding'>('UPI Demo');
  const [humanApproved, setHumanApproved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingDetails | null>(null);

  // Fare calculations
  const baseFare = selectedItinerary.totalFare;
  const platformFee = 25;
  const transitInsurance = 15;
  const totalPayable = baseFare + platformFee + transitInsurance;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanApproved) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const booking = createBooking(
        passengerName,
        parseInt(passengerAge, 10) || 25,
        passengerGender,
        emergencyPhone,
        paymentMethod
      );
      setConfirmedBooking(booking);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 900);
  };

  // If already confirmed, render Digital Boarding Pass
  if (confirmedBooking) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="bg-white rounded-3xl border border-[#E4E7EC] shadow-2xl overflow-hidden print:border-none print:shadow-none">
          {/* Top Banner */}
          <div className="bg-[#101828] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0057FF] flex items-center justify-center font-extrabold text-white text-xl shadow-lg">
                TBS
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0057FF]/30 text-[#60A5FA] px-2.5 py-0.5 rounded-full border border-blue-400/30">
                  Multimodal Boarding Pass
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-1">Confirmed Itinerary</h3>
                <p className="text-xs text-gray-300">PNR: <span className="font-mono font-bold text-white">{confirmedBooking.pnr}</span> • Booking ID: {confirmedBooking.bookingId}</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold px-3 py-1 rounded-full inline-block">
                ✓ Human Approved & Paid
              </span>
              <p className="text-[11px] text-gray-400 mt-1">{confirmedBooking.createdAt}</p>
            </div>
          </div>

          {/* Boarding Pass Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Passenger & Origin Destination Header */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#F8F7F4] border border-[#E4E7EC]">
              <div>
                <span className="text-[10px] text-[#667085] uppercase tracking-wider font-bold block">Passenger</span>
                <span className="text-sm font-bold text-[#101828]">{confirmedBooking.passengerName}</span>
                <span className="text-xs text-[#667085] block">{confirmedBooking.passengerAge} yrs • {confirmedBooking.passengerGender}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#667085] uppercase tracking-wider font-bold block">Route</span>
                <span className="text-sm font-bold text-[#0057FF]">{confirmedBooking.itinerary.origin}</span>
                <span className="text-xs text-[#667085] block">→ {confirmedBooking.itinerary.destination}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#667085] uppercase tracking-wider font-bold block">Emergency Contact</span>
                <span className="text-sm font-bold text-[#101828]">{confirmedBooking.emergencyContact}</span>
                <span className="text-xs text-[#15803D] block">● GPS Link Broadcast</span>
              </div>
            </div>

            {/* Multimodal Legs List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#101828]">Journey Legs & Seat Allotments</h4>
              {confirmedBooking.itinerary.legs.map((leg, idx) => (
                <div key={leg.id} className="p-4 rounded-xl border border-[#E4E7EC] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#EAF0FF] text-[#0057FF] flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-[#101828]">{leg.mode.toUpperCase()}: {leg.operatorName}</span>
                      <p className="text-xs text-[#667085]">{leg.from} → {leg.to} ({leg.departureTime} - {leg.arrivalTime})</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold text-[#0057FF] bg-[#EAF0FF] px-2.5 py-1 rounded-md">
                      {confirmedBooking.seatSelections[idx]?.seat || 'Reserved Seat'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* QR Code & Safety Verification */}
            <div className="p-5 rounded-2xl bg-[#EAF0FF]/50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0057FF]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>RoamAgent Verified Sentinel Boarding Token</span>
                </div>
                <p className="text-xs text-[#667085] max-w-md">
                  Show this digital pass to bus conductors, TTE rail ticket examiners, or metro turnstiles. Real-time GPS sharing has been activated.
                </p>
                <p className="text-[10px] text-[#667085] font-mono mt-1">{confirmedBooking.qrCodeToken}</p>
              </div>

              {/* Simulated QR Code box */}
              <div className="w-24 h-24 bg-white p-2 rounded-2xl border-2 border-[#0057FF] flex flex-col items-center justify-center shrink-0 shadow-md">
                <QrCode className="w-16 h-16 text-[#101828]" />
                <span className="text-[8px] font-mono font-bold text-[#0057FF]">VALID TICKET</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E4E7EC]">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl border border-[#E4E7EC] bg-white hover:bg-[#F8F7F4] text-xs font-semibold text-[#101828] flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-[#667085]" />
                <span>Print Ticket</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('my-journeys');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-2.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold shadow-md shadow-[#0057FF]/25 flex items-center gap-2 cursor-pointer"
              >
                <span>View in My Journeys</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
          Review & Human-Approved Booking
        </h2>
        <p className="text-sm text-[#667085] mt-1">
          Verify passenger details, review multimodal fare breakdown, and explicitly authorize the transaction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Passenger Details & Human Approval */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6 sm:p-8 space-y-6">
          <form onSubmit={handleConfirmBooking} className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#101828] mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#0057FF]" />
                <span>Passenger Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#101828] mb-1.5">Primary Passenger Name</label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] text-[#101828]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#101828] mb-1.5">Age</label>
                  <input
                    type="number"
                    value={passengerAge}
                    onChange={(e) => setPassengerAge(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] text-[#101828]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#101828] mb-1.5">Gender</label>
                  <select
                    value={passengerGender}
                    onChange={(e) => setPassengerGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] text-[#101828]"
                  >
                    <option value="Female">Female (Eligible for Women Safe Berths)</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#101828] mb-1.5">Emergency Contact Number</label>
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] text-[#101828]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Options (Demo Supported) */}
            <div className="pt-4 border-t border-[#E4E7EC]">
              <h3 className="text-base font-bold text-[#101828] mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0057FF]" />
                <span>Demonstration Payment Mode</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI Demo')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'UPI Demo'
                      ? 'border-[#0057FF] bg-[#EAF0FF] text-[#0057FF] ring-2 ring-[#0057FF]/20 font-bold'
                      : 'border-[#E4E7EC] bg-[#F8F7F4] text-[#101828]'
                  }`}
                >
                  <QrCode className="w-5 h-5 mb-1 text-[#0057FF]" />
                  <span className="text-xs block font-bold">UPI Demo</span>
                  <span className="text-[10px] text-[#667085]">GPay / PhonePe simulation</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card Demo')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'Card Demo'
                      ? 'border-[#0057FF] bg-[#EAF0FF] text-[#0057FF] ring-2 ring-[#0057FF]/20 font-bold'
                      : 'border-[#E4E7EC] bg-[#F8F7F4] text-[#101828]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-1 text-[#0057FF]" />
                  <span className="text-xs block font-bold">Card Demo</span>
                  <span className="text-[10px] text-[#667085]">Simulated test card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Boarding')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'Cash on Boarding'
                      ? 'border-[#0057FF] bg-[#EAF0FF] text-[#0057FF] ring-2 ring-[#0057FF]/20 font-bold'
                      : 'border-[#E4E7EC] bg-[#F8F7F4] text-[#101828]'
                  }`}
                >
                  <Banknote className="w-5 h-5 mb-1 text-[#0057FF]" />
                  <span className="text-xs block font-bold">Pay on Boarding</span>
                  <span className="text-[10px] text-[#667085]">Cash at vehicle</span>
                </button>
              </div>
            </div>

            {/* Human-in-the-loop explicit consent */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={humanApproved}
                  onChange={(e) => setHumanApproved(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-amber-300 text-[#0057FF] focus:ring-[#0057FF] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-semibold text-[#101828] leading-relaxed">
                  <strong>Human-in-the-Loop Explicit Authorization:</strong> I have reviewed the multimodal itinerary, transfer buffers, and fare breakdown. I approve RoamAgent to lock the reservations and activate live safety monitoring.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!humanApproved || isProcessing}
              className="w-full py-4 rounded-2xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-sm font-bold shadow-xl shadow-[#0057FF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Locking Multimodal Seats...</span>
                </span>
              ) : (
                <span>Approve & Complete Booking (₹{totalPayable})</span>
              )}
            </button>
          </form>
        </div>

        {/* Right 5 Cols: Itinerary Summary & Fare Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-[#E4E7EC]">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#0057FF] bg-[#EAF0FF] px-2.5 py-0.5 rounded-full">
              {selectedItinerary.badgeLabel}
            </span>
            <h3 className="text-lg font-bold text-[#101828] mt-1.5">{selectedItinerary.title}</h3>
            <p className="text-xs text-[#667085]">{selectedItinerary.origin} → {selectedItinerary.destination}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#667085]">Multimodal Leg Breakdown</h4>
            {selectedItinerary.legs.map((leg, i) => (
              <div key={leg.id} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-[#F8F7F4] border border-[#E4E7EC]">
                <div>
                  <span className="font-bold text-[#101828]">{leg.mode.toUpperCase()}: </span>
                  <span className="text-[#667085]">{leg.operatorName}</span>
                </div>
                <span className="font-bold text-[#0057FF]">₹{leg.fare}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E4E7EC] space-y-2 text-xs">
            <div className="flex justify-between text-[#667085]">
              <span>Base Transit Fares</span>
              <span>₹{baseFare}</span>
            </div>
            <div className="flex justify-between text-[#667085]">
              <span>Platform & Sync Fee</span>
              <span>₹{platformFee}</span>
            </div>
            <div className="flex justify-between text-[#667085]">
              <span>Women Safety Sentinel Insurance</span>
              <span>₹{transitInsurance}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-[#101828] pt-2 border-t border-[#E4E7EC]">
              <span>Total Payable</span>
              <span className="text-[#0057FF]">₹{totalPayable}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
