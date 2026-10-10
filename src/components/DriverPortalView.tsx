import React, { useState } from 'react';
import {
  Bus,
  Camera,
  Upload,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  PackageSearch,
  Eye,
  KeyRound,
  FileText,
  Navigation,
  Send,
  UserCheck,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { SAMPLE_LUGGAGE_PHOTOS, DRIVER_PROFILES } from '../data/mockTravelData';
import { OpenStreetMap } from './OpenStreetMap';
import { LuggageStatus, LostLuggageItem } from '../types/travel';

export const DriverPortalView: React.FC = () => {
  const {
    activeDriver,
    setActiveDriver,
    lostLuggageItems,
    reportFoundLuggage,
    updateLuggageStatus,
    setCurrentView,
  } = useTravel();

  // Form states
  const [busNumber, setBusNumber] = useState(activeDriver.assignedBusNumber);
  const [route, setRoute] = useState(activeDriver.currentRoute);
  const [seatNumber, setSeatNumber] = useState('Seat 12');
  const [description, setDescription] = useState('');
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState(SAMPLE_LUGGAGE_PHOTOS[0].url);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [selectedDepot, setSelectedDepot] = useState({
    name: 'Panaji KTC Central Bus Terminal (Locker Bay 4)',
    address: 'Kadamba Transport Corporation, Patto Plaza, Panaji, Goa 403001',
    coordinates: { lat: 15.4989, lng: 73.834 },
  });

  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [selectedLuggageForCoordination, setSelectedLuggageForCoordination] =
    useState<LostLuggageItem | null>(null);
  const [coordinationNote, setCoordinationNote] = useState('');
  const [returnMethod, setReturnMethod] = useState<'depot_pickup' | 'terminal_helpdesk' | 'courier_dispatch'>(
    'depot_pickup'
  );

  const depotsList = [
    {
      name: 'Panaji KTC Central Bus Terminal (Locker Bay 4)',
      address: 'Kadamba Transport Corporation, Patto Plaza, Panaji, Goa 403001',
      coordinates: { lat: 15.4989, lng: 73.834 },
    },
    {
      name: 'Hubballi Central Bus Terminal (Safe Custody Vault)',
      address: 'NWKRTC Depot, Gokul Road, Hubballi, Karnataka 580030',
      coordinates: { lat: 15.3587, lng: 75.1328 },
    },
    {
      name: 'MGBS Intercity Bus Station Lost Property Office',
      address: 'Mahatma Gandhi Bus Station, Gowliguda, Hyderabad, Telangana 500012',
      coordinates: { lat: 17.3789, lng: 78.4842 },
    },
  ];

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const photoToUse = customPhotoUrl.trim() || selectedPhotoUrl;

    const created = reportFoundLuggage({
      busNumber,
      route,
      seatNumber,
      description,
      photoUrl: photoToUse,
      depotName: selectedDepot.name,
      depotAddress: selectedDepot.address,
      depotCoordinates: selectedDepot.coordinates,
    });

    setFormSuccess(
      `Luggage reported successfully! Item Tracking ID: ${created.trackingNumber}. In-app notification dispatched to passengers.`
    );
    setDescription('');
    setTimeout(() => setFormSuccess(null), 6000);
  };

  const handleCoordinationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLuggageForCoordination) return;

    updateLuggageStatus(
      selectedLuggageForCoordination.id,
      'Return Coordinated',
      coordinationNote || `Handover scheduled via ${returnMethod.replace('_', ' ')}`
    );

    setSelectedLuggageForCoordination(null);
    setCoordinationNote('');
  };

  const getStatusBadge = (status: LuggageStatus) => {
    switch (status) {
      case 'Reported':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Photo Uploaded':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Awaiting Passenger Confirmation':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Claimed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Return Coordinated':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Driver Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E4E7EC]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF0FF] text-[#0057FF] text-xs font-bold mb-2">
            <Bus className="w-3.5 h-3.5" />
            <span>Driver Portal & Custody Sentinel</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
            Lost Luggage Driver Management
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Log found baggage, upload verified photos, and safely coordinate handovers without exposing passenger personal data.
          </p>
        </div>

        {/* Driver Profile Switcher Pill */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-[#E4E7EC] shadow-sm">
          <img
            src={activeDriver.avatarUrl}
            alt={activeDriver.name}
            className="w-12 h-12 rounded-xl object-cover border border-[#0057FF]"
          />
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#101828]">{activeDriver.name}</span>
              <span className="text-[10px] bg-emerald-50 text-[#15803D] font-bold px-1.5 py-0.2 rounded">
                Verified Driver
              </span>
            </div>
            <p className="text-[#667085] text-[11px]">{activeDriver.operator}</p>
            <p className="text-[#0057FF] font-semibold text-[10px]">Bus: {activeDriver.assignedBusNumber}</p>
          </div>

          <div className="border-l border-[#E4E7EC] pl-3 ml-2">
            <select
              value={activeDriver.id}
              onChange={(e) => {
                const found = DRIVER_PROFILES.find((d) => d.id === e.target.value);
                if (found) {
                  setActiveDriver(found);
                  setBusNumber(found.assignedBusNumber);
                  setRoute(found.currentRoute);
                }
              }}
              className="text-xs bg-[#F8F7F4] border border-[#E4E7EC] rounded-lg p-1.5 font-medium text-[#101828]"
            >
              {DRIVER_PROFILES.map((drv) => (
                <option key={drv.id} value={drv.id}>
                  Switch: {drv.name} ({drv.assignedBusNumber})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {formSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-[#15803D] font-semibold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* Main Grid: Report Form on Left, Active Inventory on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 6 Columns: Report Form */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EAF0FF] text-[#0057FF] flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#101828]">Report Found Luggage</h3>
                <p className="text-[11px] text-[#667085]">Notify passengers on this bus route instantly</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0057FF] bg-[#EAF0FF] px-2.5 py-0.5 rounded-full">
              Driver Input
            </span>
          </div>

          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#101828] mb-1">Bus Number</label>
                <input
                  type="text"
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] text-[#101828] font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#101828] mb-1">
                  Seat Number (Optional)
                </label>
                <input
                  type="text"
                  value={seatNumber}
                  onChange={(e) => setSeatNumber(e.target.value)}
                  placeholder="e.g. Seat 12 or Overhead Rack"
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] text-[#101828] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101828] mb-1">Journey Route</label>
              <input
                type="text"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                required
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] text-[#101828] font-medium"
              />
            </div>

            {/* Photo Selection / Upload */}
            <div>
              <label className="block text-xs font-semibold text-[#101828] mb-1.5 flex items-center justify-between">
                <span>Luggage Photograph</span>
                <span className="text-[10px] text-[#667085]">Pick sample or paste image link</span>
              </label>

              {/* Quick sample photo selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5">
                {SAMPLE_LUGGAGE_PHOTOS.map((photo) => {
                  const isSelected = selectedPhotoUrl === photo.url && !customPhotoUrl;
                  return (
                    <div
                      key={photo.id}
                      onClick={() => {
                        setSelectedPhotoUrl(photo.url);
                        setCustomPhotoUrl('');
                      }}
                      className={`rounded-xl p-1.5 border transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'border-[#0057FF] bg-[#EAF0FF] ring-2 ring-[#0057FF]/30'
                          : 'border-[#E4E7EC] bg-[#F8F7F4] hover:bg-white'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.label}
                        className="w-full h-14 object-cover rounded-lg mb-1"
                      />
                      <span className="text-[9px] font-semibold text-[#101828] line-clamp-1 block">
                        {photo.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <input
                type="url"
                value={customPhotoUrl}
                onChange={(e) => setCustomPhotoUrl(e.target.value)}
                placeholder="Or paste external photo URL..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E7EC] bg-white text-[#101828]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#101828] mb-1">
                Short Description & Distinguishing Marks
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Black Samsonite 4-wheel trolley with red identification ribbon on handle, found in overhead rack..."
                required
                className="w-full p-3 text-xs rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] text-[#101828]"
              />
            </div>

            {/* Custody Depot Selection with OpenStreetMap */}
            <div>
              <label className="block text-xs font-semibold text-[#101828] mb-1">
                Secure Custody Depot / Locker Location
              </label>
              <select
                value={selectedDepot.name}
                onChange={(e) => {
                  const match = depotsList.find((d) => d.name === e.target.value);
                  if (match) setSelectedDepot(match);
                }}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E4E7EC] bg-white text-[#101828] mb-2 font-medium"
              >
                {depotsList.map((d, i) => (
                  <option key={i} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>

              {/* Embedded OpenStreetMap for depot navigation */}
              <div className="mt-2">
                <OpenStreetMap
                  center={selectedDepot.coordinates}
                  markerTitle={selectedDepot.name}
                  markerDescription={selectedDepot.address}
                  depotAddress={selectedDepot.address}
                  busNumber={busNumber}
                  className="h-48 w-full rounded-2xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0057FF]/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Report & Notify Journey Passengers</span>
            </button>
          </form>
        </div>

        {/* Right 6 Columns: Active Luggage Inventory & Claims */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC]">
              <div className="flex items-center gap-2">
                <PackageSearch className="w-5 h-5 text-[#0057FF]" />
                <h3 className="text-base font-bold text-[#101828]">
                  Active Found Luggage Registry ({lostLuggageItems.length})
                </h3>
              </div>
              <button
                onClick={() => setCurrentView('luggage')}
                className="text-xs font-semibold text-[#0057FF] hover:underline"
              >
                Switch to Passenger View
              </button>
            </div>

            {/* List of reported items */}
            <div className="space-y-4">
              {lostLuggageItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-[#E4E7EC] bg-[#F8F7F4] hover:bg-white transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <img
                        src={item.photoUrl}
                        alt="Luggage"
                        className="w-16 h-16 rounded-xl object-cover border border-[#E4E7EC] shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-extrabold text-[#101828]">
                            {item.trackingNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#0057FF] font-semibold mt-0.5">
                          Bus: {item.busNumber} • {item.seatNumber}
                        </p>
                        <p className="text-[11px] text-[#667085] line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Progress Stepper */}
                  <div className="pt-2 border-t border-[#E4E7EC]">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#667085] block mb-1">
                      Luggage Lifecycle Status:
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-semibold overflow-x-auto py-1">
                      {['Reported', 'Photo Uploaded', 'Awaiting Passenger Confirmation', 'Claimed', 'Return Coordinated'].map(
                        (stepName, stepIdx) => {
                          const isDone =
                            ['Reported', 'Photo Uploaded', 'Awaiting Passenger Confirmation', 'Claimed', 'Return Coordinated'].indexOf(
                              item.status
                            ) >= stepIdx;

                          return (
                            <span
                              key={stepIdx}
                              className={`whitespace-nowrap px-2 py-0.5 rounded-md ${
                                isDone
                                  ? 'bg-[#0057FF] text-white font-bold'
                                  : 'bg-gray-200 text-gray-500'
                              }`}
                            >
                              {stepIdx + 1}. {stepName}
                            </span>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Passenger Claim Details (Privacy Masked) */}
                  {item.claimedByPassengerId ? (
                    <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-900 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-purple-700" />
                          <span>Claimed by Passenger: {item.maskedPassengerName}</span>
                        </span>
                        <span className="text-[10px] bg-white border border-purple-200 px-2 py-0.5 rounded text-purple-700 font-mono font-bold">
                          OTP: {item.pickupOtp}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#475467]">
                        Verification note: <em>"{item.passengerVerificationNote || 'Owner identified contents'}"</em>
                      </p>
                      {item.coordinationNotes && (
                        <p className="text-[11px] text-emerald-800 font-medium">
                          ✓ Coordination: {item.coordinationNotes}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-[11px] text-[#667085] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Notification active in passenger journey dashboard. Awaiting response.</span>
                    </div>
                  )}

                  {/* Driver action buttons */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[10px] text-[#667085]">📍 {item.depotName}</span>
                    <button
                      onClick={() => setSelectedLuggageForCoordination(item)}
                      className="px-3 py-1.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>Coordinate Return</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Return Coordination Modal */}
      {selectedLuggageForCoordination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E4E7EC] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#101828] mb-1">
              Secure Return Coordination
            </h3>
            <p className="text-xs text-[#667085] mb-4">
              Tracking #{selectedLuggageForCoordination.trackingNumber} • Bus {selectedLuggageForCoordination.busNumber}
            </p>

            <form onSubmit={handleCoordinationSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#101828] mb-1">
                  Handover Channel
                </label>
                <select
                  value={returnMethod}
                  onChange={(e: any) => setReturnMethod(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] text-[#101828]"
                >
                  <option value="depot_pickup">Depot Safe Locker Pickup (Passenger presents OTP)</option>
                  <option value="terminal_helpdesk">Terminal Lost Property Desk Handover</option>
                  <option value="courier_dispatch">Authorized State Courier Dispatch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#101828] mb-1">
                  Coordination Notes / Locker ID
                </label>
                <textarea
                  rows={2}
                  value={coordinationNote}
                  onChange={(e) => setCoordinationNote(e.target.value)}
                  placeholder="e.g. Stored in Locker Bay 4, Key with Station Master Desk..."
                  className="w-full p-2.5 text-xs rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] text-[#101828]"
                />
              </div>

              {/* OpenStreetMap for depot confirmation */}
              <div>
                <span className="text-xs font-semibold text-[#101828] block mb-1">Depot Navigation Location</span>
                <OpenStreetMap
                  center={selectedLuggageForCoordination.depotCoordinates}
                  markerTitle={selectedLuggageForCoordination.depotName}
                  markerDescription={selectedLuggageForCoordination.depotAddress}
                  className="h-36 w-full rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Confirm Return Coordination
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLuggageForCoordination(null)}
                  className="px-4 py-3 rounded-xl bg-[#F8F7F4] text-[#667085] text-xs font-semibold hover:text-[#101828]"
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
