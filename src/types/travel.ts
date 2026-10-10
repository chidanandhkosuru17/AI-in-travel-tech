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
}
