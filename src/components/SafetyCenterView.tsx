import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  Users,
  Share2,
  Phone,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Eye,
  Info,
  Clock,
  MapPin,
  Bell,
  HeartHandshake,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { TrustedContact } from '../types/travel';

export const SafetyCenterView: React.FC = () => {
  const {
    contacts,
    addContact,
    deleteContact,
    isLiveSharingActive,
    toggleLiveSharing,
    triggerEmergencySos,
    t,
  } = useTravel();

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Family');
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const shareableLiveTrackingLink = 'https://roamagent.travel/live/share/trk-9082-safe';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLiveTrackingLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;

    addContact({
      name: newContactName,
      phone: newContactPhone,
      relationship: newContactRelation,
      isPrimary: contacts.length === 0,
      smsAlerts: true,
      whatsappAlerts: true,
    });

    setNewContactName('');
    setNewContactPhone('');
    setIsAddingContact(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF0FF] text-[#0057FF] text-xs font-bold mb-2">
              <Shield className="w-3.5 h-3.5" />
              <span>Sentinel Safety Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
              {t.safety.title}
            </h2>
            <p className="text-sm text-[#667085] mt-1 max-w-3xl">
              {t.safety.subtitle}
            </p>
          </div>

          {/* Prominent SOS Button */}
          <button
            onClick={triggerEmergencySos}
            className="self-start md:self-auto px-6 py-3.5 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-black tracking-wide shadow-xl shadow-[#DC2626]/30 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer border border-red-400"
          >
            <AlertTriangle className="w-5 h-5 animate-bounce" />
            <span>TRIGGER EMERGENCY SOS</span>
          </button>
        </div>
      </div>

      {/* Safety Demonstration Disclaimer Banner */}
      <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-[#B45309] flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 text-[#B45309] mt-0.5" />
        <p className="leading-relaxed font-medium">
          <strong>Demonstration & Evaluation Notice:</strong> {t.safety.disclaimer} This platform provides relative safety assessment algorithms and automated contact broadcast simulations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Relative Safety Index & Journey Sharing */}
        <div className="lg:col-span-7 space-y-8">
          {/* Relative Safety Assessment Card */}
          <div className="bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E4E7EC] gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0057FF]">
                  AI Safety Assessment
                </span>
                <h3 className="text-xl font-bold text-[#101828] mt-1">
                  Corridor Safety Index (98/100)
                </h3>
                <p className="text-xs text-[#667085] mt-0.5">{t.safety.scoreDescription}</p>
              </div>

              <div className="w-20 h-20 rounded-2xl bg-emerald-50 border-2 border-[#15803D] flex flex-col items-center justify-center text-center shrink-0">
                <span className="text-2xl font-black text-[#15803D]">98%</span>
                <span className="text-[10px] font-bold text-[#15803D] uppercase">High Trust</span>
              </div>
            </div>

            {/* Factor breakdown */}
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#101828]">Terminal & Boarding Area Illumination</span>
                  <span className="text-[#15803D]">98/100</span>
                </div>
                <div className="w-full h-2 bg-[#E4E7EC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#15803D] rounded-full" style={{ width: '98%' }} />
                </div>
                <span className="text-[11px] text-[#667085]">Verified high-lumen lighting and monitored bays at Secunderabad & Hubballi.</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#101828]">Verified Operator Compliance (CCTV & Speed Governor)</span>
                  <span className="text-[#15803D]">100/100</span>
                </div>
                <div className="w-full h-2 bg-[#E4E7EC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0057FF] rounded-full" style={{ width: '100%' }} />
                </div>
                <span className="text-[11px] text-[#667085]">State RTC & Indian Railways official crews with mandatory identity verification.</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#101828]">Emergency Response Radius (&lt; 1.2 km)</span>
                  <span className="text-[#15803D]">96/100</span>
                </div>
                <div className="w-full h-2 bg-[#E4E7EC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#15803D] rounded-full" style={{ width: '96%' }} />
                </div>
                <span className="text-[11px] text-[#667085]">Continuous proximity to GRP railway police kiosks and 112 highway patrol vehicles.</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#101828]">Female Passenger Ratio & Safe Co-travelers</span>
                  <span className="text-[#15803D]">94/100</span>
                </div>
                <div className="w-full h-2 bg-[#E4E7EC] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0057FF] rounded-full" style={{ width: '94%' }} />
                </div>
                <span className="text-[11px] text-[#667085]">Dedicated women-only coach berths and verified co-traveler verification.</span>
              </div>
            </div>
          </div>

          {/* Live Journey Sharing Simulation */}
          <div className="bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#EAF0FF] text-[#0057FF] flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#101828]">{t.safety.liveShare}</h3>
                  <p className="text-xs text-[#667085]">{t.safety.liveShareDesc}</p>
                </div>
              </div>

              <button
                onClick={toggleLiveSharing}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isLiveSharingActive
                    ? 'bg-[#15803D] text-white shadow-md shadow-emerald-600/20'
                    : 'bg-gray-200 text-[#101828]'
                }`}
              >
                {isLiveSharingActive ? '● BROADCASTING LIVE' : 'DISABLED'}
              </button>
            </div>

            {isLiveSharingActive ? (
              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#E4E7EC] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#101828]">Active Telemetry Link:</span>
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                      Encrypted End-to-End
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-white border border-[#E4E7EC] rounded-xl p-2.5">
                    <input
                      type="text"
                      readOnly
                      value={shareableLiveTrackingLink}
                      className="text-xs text-[#667085] bg-transparent flex-1 focus:outline-none font-mono"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 rounded-lg bg-[#0057FF] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-[#0045CC]"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-[#667085]">
                    Contacts will receive automatic SMS check-ins at every transfer station and arrival point.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#0057FF] flex items-center justify-between">
                  <span className="font-medium">Next scheduled ping: Secunderabad Departure (07:20 AM)</span>
                  <span className="font-bold">In 14 hrs</span>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-xs text-[#667085]">
                Turn on Live Journey Sharing to automatically stream your itinerary status, battery percentage, and station checkpoints to your emergency circle.
              </p>
            )}
          </div>
        </div>

        {/* Right 5 Columns: Trusted Contacts Management */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0057FF]" />
                <h3 className="text-sm font-bold text-[#101828]">{t.safety.trustedContacts}</h3>
              </div>

              <button
                onClick={() => setIsAddingContact(!isAddingContact)}
                className="px-3 py-1.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.safety.addContact}</span>
              </button>
            </div>

            {/* Add Contact Form Inline */}
            {isAddingContact && (
              <form onSubmit={handleCreateContact} className="mt-4 p-4 rounded-2xl bg-[#F8F7F4] border border-[#E4E7EC] space-y-3">
                <h4 className="text-xs font-bold text-[#101828]">New Emergency Contact</h4>
                <div>
                  <label className="block text-[11px] font-semibold text-[#101828] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E7EC] bg-white text-[#101828]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#101828] mb-1">Mobile Phone (with country code)</label>
                  <input
                    type="tel"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E7EC] bg-white text-[#101828]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#101828] mb-1">Relationship</label>
                  <select
                    value={newContactRelation}
                    onChange={(e) => setNewContactRelation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E4E7EC] bg-white text-[#101828]"
                  >
                    <option value="Family">Family</option>
                    <option value="Sister">Sister</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#0057FF] text-white text-xs font-bold hover:bg-[#0045CC] cursor-pointer"
                  >
                    Save Contact
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingContact(false)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#E4E7EC] text-xs font-semibold text-[#667085] hover:text-[#101828] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Contacts List */}
            <div className="mt-4 space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#E4E7EC] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E4E7EC] text-[#0057FF] flex items-center justify-center font-bold text-sm">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#101828]">{contact.name}</span>
                        {contact.isPrimary && (
                          <span className="text-[10px] bg-[#EAF0FF] text-[#0057FF] font-bold px-1.5 py-0.2 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#667085]">
                        {contact.relationship} • {contact.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteContact(contact.id)}
                      className="p-1.5 text-gray-400 hover:text-[#DC2626] transition-colors cursor-pointer"
                      title="Remove contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Helplines Box */}
          <div className="bg-[#101828] text-white rounded-3xl p-6 space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-white">
              <Phone className="w-4 h-4 text-[#0057FF]" />
              <span>Verified Emergency Helplines (India)</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10">
                <span>National Emergency Number</span>
                <span className="font-mono font-bold text-yellow-400">112</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10">
                <span>National Women Helpline</span>
                <span className="font-mono font-bold text-yellow-400">1091</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10">
                <span>Railway Security (RailMadad)</span>
                <span className="font-mono font-bold text-yellow-400">139</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
