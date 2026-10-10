export type TransportMode = 'bus' | 'train' | 'metro' | 'cab' | 'walking';

export interface JourneyLeg {
  id: string;
  mode: TransportMode;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  fare: number; // in INR
  operatorName: string;
  vehicleNumber?: string;
  seatType?: string;
  transferWaitMinutes?: number;
  walkingDistanceMeters?: number;
  safetyScore: number; // 0 - 100
  safetyFeatures: string[];
  crowdDensity: 'Low' | 'Moderate' | 'High';
  isNightLeg: boolean;
}

export type ItineraryType = 'fastest' | 'budget' | 'safety';

export interface MultimodalItinerary {
  id: string;
  type: ItineraryType;
  title: string;
  tagline: string;
  badgeLabel: string;
  origin: string;
  destination: string;
  totalDurationMinutes: number;
  totalFare: number;
  transfersCount: number;
  overallSafetyScore: number;
  departureTime: string;
  arrivalTime: string;
  carbonEmissionKg: number;
  legs: JourneyLeg[];
  dataFreshness: string;
  isRecommended?: boolean;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  smsAlerts: boolean;
  whatsappAlerts: boolean;
}

export interface TravelNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
  actionUrl?: string;
}

export interface DisruptionScenario {
  id: string;
  title: string;
  description: string;
  affectedLegId: string;
  impactType: 'delay' | 'cancellation' | 'surge' | 'missed_connection';
  timeImpactMinutes: number;
  costImpact: number;
  recommendedAction: string;
}

export interface BookingDetails {
  bookingId: string;
  pnr: string;
  itinerary: MultimodalItinerary;
  passengerName: string;
  passengerAge: number;
  passengerGender: string;
  emergencyContact: string;
  seatSelections: { legId: string; seat: string }[];
  totalPaid: number;
  paymentMethod: 'UPI Demo' | 'Card Demo' | 'Cash on Boarding';
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
  qrCodeToken: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  safetyFilterEnabled: boolean;
  nightTravelAvoidance: boolean;
  femaleCoPassengerPreference: boolean;
  liveSharingActive: boolean;
  role?: 'passenger' | 'driver';
}

export interface SavedTrip {
  id: string;
  userId: string;
  itineraryId: string;
  title: string;
  origin: string;
  destination: string;
  totalFare: number;
  totalDurationMinutes: number;
  overallSafetyScore: number;
  transfersCount: number;
  departureTime: string;
  arrivalTime: string;
  itineraryData?: MultimodalItinerary;
  createdAt: string;
}

export type LuggageStatus =
  | 'Reported'
  | 'Photo Uploaded'
  | 'Awaiting Passenger Confirmation'
  | 'Claimed'
  | 'Return Coordinated';

export interface LostLuggageItem {
  id: string;
  trackingNumber: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  busNumber: string;
  operatorName: string;
  route: string;
  seatNumber?: string;
  photoUrl: string;
  description: string;
  depotName: string;
  depotAddress: string;
  depotCoordinates: {
    lat: number;
    lng: number;
  };
  reportedAt: string;
  status: LuggageStatus;
  claimedByPassengerId?: string;
  maskedPassengerName?: string;
  claimToken?: string;
  pickupOtp?: string;
  returnMethod?: 'depot_pickup' | 'terminal_helpdesk' | 'courier_dispatch';
  passengerVerificationNote?: string;
  coordinationNotes?: string;
}

export interface DriverProfile {
  id: string;
  name: string;
  badgeNumber: string;
  phone: string;
  operator: string;
  assignedBusNumber: string;
  currentRoute: string;
  avatarUrl: string;
}

