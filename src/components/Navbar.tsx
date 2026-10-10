import React, { useState, useRef, useEffect } from 'react';
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
  Layers,
  Sparkles,
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
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
        setUserDropdownOpen(false);
        setLangDropdownOpen(false);
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary desktop navigation tabs (sleek, single line, no wrapping)
  const primaryNavItems = [
    { id: 'home', label: t.nav.home, icon: Compass },
    { id: 'assistant', label: t.nav.aiAssistant, icon: Bot },
    { id: 'compare', label: t.nav.compareRoutes, icon: Layers },
    { id: 'safety', label: t.nav.safetyCenter, icon: Shield },
    { id: 'my-journeys', label: t.nav.myJourneys, icon: CheckCircle2 },
  ];

  // Secondary items cleanly organized in "More Services" dropdown
  const secondaryNavItems = [
    { id: 'luggage', label: t.nav.lostLuggage, icon: PackageSearch, desc: 'QR luggage tracking & recovery' },
    { id: 'inquiry', label: t.nav.inquiry, icon: MessageSquarePlus, desc: 'Direct support & inquiries' },
    { id: 'disruption', label: 'Disruption Simulator', icon: AlertTriangle, desc: 'Real-time delay rerouting' },
    { id: 'driver-portal', label: t.nav.driverPortal, icon: Bus, desc: 'Transit driver verification portal' },
  ];

  // All nav items for the mobile drawer
  const allMobileNavItems = [
    ...primaryNavItems,
    ...secondaryNavItems,
  ];

  const isMoreActive = secondaryNavItems.some((item) => item.id === currentView);

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#101828]/95 border-b border-white/10 transition-all duration-200">
      <div ref={navRef} className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo - Fixed Shrink-0 */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0057FF] flex items-center justify-center text-white shadow-lg shadow-[#0057FF]/30 border border-white/20 shrink-0">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
                  TBS <span className="text-[#0057FF] bg-white/10 px-1.5 py-0.5 rounded-md">RoamAgent</span>
                </span>
                <span className="text-[10px] font-semibold bg-[#0057FF]/20 text-[#60A5FA] border border-[#0057FF]/30 px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
                  Samartha AI
                </span>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider hidden xl:inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Supabase</span>
                </span>
              </div>
              <p className="text-[11px] text-gray-300 hidden lg:block whitespace-nowrap leading-tight mt-0.5">
                Agentic Multimodal Travel Concierge
              </p>
            </div>
          </div>

          {/* Center Navigation - Desktop (Flexible, No-wrap, Single Line) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 min-w-0">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0057FF] text-white shadow-md shadow-[#0057FF]/25 font-semibold'
                      : 'text-gray-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-300'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Desktop "More Services" Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setMoreDropdownOpen(!moreDropdownOpen);
                  setNotificationsOpen(false);
                  setUserDropdownOpen(false);
                  setLangDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isMoreActive || moreDropdownOpen
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-gray-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{t.nav.more || 'More'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-[#0057FF]' : 'text-gray-400'}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-[#E4E7EC] p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#E4E7EC] mb-1">
                    Specialized Transit Services
                  </div>
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-start gap-2.5 ${
                          isActive
                            ? 'bg-[#EAF0FF] text-[#0057FF] font-bold'
                            : 'text-[#101828] hover:bg-[#F8F7F4]'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-[#0057FF] text-white' : 'bg-gray-100 text-[#0057FF]'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold leading-tight">{item.label}</div>
                          <div className="text-[10px] text-[#667085] mt-0.5">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Icons & Auth Controls - Guaranteed Shrink-0 & Visible in Fullscreen */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto z-10">
            {/* Quick Emergency SOS button */}
            <button
              onClick={triggerEmergencySos}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold tracking-wide shadow-md shadow-[#DC2626]/30 transition-transform active:scale-95 cursor-pointer border border-red-400/40 shrink-0 whitespace-nowrap"
              title="Emergency SOS Broadcast"
            >
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce shrink-0" />
              <span className="hidden sm:inline">SOS</span>
            </button>

            {/* Quick Saved Trips Button */}
            <button
              onClick={() => {
                if (user) {
                  handleNavClick('profile');
                } else {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white transition-colors cursor-pointer shrink-0 whitespace-nowrap"
              title="My Profile & Saved Trips"
            >
              <Heart className={`w-3.5 h-3.5 ${savedTrips.length > 0 ? 'text-pink-400 fill-pink-400' : 'text-gray-300'}`} />
              <span className="hidden xl:inline">Saved</span>
              {savedTrips.length > 0 && (
                <span className="bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-none">
                  {savedTrips.length}
                </span>
              )}
            </button>

            {/* Language Selector */}
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setNotificationsOpen(false);
                  setUserDropdownOpen(false);
                  setMoreDropdownOpen(false);
                }}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold text-gray-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer shrink-0"
                title="Select Language"
              >
                <Languages className="w-3.5 h-3.5 text-[#0057FF] shrink-0" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white shadow-xl border border-[#E4E7EC] py-1 text-sm z-50 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full text-left px-3.5 py-2 hover:bg-[#F8F7F4] flex items-center justify-between cursor-pointer text-xs ${
                      language === 'en' ? 'text-[#0057FF] font-bold bg-[#EAF0FF]' : 'text-[#101828]'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <CheckCircle2 className="w-4 h-4 text-[#0057FF]" />}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('te')}
                    className={`w-full text-left px-3.5 py-2 hover:bg-[#F8F7F4] flex items-center justify-between cursor-pointer text-xs ${
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
            <div className="relative shrink-0">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setLangDropdownOpen(false);
                  setUserDropdownOpen(false);
                  setMoreDropdownOpen(false);
                }}
                className="relative p-2 rounded-xl text-gray-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer shrink-0"
                title="Notifications"
              >
                <Bell className="w-4 h-4 shrink-0" />
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

            {/* User Profile or Prominent Sign In Button - ALWAYS Visible & Never Clipped */}
            {user ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotificationsOpen(false);
                    setLangDropdownOpen(false);
                    setMoreDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-left cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-[#0057FF] shrink-0"
                  />
                  <div className="hidden sm:block">
                    <span className="text-xs font-semibold text-white block leading-tight truncate max-w-[110px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-gray-300 block leading-tight">Verified Traveler</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white shadow-2xl border border-[#E4E7EC] p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="p-2 border-b border-[#E4E7EC] mb-1">
                      <p className="text-xs font-bold text-[#101828] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#667085] truncate">{user.email}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] bg-[#EAF0FF] text-[#0057FF] px-2 py-0.5 rounded-md font-semibold">
                        <Shield className="w-3 h-3 text-[#0057FF] shrink-0" />
                        <span>Women Safety Guard Active</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] bg-emerald-50 text-[#15803D] px-2 py-0.5 rounded-md font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse shrink-0" />
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
                        <Heart className="w-4 h-4 text-pink-600 fill-current shrink-0" />
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
                      <CheckCircle2 className="w-4 h-4 text-[#0057FF] shrink-0" />
                      <span>My Bookings & PNR</span>
                    </button>
                    <button
                      onClick={() => {
                        handleNavClick('safety');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#101828] hover:bg-[#F8F7F4] flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-[#0057FF] shrink-0" />
                      <span>Manage Safety Contacts</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#DC2626] hover:bg-red-50 flex items-center gap-2 mt-1 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-[#DC2626] shrink-0" />
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
                className="shrink-0 flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs sm:text-sm font-bold tracking-wide shadow-md shadow-[#0057FF]/30 transition-all cursor-pointer whitespace-nowrap active:scale-95 border border-white/20"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{t.nav.signIn}</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-200 hover:text-white bg-white/10 border border-white/10 shrink-0 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 bg-[#101828]/95 backdrop-blur-xl px-2 space-y-1 max-h-[80vh] overflow-y-auto">
            {allMobileNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive ? 'bg-[#0057FF] text-white font-bold shadow-md shadow-[#0057FF]/20' : 'text-gray-200 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Mobile Profile & Saved Trips Link */}
            <button
              onClick={() => {
                if (user) {
                  handleNavClick('profile');
                } else {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'profile' ? 'bg-[#0057FF] text-white font-bold' : 'text-gray-200 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-pink-400 shrink-0" />
                <span>My Profile & Saved Trips</span>
              </div>
              {savedTrips.length > 0 && (
                <span className="bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {savedTrips.length}
                </span>
              )}
            </button>

            {/* Mobile Sign In / Out */}
            {!user ? (
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-[#0057FF] text-white mt-2 cursor-pointer shadow-lg shadow-[#0057FF]/30"
              >
                <User className="w-4 h-4" />
                <span>{t.nav.signIn}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500/20 text-red-300 border border-red-500/30 mt-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.nav.signOut}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
