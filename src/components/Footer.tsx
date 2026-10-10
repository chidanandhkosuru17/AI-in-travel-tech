import React from 'react';
import { Compass, Shield, Heart, ExternalLink } from 'lucide-react';
import { useTravel } from '../context/TravelContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useTravel();

  return (
    <footer className="bg-[#101828] text-white border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0057FF] flex items-center justify-center text-white shadow-lg shadow-[#0057FF]/30">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Route<span className="text-[#0057FF] bg-white/10 px-1.5 py-0.5 rounded-md ml-0.5">Zen</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md leading-relaxed">
              Agentic AI Multimodal Travel Concierge — developed for Samartha Hackathon 2026. Synchronizing intercity buses, trains, metros, and safety-verified last-mile transit with autonomous disruption recovery.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
              <Shield className="w-4 h-4 text-[#0057FF]" />
              <span>Women Safety Sentinel & Relative Safety Index Built-in</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('assistant');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  AI Travel Assistant
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('compare');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Compare Routes
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('safety');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Women's Safety Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('disruption');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Disruption Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('luggage');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Lost Luggage Recovery
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('profile');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-pink-300 font-medium"
                >
                  My Profile & Saved Trips
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('inquiry');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-[#60A5FA] font-medium"
                >
                  Inquiry & Support Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('driver-portal');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Driver Portal (Demo)
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Emergency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Emergency & Notice</h4>
            <div className="space-y-3 text-xs text-gray-400">
              <p className="leading-relaxed">
                National Helpline: <span className="font-mono text-yellow-400 font-bold">112</span>
                <br />
                Women Helpline: <span className="font-mono text-yellow-400 font-bold">1091</span>
                <br />
                Railway RailMadad: <span className="font-mono text-yellow-400 font-bold">139</span>
              </p>
              <p className="text-[11px] text-gray-500">
                Evaluation notice: Live simulated demonstration. Not affiliated directly with Indian Railways or State RTCs.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 RouteZen. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Built with precision for Samartha Hackathon</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
