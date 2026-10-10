import React, { useState } from 'react';
import {
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { DISRUPTION_SCENARIOS } from '../data/mockTravelData';
import { DisruptionScenario } from '../types/travel';

export const DisruptionSimulatorView: React.FC = () => {
  const {
    selectedItinerary,
    activeDisruption,
    disruptionAlternative,
    isDisruptionRecalculating,
    simulateDisruption,
    approveDisruptionRecovery,
    resetDisruption,
    t,
  } = useTravel();

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DISRUPTION_SCENARIOS[0].id);

  const handleSimulate = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    simulateDisruption(scenarioId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-[#B45309] text-xs font-bold mb-2 border border-amber-200">
          <AlertTriangle className="w-4 h-4" />
          <span>Real-time Disruption Recovery Sentinel</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
          {t.disruption.title}
        </h2>
        <p className="text-sm text-[#667085] mt-1 max-w-3xl">
          {t.disruption.subtitle} Test how RoamAgent dynamically recovers travel schedules during unforeseen delays or cancellations.
        </p>
      </div>

      {/* Scenario Chooser Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {DISRUPTION_SCENARIOS.map((scen) => {
          const isActive = activeDisruption?.id === scen.id || (!activeDisruption && selectedScenarioId === scen.id);

          return (
            <div
              key={scen.id}
              onClick={() => handleSimulate(scen.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-50/50 border-[#B45309] ring-2 ring-[#B45309]/30 shadow-md'
                  : 'bg-white border-[#E4E7EC] hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309] bg-amber-100 px-2 py-0.5 rounded">
                  {scen.impactType.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold text-[#DC2626]">
                  +{scen.timeImpactMinutes} min
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#101828] line-clamp-2">{scen.title}</h4>
              <p className="text-[11px] text-[#667085] mt-1 line-clamp-2">{scen.description}</p>
              <button
                type="button"
                className="mt-3 text-xs font-bold text-[#0057FF] hover:underline flex items-center gap-1"
              >
                <span>Trigger Scenario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Recalculation Spinner */}
      {isDisruptionRecalculating && (
        <div className="p-8 rounded-3xl bg-white border border-[#E4E7EC] shadow-lg text-center space-y-4 my-8">
          <div className="w-12 h-12 rounded-full border-4 border-[#0057FF] border-t-transparent animate-spin mx-auto" />
          <h4 className="text-base font-bold text-[#101828]">
            RoamAgent Multi-Agent Reasoning in Progress...
          </h4>
          <p className="text-xs text-[#667085] max-w-md mx-auto">
            Evaluating alternate railway departures, bus transfers, and electric cab connections to guarantee arrival with minimal latency.
          </p>
        </div>
      )}

      {/* Side-by-Side Comparison: Original vs Alternative */}
      {disruptionAlternative && !isDisruptionRecalculating && (
        <div className="bg-white rounded-3xl border border-[#E4E7EC] shadow-xl p-6 sm:p-8 space-y-8 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E4E7EC] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#15803D] text-xs font-bold">
                  Alternative Route Synthesized
                </span>
                <span className="text-xs text-[#667085]">Transfer Feasibility: 98% Feasible</span>
              </div>
              <h3 className="text-xl font-bold text-[#101828] mt-1">
                Original vs Agentic Recovery Comparison
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={approveDisruptionRecovery}
                className="px-6 py-3 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0057FF]/30 flex items-center gap-2 cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.disruption.approveAlternative}</span>
              </button>
              <button
                onClick={resetDisruption}
                className="px-4 py-3 rounded-xl bg-[#F8F7F4] hover:bg-[#E4E7EC] text-xs font-semibold text-[#667085] cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Itinerary */}
            <div className="p-6 rounded-2xl bg-[#F8F7F4] border border-[#E4E7EC] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Original Itinerary
                </span>
                <span className="text-xs font-bold text-[#101828] bg-white px-2 py-0.5 rounded border border-[#E4E7EC]">
                  Status: Disrupted
                </span>
              </div>
              <h4 className="text-base font-bold text-[#101828]">{selectedItinerary.title}</h4>
              <p className="text-xs text-[#667085]">{selectedItinerary.tagline}</p>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#E4E7EC] text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#667085] block">Duration</span>
                  <span className="font-bold text-[#101828]">
                    {Math.floor(selectedItinerary.totalDurationMinutes / 60)}h{' '}
                    {selectedItinerary.totalDurationMinutes % 60}m
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] block">Fare</span>
                  <span className="font-bold text-[#101828]">₹{selectedItinerary.totalFare}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] block">Safety Index</span>
                  <span className="font-bold text-[#15803D]">
                    {selectedItinerary.overallSafetyScore}/100
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {selectedItinerary.legs.map((leg, i) => (
                  <div key={i} className="text-xs p-2.5 rounded-lg bg-white border border-[#E4E7EC]">
                    <span className="font-bold text-[#101828]">{leg.mode.toUpperCase()}: </span>
                    <span className="text-[#667085]">{leg.operatorName} ({leg.from} → {leg.to})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recalculated Alternative */}
            <div className="p-6 rounded-2xl bg-[#EAF0FF]/50 border-2 border-[#0057FF] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0057FF]">
                  RoamAgent Recovery Plan
                </span>
                <span className="text-xs font-bold text-white bg-[#0057FF] px-2 py-0.5 rounded shadow">
                  Optimized
                </span>
              </div>
              <h4 className="text-base font-bold text-[#101828]">{disruptionAlternative.title}</h4>
              <p className="text-xs text-[#667085]">{disruptionAlternative.tagline}</p>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-blue-200 text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#667085] block">Duration</span>
                  <span className="font-bold text-[#101828]">
                    {Math.floor(disruptionAlternative.totalDurationMinutes / 60)}h{' '}
                    {disruptionAlternative.totalDurationMinutes % 60}m
                  </span>
                  <span className="text-[10px] text-[#B45309] block">
                    (+{activeDisruption?.timeImpactMinutes}m)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] block">Fare</span>
                  <span className="font-bold text-[#0057FF]">₹{disruptionAlternative.totalFare}</span>
                  <span className="text-[10px] text-[#667085] block">
                    (+₹{activeDisruption?.costImpact})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] block">Safety Index</span>
                  <span className="font-bold text-[#15803D]">
                    {disruptionAlternative.overallSafetyScore}/100
                  </span>
                  <span className="text-[10px] text-[#15803D] block">Verified</span>
                </div>
              </div>

              <div className="space-y-2">
                {disruptionAlternative.legs.map((leg, i) => (
                  <div key={i} className="text-xs p-2.5 rounded-lg bg-white border border-blue-200">
                    <span className="font-bold text-[#0057FF]">{leg.mode.toUpperCase()}: </span>
                    <span className="text-[#101828]">{leg.operatorName}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-white border border-blue-200 text-xs text-[#101828]">
                <strong className="text-[#0057FF]">Agentic Recovery Action:</strong>{' '}
                {activeDisruption?.recommendedAction}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
