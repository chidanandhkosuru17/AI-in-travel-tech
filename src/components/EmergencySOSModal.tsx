import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, PhoneCall, Radio, Volume2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useTravel } from '../context/TravelContext';

export const EmergencySOSModal: React.FC = () => {
  const { isSosModalOpen, cancelEmergencySos, contacts } = useTravel();
  const [countdown, setCountdown] = useState(3);
  const [isDispatched, setIsDispatched] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSosModalOpen && !isDispatched) {
      setCountdown(3);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsDispatched(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSosModalOpen, isDispatched]);

  if (!isSosModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-[#DC2626] overflow-hidden">
        {/* Urgent Red Header */}
        <div className="bg-[#DC2626] text-white p-6 text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto animate-pulse">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">EMERGENCY SOS ALERT</h2>
          <p className="text-xs text-red-100 font-medium">
            Simulated Emergency Protocol for Samartha Hackathon Evaluation
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {!isDispatched ? (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full border-4 border-[#DC2626] border-t-transparent animate-spin flex items-center justify-center mx-auto">
                <span className="text-4xl font-black text-[#DC2626]">{countdown}</span>
              </div>
              <h3 className="text-lg font-bold text-[#101828]">
                Broadcasting Emergency Alert in {countdown} Seconds...
              </h3>
              <p className="text-xs text-[#667085] max-w-sm mx-auto">
                If this was pressed by accident, click the abort button below immediately.
              </p>

              <button
                onClick={cancelEmergencySos}
                className="w-full py-4 rounded-2xl bg-gray-900 hover:bg-black text-white text-sm font-bold shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                ABORT / CANCEL SOS IMMEDIATELY
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626]">
                  <Radio className="w-4 h-4 animate-ping" />
                  <span>DISPATCH BROADCAST ACTIVE (SIMULATED)</span>
                </div>
                <p className="text-xs text-[#101828] font-semibold">
                  Live coordinates broadcasted: <span className="font-mono text-[#DC2626]">17.4435° N, 78.3772° E</span> (Hitec City Corridor)
                </p>
                <p className="text-[11px] text-[#667085]">
                  Automated SMS dispatched to {contacts.length} emergency contacts + Simulated dispatch to National Helpline 112.
                </p>
              </div>

              {/* Siren status */}
              <div className="p-3.5 rounded-xl bg-[#F8F7F4] border border-[#E4E7EC] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#101828]">
                  <Volume2 className="w-4 h-4 text-[#DC2626]" />
                  <span>Acoustic Distress Siren</span>
                </div>
                <button
                  onClick={() => setSirenPlaying(!sirenPlaying)}
                  className="text-xs font-bold text-[#0057FF] hover:underline cursor-pointer"
                >
                  {sirenPlaying ? 'Mute Siren' : 'Enable Siren'}
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#101828] block">Notified Emergency Contacts:</span>
                {contacts.map((c) => (
                  <div key={c.id} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-[#F8F7F4]">
                    <span className="font-medium text-[#101828]">{c.name} ({c.relationship})</span>
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                      SMS & Location Sent
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsDispatched(false);
                    cancelEmergencySos();
                  }}
                  className="w-full py-3.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
                >
                  Stand-Down & Return to App
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
