import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MultimodalItinerary,
  TrustedContact,
  TravelNotification,
  DisruptionScenario,
  BookingDetails,
  UserProfile,
} from '../types/travel';
import {
  DEFAULT_ITINERARIES,
  DEFAULT_CONTACTS,
  DEFAULT_NOTIFICATIONS,
  DISRUPTION_SCENARIOS,
} from '../data/mockTravelData';
import { Language, translations } from '../translations';
import {
  supabase,
  SUPABASE_CONFIG,
  saveBookingToSupabase,
  saveContactToSupabase,
} from '../lib/supabase';

interface TravelContextType {
  // Navigation & View
  currentView: string;
  setCurrentView: (view: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;

  // Supabase Status
  supabaseConfig: typeof SUPABASE_CONFIG;
  isSupabaseConnected: boolean;

  // User & Auth
  user: UserProfile | null;
  login: (email: string, password?: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password?: string
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;

  // Search & Itineraries
  origin: string;
  destination: string;
  setOrigin: (origin: string) => void;
  setDestination: (destination: string) => void;
  itineraries: MultimodalItinerary[];
  selectedItinerary: MultimodalItinerary;
  setSelectedItinerary: (itinerary: MultimodalItinerary) => void;
  handleSearchSubmit: (query: string) => void;

  // Safety & Emergency
  contacts: TrustedContact[];
  addContact: (contact: Omit<TrustedContact, 'id'>) => Promise<void>;
  deleteContact: (id: string) => void;
  isLiveSharingActive: boolean;
  toggleLiveSharing: () => void;
  isSosModalOpen: boolean;
  setIsSosModalOpen: (open: boolean) => void;
  isEmergencyActive: boolean;
  triggerEmergencySos: () => void;
  cancelEmergencySos: () => void;

  // Disruption Simulator
  activeDisruption: DisruptionScenario | null;
  disruptionAlternative: MultimodalItinerary | null;
  isDisruptionRecalculating: boolean;
  simulateDisruption: (scenarioId: string) => void;
  approveDisruptionRecovery: () => void;
  resetDisruption: () => void;

  // Bookings & Checkout
  currentBooking: BookingDetails | null;
  bookings: BookingDetails[];
  createBooking: (
    passengerName: string,
    age: number,
    gender: string,
    emergencyPhone: string,
    paymentMethod: 'UPI Demo' | 'Card Demo' | 'Cash on Boarding'
  ) => BookingDetails;

  // Notifications
  notifications: TravelNotification[];
  markNotificationAsRead: (id: string) => void;
  unreadNotificationsCount: number;
}

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(true);

  // User starts as null so visitor can see and use real Login & Signup forms!
  const [user, setUser] = useState<UserProfile | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Search & Itineraries
  const [origin, setOrigin] = useState('Hyderabad (Hitec City)');
  const [destination, setDestination] = useState('Goa (Panaji)');
  const [itineraries, setItineraries] = useState<MultimodalItinerary[]>(DEFAULT_ITINERARIES);
  const [selectedItinerary, setSelectedItinerary] = useState<MultimodalItinerary>(DEFAULT_ITINERARIES[1]);

  // Safety
  const [contacts, setContacts] = useState<TrustedContact[]>(DEFAULT_CONTACTS);
  const [isLiveSharingActive, setIsLiveSharingActive] = useState(true);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<TravelNotification[]>(DEFAULT_NOTIFICATIONS);

  // Disruption
  const [activeDisruption, setActiveDisruption] = useState<DisruptionScenario | null>(null);
  const [disruptionAlternative, setDisruptionAlternative] = useState<MultimodalItinerary | null>(null);
  const [isDisruptionRecalculating, setIsDisruptionRecalculating] = useState(false);

  // Bookings
  const [bookings, setBookings] = useState<BookingDetails[]>([
    {
      bookingId: 'ROAM-HYD-GOA-9082',
      pnr: 'IR8923018',
      itinerary: DEFAULT_ITINERARIES[1],
      passengerName: 'Chidanandh Kosuru',
      passengerAge: 27,
      passengerGender: 'Male',
      emergencyContact: '+91 98765 43210 (Ananya Sharma)',
      seatSelections: [
        { legId: 'leg-2a', seat: 'Dedicated Sedan TS-09-UB-4421' },
        { legId: 'leg-2b', seat: 'Coach A-1, Berth 18' },
        { legId: 'leg-2c', seat: 'Window Seat 4' },
      ],
      totalPaid: 2180,
      paymentMethod: 'UPI Demo',
      status: 'Confirmed',
      createdAt: '2026-10-09 18:30',
      qrCodeToken: 'ROAM-SAFE-HYD-GOA-2026-SECURE-9821',
    },
  ]);
  const [currentBooking, setCurrentBooking] = useState<BookingDetails | null>(null);

  const t = translations[language];

  // Subscribe to real Supabase Auth session on app launch
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!error && session?.user) {
        setUser({
          id: session.user.id,
          name:
            session.user.user_metadata?.full_name ||
            session.user.email?.split('@')[0] ||
            'Traveler',
          email: session.user.email || '',
          phone: session.user.phone || '+91 98480 12345',
          avatarUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          safetyFilterEnabled: true,
          nightTravelAvoidance: true,
          femaleCoPassengerPreference: true,
          liveSharingActive: true,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name:
            session.user.user_metadata?.full_name ||
            session.user.email?.split('@')[0] ||
            'Traveler',
          email: session.user.email || '',
          phone: session.user.phone || '+91 98480 12345',
          avatarUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          safetyFilterEnabled: true,
          nightTravelAvoidance: true,
          femaleCoPassengerPreference: true,
          liveSharingActive: true,
        });
      } else {
        // user signed out
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (
    email: string,
    password?: string,
    name?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || name || email.split('@')[0],
            email: data.user.email || email,
            phone: '+91 98480 12345',
            avatarUrl:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            safetyFilterEnabled: true,
            nightTravelAvoidance: true,
            femaleCoPassengerPreference: true,
            liveSharingActive: true,
          };
          setUser(profile);
          setIsAuthModalOpen(false);

          setNotifications((prev) => [
            {
              id: 'notif-' + Date.now(),
              title: 'Signed In (Supabase TRAVELTECHAI)',
              message: `Welcome back, ${profile.name}! Authenticated with your Supabase account.`,
              timestamp: 'Just now',
              type: 'success',
              read: false,
            },
            ...prev,
          ]);

          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err?.message || 'Login failed' };
      }
    }

    // Fast demo login if explicitly clicked without typing a password
    const demoProfile: UserProfile = {
      id: 'demo-' + Date.now(),
      name: name || (email.includes('chidanandh') ? 'Chidanandh Kosuru' : 'Traveler ' + email.split('@')[0]),
      email,
      phone: '+91 98480 12345',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      safetyFilterEnabled: true,
      nightTravelAvoidance: true,
      femaleCoPassengerPreference: true,
      liveSharingActive: true,
    };
    setUser(demoProfile);
    setIsAuthModalOpen(false);

    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: 'Signed In (Demo Traveler Session)',
        message: `Signed in as ${demoProfile.name}.`,
        timestamp: 'Just now',
        type: 'info',
        read: false,
      },
      ...prev,
    ]);

    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    if (!password) {
      return { success: false, error: 'Password is required' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if session was returned or email confirmation link was sent
      if (data.user && !data.session) {
        setNotifications((prev) => [
          {
            id: 'notif-' + Date.now(),
            title: 'Supabase Verification Email Dispatched',
            message: `A confirmation link has been sent to ${email}. Check your inbox to activate your account.`,
            timestamp: 'Just now',
            type: 'info',
            read: false,
          },
          ...prev,
        ]);

        return {
          success: true,
          message: `Account created for ${email}! A confirmation link was sent to your email. You can also sign in directly once confirmed.`,
        };
      }

      if (data.user) {
        const profile: UserProfile = {
          id: data.user.id,
          name: name || email.split('@')[0],
          email: data.user.email || email,
          phone: '+91 98480 12345',
          avatarUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          safetyFilterEnabled: true,
          nightTravelAvoidance: true,
          femaleCoPassengerPreference: true,
          liveSharingActive: true,
        };
        setUser(profile);
        setIsAuthModalOpen(false);

        setNotifications((prev) => [
          {
            id: 'notif-' + Date.now(),
            title: 'Account Registered with Supabase',
            message: `Welcome to TBS RoamAgent, ${name}! Your account is created in TRAVELTECHAI.`,
            timestamp: 'Just now',
            type: 'success',
            read: false,
          },
          ...prev,
        ]);

        return { success: true };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase sign out error:', err);
    }
    setUser(null);

    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: 'Signed Out',
        message: 'You have been signed out from Supabase.',
        timestamp: 'Just now',
        type: 'info',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleSearchSubmit = (query: string) => {
    const lower = query.toLowerCase();
    if (lower.includes('bengaluru') || lower.includes('ooty')) {
      setOrigin('Bengaluru (Majestic)');
      setDestination('Ooty (Charring Cross)');
    } else if (lower.includes('delhi') || lower.includes('jaipur')) {
      setOrigin('New Delhi (NDLS)');
      setDestination('Jaipur (Sindhi Camp)');
    } else if (lower.includes('vijayawada')) {
      setOrigin('Hyderabad (MGBS)');
      setDestination('Vijayawada (PNBS)');
    } else {
      setOrigin('Hyderabad (Hitec City)');
      setDestination('Goa (Panaji)');
    }
    setCurrentView('assistant');
  };

  const addContact = async (contact: Omit<TrustedContact, 'id'>) => {
    const newContact: TrustedContact = {
      ...contact,
      id: 'contact-' + Date.now(),
    };
    setContacts((prev) => [...prev, newContact]);

    // Asynchronously synchronize to Supabase database
    await saveContactToSupabase(newContact, user?.id);

    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: 'Emergency Contact Added (Synced to Supabase)',
        message: `${newContact.name} (${newContact.relationship}) will receive instant safety alerts.`,
        timestamp: 'Just now',
        type: 'info',
        read: false,
      },
      ...prev,
    ]);
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleLiveSharing = () => {
    setIsLiveSharingActive((prev) => !prev);
    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: !isLiveSharingActive ? 'Live Journey Sharing Activated' : 'Live Sharing Paused',
        message: !isLiveSharingActive
          ? 'Live GPS tracking telemetry is now being broadcast to 3 trusted contacts.'
          : 'Live tracking turned off by user.',
        timestamp: 'Just now',
        type: !isLiveSharingActive ? 'success' : 'info',
        read: false,
      },
      ...prev,
    ]);
  };

  const triggerEmergencySos = () => {
    setIsEmergencyActive(true);
    setIsSosModalOpen(true);
    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: '🚨 CRITICAL: SOS ALERT TRIGGERED',
        message:
          'Automated emergency dispatch broadcast to contacts & National Helpline 112 with live coordinates (17.4435° N, 78.3772° E).',
        timestamp: 'Just now',
        type: 'alert',
        read: false,
      },
      ...prev,
    ]);
  };

  const cancelEmergencySos = () => {
    setIsEmergencyActive(false);
    setIsSosModalOpen(false);
    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: 'SOS Emergency Stand-Down',
        message: 'Emergency alarm cancelled by traveler. All contacts notified that traveler is safe.',
        timestamp: 'Just now',
        type: 'info',
        read: false,
      },
      ...prev,
    ]);
  };

  const simulateDisruption = (scenarioId: string) => {
    const scenario = DISRUPTION_SCENARIOS.find((s) => s.id === scenarioId) || DISRUPTION_SCENARIOS[0];
    setActiveDisruption(scenario);
    setIsDisruptionRecalculating(true);

    setTimeout(() => {
      const alt: MultimodalItinerary = {
        ...selectedItinerary,
        id: 'itin-recovered-' + Date.now(),
        title: 'RoamAgent Disruption Recovery Plan',
        tagline: 'Dynamically rerouted around ' + scenario.title,
        badgeLabel: 'Agentic Auto-Recovery',
        totalDurationMinutes: selectedItinerary.totalDurationMinutes + scenario.timeImpactMinutes,
        totalFare: selectedItinerary.totalFare + scenario.costImpact,
        overallSafetyScore: 97,
        dataFreshness: 'Agentic Recalculation Complete • Transfer verified',
        isRecommended: true,
        legs: selectedItinerary.legs.map((leg) => {
          if (leg.id === scenario.affectedLegId) {
            return {
              ...leg,
              operatorName: leg.operatorName + ' [Re-routed bypass]',
              durationMinutes: leg.durationMinutes + scenario.timeImpactMinutes,
              fare: leg.fare + scenario.costImpact,
              safetyFeatures: [...leg.safetyFeatures, 'Agentic Priority Re-routing'],
            };
          }
          return leg;
        }),
      };
      setDisruptionAlternative(alt);
      setIsDisruptionRecalculating(false);

      setNotifications((prev) => [
        {
          id: 'notif-' + Date.now(),
          title: `⚠️ Disruption Detected: ${scenario.title}`,
          message: `${scenario.description}. RoamAgent has generated an alternative schedule.`,
          timestamp: 'Just now',
          type: 'warning',
          read: false,
        },
        ...prev,
      ]);
    }, 1200);
  };

  const approveDisruptionRecovery = () => {
    if (disruptionAlternative) {
      setSelectedItinerary(disruptionAlternative);
      setNotifications((prev) => [
        {
          id: 'notif-' + Date.now(),
          title: '✅ Recovery Plan Approved & Synced',
          message: 'Your active trip schedule and digital tickets have been updated automatically.',
          timestamp: 'Just now',
          type: 'success',
          read: false,
        },
        ...prev,
      ]);
      setActiveDisruption(null);
      setDisruptionAlternative(null);
    }
  };

  const resetDisruption = () => {
    setActiveDisruption(null);
    setDisruptionAlternative(null);
  };

  const createBooking = (
    passengerName: string,
    age: number,
    gender: string,
    emergencyPhone: string,
    paymentMethod: 'UPI Demo' | 'Card Demo' | 'Cash on Boarding'
  ): BookingDetails => {
    const booking: BookingDetails = {
      bookingId: `ROAM-${Math.floor(100000 + Math.random() * 900000)}`,
      pnr: `IR${Math.floor(1000000 + Math.random() * 9000000)}`,
      itinerary: selectedItinerary,
      passengerName,
      passengerAge: age,
      passengerGender: gender,
      emergencyContact: emergencyPhone,
      seatSelections: selectedItinerary.legs.map((l, idx) => ({
        legId: l.id,
        seat: `Reserved Seat ${idx * 4 + 12} (${l.seatType || 'AC'})`,
      })),
      totalPaid: selectedItinerary.totalFare,
      paymentMethod,
      status: 'Confirmed',
      createdAt: new Date().toLocaleString(),
      qrCodeToken: `ROAM-SECURE-BOARDING-${Date.now()}`,
    };

    setBookings((prev) => [booking, ...prev]);
    setCurrentBooking(booking);

    // Asynchronously save booking to Supabase PostgreSQL database
    saveBookingToSupabase(booking);

    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: `🎉 Journey Booked (Saved to Supabase): ${booking.bookingId}`,
        message: `Multimodal booking confirmed for ${selectedItinerary.origin} → ${selectedItinerary.destination}. Synced with TRAVELTECHAI database.`,
        timestamp: 'Just now',
        type: 'success',
        read: false,
      },
      ...prev,
    ]);

    return booking;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <TravelContext.Provider
      value={{
        currentView,
        setCurrentView,
        language,
        setLanguage,
        t,
        supabaseConfig: SUPABASE_CONFIG,
        isSupabaseConnected,
        user,
        login,
        logout,
        register,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        origin,
        destination,
        setOrigin,
        setDestination,
        itineraries,
        selectedItinerary,
        setSelectedItinerary,
        handleSearchSubmit,
        contacts,
        addContact,
        deleteContact,
        isLiveSharingActive,
        toggleLiveSharing,
        isSosModalOpen,
        setIsSosModalOpen,
        isEmergencyActive,
        triggerEmergencySos,
        cancelEmergencySos,
        activeDisruption,
        disruptionAlternative,
        isDisruptionRecalculating,
        simulateDisruption,
        approveDisruptionRecovery,
        resetDisruption,
        currentBooking,
        bookings,
        createBooking,
        notifications,
        markNotificationAsRead,
        unreadNotificationsCount,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
