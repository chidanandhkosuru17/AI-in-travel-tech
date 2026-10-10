import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Shield,
  Search,
  Sparkles,
  MapPin,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { LoginCard } from './LoginCard';
import { TRAVEL_IMAGES } from '../data/mockTravelData';

export const HeroSection: React.FC = () => {
  const { t, setCurrentView, handleSearchSubmit, setIsAuthModalOpen, setAuthModalMode } = useTravel();
  const [searchQuery, setSearchQuery] = useState('');

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearchSubmit(searchQuery);
    } else {
      setCurrentView('assistant');
    }
  };

  const handleChipClick = (routeStr: string) => {
    setSearchQuery(routeStr);
    handleSearchSubmit(routeStr);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background Photography with Transparent Dark & Blue Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={TRAVEL_IMAGES.heroHighway}
          alt="Scenic Indian Highway Travel"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
          loading="eager"
        />
        {/* Layered cinematic overlays: dark navy gradient + soft blue vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#101828]/95 via-[#101828]/85 to-[#0057FF]/30 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101828] via-transparent to-[#101828]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,87,255,0.22),transparent_60%)]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Hero Typography, Call to Action, Search Bar */}
          <div className="lg:col-span-7 text-left space-y-6 lg:space-y-8">
            {/* Hackathon Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#0057FF] animate-pulse" />
              <span>{t.hero.hackathonBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Travel Smarter.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-[#60A5FA]">
                Explore Further.
              </span>{' '}
              <br className="hidden sm:inline" />
              Travel with{' '}
              <span className="text-[#0057FF] bg-white/95 px-3 py-0.5 rounded-2xl shadow-lg inline-block my-1">
                Confidence.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-gray-200 font-normal leading-relaxed max-w-2xl text-shadow">
              {t.hero.subtitle}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={() => {
                  setCurrentView('plan');
                  window.scrollTo({ top: 700, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 rounded-2xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-sm font-bold shadow-xl shadow-[#0057FF]/35 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-blue-400/30"
              >
                <span>{t.hero.planJourneyBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('compare');
                  window.scrollTo({ top: 700, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md border border-white/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>{t.hero.exploreFeaturesBtn}</span>
              </button>
            </div>

            {/* Natural-Language Travel Search Bar */}
            <div className="pt-2">
              <form
                onSubmit={onSearch}
                className="relative bg-white/95 backdrop-blur-xl p-2 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40 flex flex-col sm:flex-row items-center gap-2"
              >
                <div className="flex items-center gap-3 w-full px-3 py-2">
                  <div className="w-9 h-9 rounded-xl bg-[#EAF0FF] text-[#0057FF] flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.hero.searchPlaceholder}
                    className="w-full text-xs sm:text-sm bg-transparent text-[#101828] placeholder-[#667085] focus:outline-none font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0057FF]/30 whitespace-nowrap transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  <span>{t.hero.planTripBtn}</span>
                </button>
              </form>

              {/* Quick Route Suggestion Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                <span className="text-gray-300 font-medium text-[11px]">Popular Indian Routes:</span>
                <button
                  type="button"
                  onClick={() => handleChipClick('Hyderabad to Goa multimodal sleeper train & coach')}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-[11px] border border-white/10 transition-colors cursor-pointer"
                >
                  Hyderabad → Goa
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick('Bengaluru to Ooty scenic mountain road & train')}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-[11px] border border-white/10 transition-colors cursor-pointer"
                >
                  Bengaluru → Ooty
                </button>
                <button
                  type="button"
                  onClick={() => handleChipClick('Delhi to Jaipur Vande Bharat express & metro')}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-[11px] border border-white/10 transition-colors cursor-pointer"
                >
                  Delhi → Jaipur
                </button>
              </div>
            </div>

            {/* Travel Stats Ribbon */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/15">
              <div className="flex items-center gap-2 text-white">
                <ShieldCheck className="w-4 h-4 text-[#0057FF]" />
                <span className="text-xs font-semibold">{t.hero.statRating}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <TrendingUp className="w-4 h-4 text-[#0057FF]" />
                <span className="text-xs font-semibold">{t.hero.statRoutes}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-4 h-4 text-[#0057FF]" />
                <span className="text-xs font-semibold">{t.hero.statRecovery}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Shield className="w-4 h-4 text-[#0057FF]" />
                <span className="text-xs font-semibold">{t.hero.statWomenSafety}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Login Panel (matching reference screenshot composition) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <LoginCard
              onSwitchToRegister={() => {
                setAuthModalMode('register');
                setIsAuthModalOpen(true);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
