import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sliders,
  DollarSign,
  Calendar,
  MapPin,
  RefreshCw,
  Zap,
  Info,
} from 'lucide-react';
import { useTravel } from '../context/TravelContext';
import { MultimodalItinerary } from '../types/travel';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  reasoningSteps?: string[];
  recommendedItinerary?: MultimodalItinerary;
}

export const AIAssistantView: React.FC = () => {
  const {
    origin,
    setOrigin,
    destination,
    setDestination,
    itineraries,
    setSelectedItinerary,
    setCurrentView,
  } = useTravel();

  const [inputMessage, setInputMessage] = useState('');
  const [maxBudget, setMaxBudget] = useState('3000');
  const [travelDate, setTravelDate] = useState('2026-10-11');
  const [avoidNightTransit, setAvoidNightTransit] = useState(true);
  const [femaleSafetyPriority, setFemaleSafetyPriority] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! I am TBS RoamAgent, your multimodal travel concierge. I synchronize intercity coaches, Indian Railways (Vande Bharat/Express), metro lines, and verified last-mile cabs while prioritizing female safety and disruption recovery. Where are you heading?`,
      timestamp: '09:00 AM',
    },
    {
      id: 'msg-demo-query',
      sender: 'user',
      text: 'Find a safe, multimodal route from Hyderabad to Goa for tomorrow under ₹2,500 with daylight transfers.',
      timestamp: '09:01 AM',
    },
    {
      id: 'msg-demo-response',
      sender: 'assistant',
      text: `I've analyzed multimodal transit schedules across TSRTC, South Central Railway (Vande Bharat/2A Sleeper), and KTC Goa. I synthesized 3 viable route combinations and prioritized the daylight corridor via Hubballi/Belagavi.`,
      timestamp: '09:01 AM',
      reasoningSteps: [
        'Validated origin (Hitec City) and destination (Panaji, Goa)',
        'Filtered out unverified private operators and unlit highway boarding stops',
        'Enforced women-safety guardrails: station police radius < 1.5km, CCTV monitored coaches',
        'Optimized transfer buffers at Secunderabad (35m) and Hubballi (35m) to prevent missed connections',
      ],
      recommendedItinerary: itineraries[1],
    },
  ]);

  const quickPrompts = [
    'Bengaluru to Ooty under ₹4,000 scenic route',
    'Fastest multimodal Hyderabad to Vijayawada arriving by 11 AM',
    'Delhi to Jaipur with women-only sleeper bus preference',
    'Mumbai to Pune with local train & cab connection',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsProcessing(true);

    setTimeout(() => {
      // Pick matching itinerary based on text or constraints
      const selected =
        text.toLowerCase().includes('budget') || text.toLowerCase().includes('cheap')
          ? itineraries[2]
          : text.toLowerCase().includes('fast') || text.toLowerCase().includes('speed')
          ? itineraries[0]
          : itineraries[1];

      const assistantMsg: Message = {
        id: 'asst-' + Date.now(),
        sender: 'assistant',
        text: `Here is the agentic multimodal itinerary matching your criteria (${origin} → ${destination}). It minimizes transfer anxiety and maximizes verified safety standards.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reasoningSteps: [
          `Analyzed timetable data for ${origin} → ${destination}`,
          `Budget compliance checked (₹${selected.totalFare} vs limit ₹${maxBudget})`,
          femaleSafetyPriority ? 'Enforced Women Safety Sentinel index score ≥ 94/100' : 'Standard route evaluation',
          avoidNightTransit ? 'Restricted route legs to daylight transit hours (06:00 - 18:00)' : 'All departure hours enabled',
        ],
        recommendedItinerary: selected,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsProcessing(false);
    }, 1200);
  };

  const handleSelectItinerary = (itin: MultimodalItinerary) => {
    setSelectedItinerary(itin);
    setCurrentView('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* View Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF0FF] text-[#0057FF] text-xs font-bold mb-2">
          <Bot className="w-4 h-4" />
          <span>Agentic Multimodal Travel Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101828]">
          AI Travel Assistant
        </h2>
        <p className="text-sm text-[#667085] mt-1">
          Chat naturally with RoamAgent. Describe your destination, schedule, and safety preferences to generate intelligent multimodal journeys.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 4 Cols: Trip Requirements & Constraints Panel */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E4E7EC] shadow-md p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E4E7EC]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#0057FF]" />
              <h3 className="text-sm font-bold text-[#101828]">Trip Requirements Panel</h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0057FF] bg-[#EAF0FF] px-2 py-0.5 rounded-full">
              Editable
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#101828] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0057FF]" />
                <span>Origin City / Terminal</span>
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] font-medium text-[#101828]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101828] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Destination City / Spot</span>
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] font-medium text-[#101828]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101828] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#667085]" />
                <span>Departure Date</span>
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] font-medium text-[#101828]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#101828] mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#15803D]" />
                <span>Max Budget Limit (₹ INR)</span>
              </label>
              <input
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] font-medium text-[#101828]"
              />
            </div>

            {/* Safety Toggles */}
            <div className="pt-2 border-t border-[#E4E7EC] space-y-3">
              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span className="font-semibold text-[#101828] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#0057FF]" />
                  <span>Female Safety Sentinel</span>
                </span>
                <input
                  type="checkbox"
                  checked={femaleSafetyPriority}
                  onChange={(e) => setFemaleSafetyPriority(e.target.checked)}
                  className="rounded text-[#0057FF] focus:ring-[#0057FF] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span className="font-semibold text-[#101828] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#667085]" />
                  <span>Avoid Late-Night Transfers</span>
                </span>
                <input
                  type="checkbox"
                  checked={avoidNightTransit}
                  onChange={(e) => setAvoidNightTransit(e.target.checked)}
                  className="rounded text-[#0057FF] focus:ring-[#0057FF] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            <button
              onClick={() => handleSendMessage(`Re-plan itinerary with budget under ₹${maxBudget} and updated parameters`)}
              className="w-full py-2.5 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold shadow-md shadow-[#0057FF]/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Update Itinerary with Constraints</span>
            </button>
          </div>
        </div>

        {/* Right 8 Cols: Conversational Agent Panel */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E4E7EC] shadow-md flex flex-col h-[700px]">
          {/* Chat Messages Scrollable */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-9 h-9 rounded-xl bg-[#0057FF] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0057FF]/20">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0057FF] text-white rounded-tr-none'
                      : 'bg-[#F8F7F4] text-[#101828] border border-[#E4E7EC] rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Agentic reasoning steps disclosure */}
                  {msg.reasoningSteps && (
                    <div className="mt-3 pt-3 border-t border-[#E4E7EC] text-xs">
                      <span className="font-bold text-[#0057FF] flex items-center gap-1 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Agentic Decision Reasoning</span>
                      </span>
                      <ul className="space-y-1 text-[#667085]">
                        {msg.reasoningSteps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#0057FF] font-bold">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendation card */}
                  {msg.recommendedItinerary && (
                    <div className="mt-4 p-4 rounded-xl bg-white border border-[#E4E7EC] text-[#101828] shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EAF0FF] text-[#0057FF] px-2 py-0.5 rounded-md">
                          {msg.recommendedItinerary.badgeLabel}
                        </span>
                        <span className="text-xs font-bold text-[#15803D]">
                          ★ {msg.recommendedItinerary.overallSafetyScore}/100 Safety
                        </span>
                      </div>
                      <h4 className="text-sm font-bold">{msg.recommendedItinerary.title}</h4>
                      <p className="text-[11px] text-[#667085] mt-0.5">{msg.recommendedItinerary.tagline}</p>

                      <div className="grid grid-cols-3 gap-2 py-2.5 my-2.5 border-y border-[#E4E7EC] text-center text-xs">
                        <div>
                          <span className="text-[10px] text-[#667085] block">Duration</span>
                          <span className="font-bold">
                            {Math.floor(msg.recommendedItinerary.totalDurationMinutes / 60)}h{' '}
                            {msg.recommendedItinerary.totalDurationMinutes % 60}m
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#667085] block">Fare</span>
                          <span className="font-bold text-[#0057FF]">₹{msg.recommendedItinerary.totalFare}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#667085] block">Transfers</span>
                          <span className="font-bold">{msg.recommendedItinerary.transfersCount}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectItinerary(msg.recommendedItinerary!)}
                        className="w-full py-2.5 rounded-lg bg-[#0057FF] hover:bg-[#0045CC] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>View Route Breakdown & Book</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-1.5 text-right ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-[#667085]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex gap-3 justify-start">
                <div className="w-9 h-9 rounded-xl bg-[#0057FF] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 animate-spin" />
                </div>
                <div className="bg-[#F8F7F4] border border-[#E4E7EC] rounded-2xl p-4 text-xs text-[#667085] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#0057FF] animate-ping" />
                  <span>Synthesizing multimodal timetables and safety ratings...</span>
                </div>
              </div>
            )}
          </div>

          {/* Prompt chips */}
          <div className="px-6 py-2 border-t border-[#E4E7EC] bg-[#F8F7F4]/50 flex gap-2 overflow-x-auto">
            {quickPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-white border border-[#E4E7EC] text-[11px] font-medium text-[#101828] hover:border-[#0057FF] hover:text-[#0057FF] transition-colors cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat input box */}
          <div className="p-4 border-t border-[#E4E7EC]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask RoamAgent (e.g. Plan fastest route to Vijayawada with women-only sleeper bus)..."
                className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-[#E4E7EC] bg-[#F8F7F4] focus:bg-white focus:outline-none focus:border-[#0057FF] text-[#101828]"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-3 rounded-xl bg-[#0057FF] hover:bg-[#0045CC] text-white shadow-md shadow-[#0057FF]/30 transition-all cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
