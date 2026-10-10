import React from 'react';
import { TravelProvider, useTravel } from './context/TravelContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DashboardView } from './components/DashboardView';
import { AIAssistantView } from './components/AIAssistantView';
import { RouteComparisonView } from './components/RouteComparisonView';
import { SafetyCenterView } from './components/SafetyCenterView';
import { DisruptionSimulatorView } from './components/DisruptionSimulatorView';
import { BookingCheckoutView } from './components/BookingCheckoutView';
import { MyJourneysView } from './components/MyJourneysView';
import { LostLuggageView } from './components/LostLuggageView';
import { DriverPortalView } from './components/DriverPortalView';
import { InquiryView } from './components/InquiryView';
import { UserProfileView } from './components/UserProfileView';
import { LuggageConfirmationBanner } from './components/LuggageConfirmationBanner';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentView } = useTravel();

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#101828] flex flex-col font-sans selection:bg-[#0057FF] selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area based on current view */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection />
            <DashboardView />
          </>
        )}

        {currentView === 'assistant' && <AIAssistantView />}
        {currentView === 'plan' && <RouteComparisonView />}
        {currentView === 'compare' && <RouteComparisonView />}
        {currentView === 'safety' && <SafetyCenterView />}
        {currentView === 'disruption' && <DisruptionSimulatorView />}
        {currentView === 'checkout' && <BookingCheckoutView />}
        {currentView === 'my-journeys' && <MyJourneysView />}
        {currentView === 'luggage' && <LostLuggageView />}
        {currentView === 'driver-portal' && <DriverPortalView />}
        {currentView === 'inquiry' && <InquiryView />}
        {currentView === 'profile' && <UserProfileView />}
      </main>

      {/* In-App Interactive Luggage Confirmation for Passengers */}
      <LuggageConfirmationBanner />

      {/* Global Modals */}
      <EmergencySOSModal />
      <AuthModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <TravelProvider>
      <AppContent />
    </TravelProvider>
  );
}
