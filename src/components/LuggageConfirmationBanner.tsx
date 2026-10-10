import React, { useState } from 'react';
import {
  PackageSearch,
  Check,
  X,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Clock,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { LostLuggageItem } from '../types/travel';

export const LuggageConfirmationBanner: React.FC = () => {
  const { lostLuggageItems, confirmLuggageClaim, setCurrentView } = useTravel();

  // Find the first luggage item awaiting passenger confirmation
  const pendingLuggage = lostLuggageItems.find(
    (item) => item.status === 'Awaiting Passenger Confirmation'
  );

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [verificationNote, setVerificationNote] = useState('');
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  if (!pendingLuggage || dismissedId === pendingLuggage.id) return null;

  const handleYesClick = () => {
    setIsClaimModalOpen(true);
  };

  const handleNoClick = () => {
    setDismissedId(pendingLuggage.id);
    confirmLuggageClaim(pendingLuggage.id, false);
  };

  const handleConfirmClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confirmLuggageClaim(pendingLuggage.id, true, verificationNote);
    setIsClaimModalOpen(false);
    setCurrentView('luggage');
  };

  return (
    <>
      {/* Floating Interactive In-App Confirmation Banner */}
      <aside aria-label="Lost Luggage Inquiry" className="fixed bottom-5 right-4 sm:right-6 z-40 max-w-md w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border-2 border-[#0057FF] p-5 animate-in slide-in-from-bottom-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EAF0FF] text-[#0057FF] flex items-center justify-center shrink-0">
              <PackageSearch className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0057FF] text-white px-2 py-0.5 rounded-full">
                Action Required
              </span>
              <h4 className="text-sm font-extrabold text-[#101828] mt-0.5">
                Is this your luggage?
              </h4>
            </div>
          </div>

          <button
            onClick={handleNoClick}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
            title="Dismiss inquiry"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Luggage Details & Photo Preview */}
        <div className="flex gap-3 bg-[#F8F7F4] p-3 rounded-2xl border border-[#E4E7EC] mb-3">
          <img
            src={pendingLuggage.photoUrl}
            alt="Found luggage"
            className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#E4E7EC] shadow-sm"
          />
          <div className="flex-1 min-w-0 text-xs">
            <span className="font-bold text-[#0057FF] block">
              Bus {pendingLuggage.busNumber} ({pendingLuggage.seatNumber || 'Overhead'})
            </span>
            <p className="text-[#101828] font-medium line-clamp-2 mt-0.5 text-[11px] leading-snug">
              {pendingLuggage.description}
            </p>
            <span className="text-[10px] text-[#667085] flex items-center gap-1 mt-1 truncate">
              <MapPin className="w-3 h-3 text-[#0057FF] shrink-0" />
              <span>Safe at {pendingLuggage.depotName}</span>
            </span>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center gap-1 text-[10px] text-[#667085] mb-3 bg-blue-50/60 p-2 rounded-xl">
          <Lock className="w-3 h-3 text-[#0057FF] shrink-0" />
          <span>Your contact info is strictly confidential and never shared with drivers.</span>
        </div>

        {/* Interactive Choice Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleYesClick}
            className="py-2.5 px-3 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold shadow-md shadow-[#0057FF]/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Yes, this is mine</span>
          </button>

          <button
            onClick={handleNoClick}
            className="py-2.5 px-3 rounded-xl bg-white hover:bg-gray-100 text-[#101828] border border-[#E4E7EC] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-gray-500" />
            <span>No, not mine</span>
          </button>
        </div>
      </aside>

      {/* Claim Verification Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E4E7EC] p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsClaimModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#667085] hover:text-[#101828] hover:bg-[#F8F7F4] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#15803D] px-2 py-0.5 rounded-full border border-emerald-200">
                Secure Handover Protocol
              </span>
              <h3 className="text-xl font-extrabold text-[#101828] mt-1.5">
                Confirm Luggage Ownership
              </h3>
              <p className="text-xs text-[#667085] mt-1">
                For passenger security, please provide a unique identifying detail (e.g. items inside, brand tag, or lock code).
              </p>
            </div>

            {/* Item Summary */}
            <div className="flex gap-3 bg-[#F8F7F4] p-3 rounded-2xl border border-[#E4E7EC] mb-4">
              <img
                src={pendingLuggage.photoUrl}
                alt="Luggage"
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="text-xs">
                <span className="font-bold text-[#101828] block">
                  Tracking #: {pendingLuggage.trackingNumber}
                </span>
                <span className="text-[#667085] text-[11px] block mt-0.5">
                  Bus: {pendingLuggage.busNumber} • {pendingLuggage.route}
                </span>
                <span className="text-[#15803D] font-semibold text-[11px] block mt-1">
                  Safe Custody: {pendingLuggage.depotName}
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmClaimSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#101828] mb-1.5">
                  Identifying Item Details / Contents
                </label>
                <textarea
                  rows={3}
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  placeholder="e.g. Contains a blue laptop sleeve, grey jacket, and books..."
                  required
                  className="w-full p-3 text-xs rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] text-[#101828]"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-[#0057FF] space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Privacy & Verification Guarantee</span>
                </div>
                <p className="text-[11px] text-[#475467] leading-relaxed">
                  Upon confirmation, an authenticated <strong>4-digit Pickup PIN</strong> will be generated for safe locker collection. Your full contact details will remain masked.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0057FF]/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Authorize Claim & Generate Pickup PIN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
