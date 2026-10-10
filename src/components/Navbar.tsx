import React, { useState } from 'react';
import {
  Compass,
  Shield,
  MapPin,
  Bot,
  AlertTriangle,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Languages,
  CheckCircle2,
  ChevronDown,
  PackageSearch,
  Bus,
  MessageSquarePlus,
  Heart,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { Language } from '../translations';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    language,
    setLanguage,
    t,
    user,
    savedTrips,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    triggerEmergencySos,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
  } = useTravel();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home, icon: Compass },
    { id: 'assistant', label: t.nav.aiAssistant, icon: Bot },
    { id: 'plan', label: t.nav.planJourney, icon: MapPin },
    { id: 'compare', label: t.nav.compareRoutes, icon: ChevronDown },
    { id: 'safety', label: t.nav.safetyCenter, icon: Shield },
    { id: 'profile', label: t.nav.userProfile, icon: Heart },
    { id: 'my-journeys', label: t.nav.myJourneys, icon: CheckCircle2 },
    { id: 'luggage', label: t.nav.lostLuggage, icon: PackageSearch },
    { id: 'inquiry', label: t.nav.inquiry, icon: MessageSquarePlus },
    { id: 'driver-portal', label: t.nav.driverPortal, icon: Bus },
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#101828]/85 border-b border-white/10 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="w-11 h-11 rounded-xl bg-[#0057FF] flex items-center justify-center text-white shadow-lg shadow-[#0057FF]/30 border border-white/20">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  TBS <span className="text-[#0057FF] bg-white/10 px-1.5 py-0.5 rounded-md">RoamAgent</span>
                </span>
                <span className="text-[10px] font-semibold bg-[#0057FF]/20 text-[#60A5FA] border border-[#0057FF]/30 px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
                  Samartha AI
                </span>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider hidden md:inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Supabase</span>
                </span>
              </div>
              <p className="text-xs text-gray-300 hidden md:block">Agentic Multimodal Travel Concierge</p>
            </div>
          </div>

          {/* Center Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#0057FF] text-white shadow-md shadow-[#0057FF]/25 font-semibold'
                      : 'text-gray-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-300'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Emergency SOS button */}
            <button
              onClick={triggerEmergencySos}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold tracking-wide shadow-md shadow-[#DC2626]/30 transition-transform active:scale-95 cursor-pointer border border-red-400/40"
              title="Emergency SOS Broadcast"
            >
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span className="hidden sm:inline">SOS</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setNotificationsOpen(false);
                  setUserDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-gray-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
                title="Select Language"
              >
                <Languages className="w-4 h-4 text-[#0057FF]" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white shadow-xl border border-[#E4E7EC] py-1 text-sm z-50 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full text-left px-4 py-2 hover:bg-[#F8F7F4] flex items-center justify-between cursor-pointer ${
                      language === 'en' ? 'text-[#0057FF] font-bold bg-[#EAF0FF]' : 'text-[#101828]'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <CheckCircle2 className="w-4 h-4 text-[#0057FF]" />}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('te')}
                    className={`w-full text-left px-4 py-2 hover:bg-[#F8F7F4] flex items-center justify-between cursor-pointer ${
                      language === 'te' ? 'text-[#0057FF] font-bold bg-[#EAF0FF]' : 'text-[#101828]'
                    }`}
                  >
                    <span>తెలుగు (Telugu)</span>
                    {language === 'te' && <CheckCircle2 className="w-4 h-4 text-[#0057FF]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setLangDropdownOpen(false);
                  setUserDropdownOpen(false);
                }}
                className="relative p-2 rounded-xl text-gray-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0057FF] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#101828]">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-[#E4E7EC] py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[#E4E7EC]">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#0057FF]" />
                      <span className="text-sm font-bold text-[#101828]">Travel Notifications</span>
                    </div>
                    <span className="text-xs bg-[#EAF0FF] text-[#0057FF] font-semibold px-2 py-0.5 rounded-full">
                      {unreadNotificationsCount} new
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#E4E7EC]">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-center text-[#667085]">No notifications right now.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`p-3.5 hover:bg-[#F8F7F4] cursor-pointer transition-colors ${
                            !notif.read ? 'bg-[#F8F7F4]/80' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-[#101828]">{notif.title}</span>
                            <span className="text-[10px] text-[#667085] whitespace-nowrap">{notif.timestamp}</span>
                          </div>
                          <p className="text-xs text-[#667085] mt-1 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile or Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotificationsOpen(false);
                    setLangDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-left cursor-pointer"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-[#0057FF]"
                  />
                  <div className="hidden md:block">
                    <span className="text-xs font-semibold text-white block leading-tight">{user.name}</span>
                    <span className="text-[10px] text-gray-300 block">Verified Traveler</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-[#E4E7EC] p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="p-2 border-b border-[#E4E7EC] mb-1">
                      <p className="text-xs font-bold text-[#101828]">{user.name}</p>
                      <p className="text-[11px] text-[#667085] truncate">{user.email}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] bg-[#EAF0FF] text-[#0057FF] px-2 py-0.5 rounded-md font-semibold">
                        <Shield className="w-3 h-3 text-[#0057FF]" />
                        <span>Women Safety Guard Active</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] bg-emerald-50 text-[#15803D] px-2 py-0.5 rounded-md font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
                        <span>Supabase: TRAVELTECHAI</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleNavClick('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-[#0057FF] bg-[#EAF0FF]/60 hover:bg-[#EAF0FF] flex items-center justify-between cursor-pointer mb-1"
                    >
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-600 fill-current" />
                        <span>My Profile & Saved Trips</span>
                      </div>
                      {savedTrips.length > 0 && (
                        <span className="bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                          {savedTrips.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick('my-journeys');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#101828] hover:bg-[#F8F7F4] flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#0057FF]" />
                      <span>My Bookings & PNR</span>
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick('safety');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#101828] hover:bg-[#F8F7F4] flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-[#0057FF]" />
                      <span>Manage Safety Contacts</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#DC2626] hover:bg-red-50 flex items-center gap-2 mt-1 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-[#DC2626]" />
                      <span>{t.nav.signOut}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold tracking-wide shadow-md shadow-[#0057FF]/30 transition-all cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>{t.nav.signIn}</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-200 hover:text-white bg-white/10 border border-white/10"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 bg-[#101828]/95 backdrop-blur-xl px-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#0057FF] text-white font-bold' : 'text-gray-200 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
