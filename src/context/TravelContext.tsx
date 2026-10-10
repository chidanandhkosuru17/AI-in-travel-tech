import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MultimodalItinerary,
  TrustedContact,
  TravelNotification,
  DisruptionScenario,
  BookingDetails,
  UserProfile,
  SavedTrip,
  LostLuggageItem,
  LuggageStatus,
  DriverProfile,
} from '../types/travel';
import {
  DEFAULT_ITINERARIES,
  DEFAULT_CONTACTS,
  DEFAULT_NOTIFICATIONS,
  DISRUPTION_SCENARIOS,
  INITIAL_LOST_LUGGAGE,
  DRIVER_PROFILES,
} from '../data/mockTravelData';
import { Language, translations } from '../translations';
import {
  supabase,
  SUPABASE_CONFIG,
  saveBookingToSupabase,
  saveContactToSupabase,
  saveTripToSupabase,
  removeSavedTripFromSupabase,
  fetchUserSavedTripsFromSupabase,
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

  // Saved / Liked Trips (Stored in Supabase linked to User)
  savedTrips: SavedTrip[];
  isTripSaved: (itineraryId: string) => boolean;
  toggleSaveTrip: (itinerary: MultimodalItinerary) => Promise<{ saved: boolean; error?: string }>;
  removeSavedTrip: (itineraryId: string) => Promise<void>;

  // Notifications
  notifications: TravelNotification[];
  markNotificationAsRead: (id: string) => void;
  unreadNotificationsCount: number;

  // Lost Luggage Recovery
  lostLuggageItems: LostLuggageItem[];
  activeDriver: DriverProfile;
  setActiveDriver: (driver: DriverProfile) => void;
  isDriverMode: boolean;
  setIsDriverMode: (isDriver: boolean) => void;
  reportFoundLuggage: (data: {
    busNumber: string;
    route: string;
    seatNumber?: string;
    description: string;
    photoUrl: string;
    depotName: string;
    depotAddress: string;
    depotCoordinates: { lat: number; lng: number };
  }) => LostLuggageItem;
  confirmLuggageClaim: (luggageId: string, isMine: boolean, verificationNote?: string) => void;
  updateLuggageStatus: (luggageId: string, newStatus: LuggageStatus, coordinationNotes?: string) => void;
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

  // Saved / Liked Trips (Stored in Supabase linked to user)
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);

  // Lost Luggage Recovery State
  const [lostLuggageItems, setLostLuggageItems] = useState<LostLuggageItem[]>(INITIAL_LOST_LUGGAGE);
  const [activeDriver, setActiveDriver] = useState<DriverProfile>(DRIVER_PROFILES[0]);
  const [isDriverMode, setIsDriverMode] = useState<boolean>(false);

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

  // Fetch user's saved trips whenever user logs in or changes
  useEffect(() => {
    if (!user) {
      setSavedTrips([]);
      return;
    }

    // Load from local storage cache first for instant UI response
    try {
      const cached = localStorage.getItem(`saved_trips_${user.id}`);
      if (cached) {
        setSavedTrips(JSON.parse(cached));
      }
    } catch (e) {
      // ignore
    }

    // Synchronize from Supabase
    fetchUserSavedTripsFromSupabase(user.id).then(({ success, data }) => {
      if (success && data && data.length > 0) {
        const mapped: SavedTrip[] = data.map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          itineraryId: item.itinerary_id,
          title: item.title,
          origin: item.origin,
          destination: item.destination,
          totalFare: Number(item.total_fare),
          totalDurationMinutes: item.total_duration_minutes,
          overallSafetyScore: item.overall_safety_score,
          transfersCount: item.transfers_count,
          departureTime: item.departure_time,
          arrivalTime: item.arrival_time,
          itineraryData: item.itinerary_data,
          createdAt: item.created_at,
        }));
        setSavedTrips(mapped);
        try {
          localStorage.setItem(`saved_trips_${user.id}`, JSON.stringify(mapped));
        } catch (e) {
          // ignore
        }
      }
    });
  }, [user?.id]);

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
            message: `Welcome to RouteZen, ${name}! Your account is created in TRAVELTECHAI.`,
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
        title: 'RouteZen Disruption Recovery Plan',
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
          message: `${scenario.description}. RouteZen has generated an alternative schedule.`,
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
    saveBookingToSupabase(booking, user?.id);

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

  // Check if a given itinerary is already liked / saved
  const isTripSaved = (itineraryId: string): boolean => {
    return savedTrips.some((t) => t.itineraryId === itineraryId);
  };

  // Toggle save / like trip for logged in user
  const toggleSaveTrip = async (
    itinerary: MultimodalItinerary
  ): Promise<{ saved: boolean; error?: string }> => {
    if (!user) {
      setIsAuthModalOpen(true);
      return { saved: false, error: 'Please sign in or create an account to like and save trips.' };
    }

    const alreadySaved = isTripSaved(itinerary.id);

    if (alreadySaved) {
      // Remove trip
      const updated = savedTrips.filter((t) => t.itineraryId !== itinerary.id);
      setSavedTrips(updated);
      try {
        localStorage.setItem(`saved_trips_${user.id}`, JSON.stringify(updated));
      } catch (e) {
        // ignore
      }

      await removeSavedTripFromSupabase(user.id, itinerary.id);

      setNotifications((prev) => [
        {
          id: 'notif-' + Date.now(),
          title: 'Trip Removed from Saved',
          message: `"${itinerary.title}" was removed from your profile.`,
          timestamp: 'Just now',
          type: 'info',
          read: false,
        },
        ...prev,
      ]);

      return { saved: false };
    } else {
      // Add / Save trip
      const newTrip: SavedTrip = {
        id: 'saved-' + Date.now(),
        userId: user.id,
        itineraryId: itinerary.id,
        title: itinerary.title,
        origin: itinerary.origin,
        destination: itinerary.destination,
        totalFare: itinerary.totalFare,
        totalDurationMinutes: itinerary.totalDurationMinutes,
        overallSafetyScore: itinerary.overallSafetyScore,
        transfersCount: itinerary.transfersCount,
        departureTime: itinerary.departureTime,
        arrivalTime: itinerary.arrivalTime,
        itineraryData: itinerary,
        createdAt: new Date().toISOString(),
      };

      const updated = [newTrip, ...savedTrips];
      setSavedTrips(updated);
      try {
        localStorage.setItem(`saved_trips_${user.id}`, JSON.stringify(updated));
      } catch (e) {
        // ignore
      }

      // Sync to Supabase table
      await saveTripToSupabase({
        userId: user.id,
        itineraryId: itinerary.id,
        title: itinerary.title,
        origin: itinerary.origin,
        destination: itinerary.destination,
        totalFare: itinerary.totalFare,
        totalDurationMinutes: itinerary.totalDurationMinutes,
        overallSafetyScore: itinerary.overallSafetyScore,
        transfersCount: itinerary.transfersCount,
        departureTime: itinerary.departureTime,
        arrivalTime: itinerary.arrivalTime,
        itineraryData: itinerary,
      });

      setNotifications((prev) => [
        {
          id: 'notif-' + Date.now(),
          title: '❤️ Trip Liked & Saved to Supabase',
          message: `"${itinerary.title}" is saved in your TRAVELTECHAI profile for ${user.name}.`,
          timestamp: 'Just now',
          type: 'success',
          read: false,
        },
        ...prev,
      ]);

      return { saved: true };
    }
  };

  const removeSavedTrip = async (itineraryId: string) => {
    if (!user) return;
    const updated = savedTrips.filter((t) => t.itineraryId !== itineraryId);
    setSavedTrips(updated);
    try {
      localStorage.setItem(`saved_trips_${user.id}`, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
    await removeSavedTripFromSupabase(user.id, itineraryId);
  };

  const reportFoundLuggage = (data: {
    busNumber: string;
    route: string;
    seatNumber?: string;
    description: string;
    photoUrl: string;
    depotName: string;
    depotAddress: string;
    depotCoordinates: { lat: number; lng: number };
  }): LostLuggageItem => {
    const newItem: LostLuggageItem = {
      id: 'lug-' + Date.now(),
      trackingNumber: `ROAM-BAG-${Math.floor(1000 + Math.random() * 9000)}`,
      driverId: activeDriver.id,
      driverName: activeDriver.name,
      driverPhone: activeDriver.phone,
      busNumber: data.busNumber,
      operatorName: activeDriver.operator,
      route: data.route,
      seatNumber: data.seatNumber || 'Unassigned / Overhead',
      photoUrl: data.photoUrl,
      description: data.description,
      depotName: data.depotName,
      depotAddress: data.depotAddress,
      depotCoordinates: data.depotCoordinates,
      reportedAt: 'Just now',
      status: 'Awaiting Passenger Confirmation',
      pickupOtp: String(Math.floor(1000 + Math.random() * 9000)),
      maskedPassengerName: 'Waiting for passenger claim...',
    };

    setLostLuggageItems((prev) => [newItem, ...prev]);

    // Send in-app notification to passengers on that journey
    setNotifications((prev) => [
      {
        id: 'notif-lug-' + Date.now(),
        title: `🧳 Possible Lost Luggage Found on Bus ${newItem.busNumber}`,
        message: `Driver ${activeDriver.name} reported found luggage on ${newItem.route} (${newItem.seatNumber}). Tap to review and confirm: "Is this your luggage?"`,
        timestamp: 'Just now',
        type: 'alert',
        read: false,
      },
      ...prev,
    ]);

    return newItem;
  };

  const confirmLuggageClaim = (luggageId: string, isMine: boolean, verificationNote?: string) => {
    setLostLuggageItems((prev) =>
      prev.map((item) => {
        if (item.id === luggageId) {
          if (isMine) {
            const masked = user
              ? `${user.name.charAt(0)}***** ${user.name.split(' ').slice(-1)[0]?.charAt(0) || ''}.`
              : 'P***** K.';
            return {
              ...item,
              status: 'Claimed',
              claimedByPassengerId: user?.id || 'passenger-current',
              maskedPassengerName: masked,
              passengerVerificationNote: verificationNote || 'Passenger identified items inside luggage',
              returnMethod: 'depot_pickup',
              coordinationNotes: 'Claim verified by passenger. Safe pickup PIN generated for depot handover.',
            };
          } else {
            return item;
          }
        }
        return item;
      })
    );

    if (isMine) {
      setNotifications((prev) => [
        {
          id: 'notif-' + Date.now(),
          title: '✅ Luggage Claim Confirmed',
          message: `Your ownership claim was verified. Return coordination initiated. Please show your pickup OTP to depot security.`,
          timestamp: 'Just now',
          type: 'success',
          read: false,
        },
        ...prev,
      ]);
    } else {
      setNotifications((prev) => [
        {
          id: 'notif-' + Date.now(),
          title: 'Luggage Inquiry Dismissed',
          message: 'Thank you for confirming. The item remains listed for fellow passengers on the bus.',
          timestamp: 'Just now',
          type: 'info',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const updateLuggageStatus = (luggageId: string, newStatus: LuggageStatus, coordinationNotes?: string) => {
    setLostLuggageItems((prev) =>
      prev.map((item) => {
        if (item.id === luggageId) {
          return {
            ...item,
            status: newStatus,
            coordinationNotes: coordinationNotes || item.coordinationNotes,
          };
        }
        return item;
      })
    );

    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: `Luggage Status Updated: ${newStatus}`,
        message: `Tracking status updated for luggage item. Protocol: ${coordinationNotes || newStatus}`,
        timestamp: 'Just now',
        type: 'info',
        read: false,
      },
      ...prev,
    ]);
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
        savedTrips,
        isTripSaved,
        toggleSaveTrip,
        removeSavedTrip,
        notifications,
        markNotificationAsRead,
        unreadNotificationsCount,
        lostLuggageItems,
        activeDriver,
        setActiveDriver,
        isDriverMode,
        setIsDriverMode,
        reportFoundLuggage,
        confirmLuggageClaim,
        updateLuggageStatus,
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
