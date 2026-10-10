import React, { useState } from 'react';
import {
  PackageSearch,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  MapPin,
  KeyRound,
  Bus,
  ArrowRight,
  ExternalLink,
  Lock,
  Phone,
  Compass,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { OpenStreetMap } from './OpenStreetMap';
import { LostLuggageItem, LuggageStatus } from '../types/travel';

export const LostLuggageView: React.FC = () => {
  const { lostLuggageItems, confirmLuggageClaim, setCurrentView, user } = useTravel();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemForClaim, setSelectedItemForClaim] = useState<LostLuggageItem | null>(null);
  const [verificationNote, setVerificationNote] = useState('');

  const filteredItems = lostLuggageItems.filter(
    (item) =>
      item.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForClaim) return;

    confirmLuggageClaim(selectedItemForClaim.id, true, verificationNote);
    setSelectedItemForClaim(null);
    setVerificationNote('');
  };

  const getStatusBadge = (status: LuggageStatus) => {
    switch (status) {
      case 'Reported':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Photo Uploaded':
        return 'bg-blue-50 text-[#0057FF] border-blue-200';
      case 'Awaiting Passenger Confirmation':
        return 'bg-amber-50 text-[#B45309] border-amber-300';
      case 'Claimed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Return Coordinated':
        return 'bg-emerald-50 text-[#15803D] border-emerald-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E4E7EC]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF0FF] text-[#0057FF] text-xs font-bold mb-2">
            <PackageSearch className="w-3.5 h-3.5" />
            <span>Luggage Recovery Sentinel</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
            Lost Luggage Recovery & Tracking
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Real-time notifications for found baggage on your buses, confidential ownership confirmation, and depot navigation via OpenStreetMap.
          </p>
        </div>

        {/* Shortcut to Driver Portal */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('driver-portal')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F8F7F4] border border-[#E4E7EC] text-[#101828] text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Bus className="w-4 h-4 text-[#0057FF]" />
            <span>Driver Portal Demo</span>
          </button>
        </div>
      </div>

      {/* Safety & Confidentiality Assurance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EAF0FF] text-[#0057FF] flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#101828]">Strict Privacy Guarantee</h4>
            <p className="text-[11px] text-[#667085] mt-0.5">
              Passenger contact information, phone numbers, and full identities are never revealed to bus drivers or fellow passengers.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#15803D] flex items-center justify-center shrink-0">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#101828]">Secure Pickup PIN (OTP)</h4>
            <p className="text-[11px] text-[#667085] mt-0.5">
              Verified claims generate a unique 4-digit PIN required for physical baggage handover at the transport depot.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E4E7EC] shadow-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0057FF] flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#101828]">OpenStreetMap Navigation</h4>
            <p className="text-[11px] text-[#667085] mt-0.5">
              Get turn-by-turn driving directions to the bus terminal safe locker using open-source OpenStreetMap.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#667085]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by tracking number (e.g. ROAM-BAG-7829), bus number, route, or item keywords..."
          className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#E4E7EC] bg-white focus:outline-none focus:border-[#0057FF] focus:ring-2 focus:ring-[#0057FF]/20 text-[#101828] shadow-sm"
        />
      </div>

      {/* Items Registry List */}
      <div className="space-y-6">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#E4E7EC]">
            <PackageSearch className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-[#101828]">No luggage items match your search.</h4>
            <p className="text-xs text-[#667085] mt-1">Try searching by bus number or route name.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6 sm:p-8 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E4E7EC]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EAF0FF] text-[#0057FF] flex items-center justify-center shrink-0">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-extrabold text-[#101828]">
                        {item.trackingNumber}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#667085] mt-0.5">
                      Bus: <strong className="text-[#101828]">{item.busNumber}</strong> ({item.operatorName}) • {item.route}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-[#667085] block">Reported by Driver</span>
                  <span className="text-xs font-bold text-[#101828]">{item.driverName}</span>
                </div>
              </div>

              {/* Status Stepper Tracker */}
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#667085] block mb-2">
                  Recovery Status Tracking:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  {[
                    'Reported',
                    'Photo Uploaded',
                    'Awaiting Passenger Confirmation',
                    'Claimed',
                    'Return Coordinated',
                  ].map((stepName, sIdx) => {
                    const currentIndex = [
                      'Reported',
                      'Photo Uploaded',
                      'Awaiting Passenger Confirmation',
                      'Claimed',
                      'Return Coordinated',
                    ].indexOf(item.status);

                    const isPast = currentIndex >= sIdx;
                    const isCurrent = currentIndex === sIdx;

                    return (
                      <div
                        key={sIdx}
                        className={`p-2.5 rounded-xl border text-[11px] font-bold ${
                          isCurrent
                            ? 'bg-[#0057FF] text-white border-[#0057FF] shadow-sm'
                            : isPast
                            ? 'bg-blue-50 text-[#0057FF] border-blue-200'
                            : 'bg-[#F8F7F4] text-gray-400 border-[#E4E7EC]'
                        }`}
                      >
                        <span className="block text-[9px] uppercase tracking-wider">Step {sIdx + 1}</span>
                        <span className="truncate block">{stepName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Luggage Details & OpenStreetMap Navigation Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left 6 Columns: Image & Description */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border border-[#E4E7EC]">
                    <img
                      src={item.photoUrl}
                      alt="Luggage photo"
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      Location Found: {item.seatNumber || 'Bus Cabin'}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#E4E7EC] text-xs space-y-1">
                    <span className="font-bold text-[#101828] block">Description & Markings:</span>
                    <p className="text-[#667085] leading-relaxed">{item.description}</p>
                  </div>

                  {/* Confirmation actions if still awaiting confirmation */}
                  {item.status === 'Awaiting Passenger Confirmation' && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#B45309]">
                        <PackageSearch className="w-4 h-4" />
                        <span>Is this luggage yours?</span>
                      </div>
                      <p className="text-[11px] text-[#667085]">
                        Confirming allows you to view the custody pickup PIN and coordinate collection at the bus depot.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedItemForClaim(item)}
                          className="flex-1 py-2.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Yes, this is mine
                        </button>
                        <button
                          onClick={() => confirmLuggageClaim(item.id, false)}
                          className="px-4 py-2.5 rounded-xl bg-white border border-[#E4E7EC] text-[#101828] text-xs font-semibold hover:bg-gray-100 transition-all cursor-pointer"
                        >
                          Not mine
                        </button>
                      </div>
                    </div>
                  )}

                  {/* If claimed: Show OTP & Coordination info */}
                  {item.status === 'Claimed' || item.status === 'Return Coordinated' ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                          <span>Ownership Verified</span>
                        </span>
                        <div className="bg-white border border-emerald-300 px-3 py-1 rounded-xl font-mono text-emerald-900 font-black text-sm">
                          Pickup OTP: {item.pickupOtp}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#475467] leading-relaxed">
                        Present this 4-digit PIN to the depot security desk for custody handover.
                      </p>
                      {item.coordinationNotes && (
                        <p className="text-[11px] text-emerald-800 font-semibold pt-1 border-t border-emerald-200">
                          Coordination: {item.coordinationNotes}
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Right 6 Columns: Interactive OpenStreetMap Depot Navigation */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#101828] flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#0057FF]" />
                      <span>Depot Location & OpenStreetMap Navigation</span>
                    </span>
                    <span className="text-[11px] text-[#667085]">Safe Locker Custody</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8F7F4] border border-[#E4E7EC] text-xs">
                    <h5 className="font-bold text-[#101828]">{item.depotName}</h5>
                    <p className="text-[#667085] text-[11px] mt-0.5">{item.depotAddress}</p>
                  </div>

                  {/* Embedded OpenStreetMap Component */}
                  <OpenStreetMap
                    center={item.depotCoordinates}
                    markerTitle={item.depotName}
                    markerDescription={`Safe Locker Custody for ${item.trackingNumber}`}
                    depotAddress={item.depotAddress}
                    busNumber={item.busNumber}
                    className="h-64 w-full rounded-2xl"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Verification Modal */}
      {selectedItemForClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E4E7EC] p-6 sm:p-8">
            <h3 className="text-xl font-bold text-[#101828] mb-1">Confirm Ownership</h3>
            <p className="text-xs text-[#667085] mb-4">
              Item #{selectedItemForClaim.trackingNumber} on Bus {selectedItemForClaim.busNumber}
            </p>

            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#101828] mb-1">
                  Describe any unique items inside to verify ownership
                </label>
                <textarea
                  rows={3}
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  placeholder="e.g. Contains a black Dell laptop, water bottle, and a diary with my name..."
                  required
                  className="w-full p-3 text-xs rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] text-[#101828]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Confirm Claim & Get Pickup OTP
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedItemForClaim(null)}
                  className="px-4 py-3 rounded-xl bg-[#F8F7F4] text-[#667085] text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
