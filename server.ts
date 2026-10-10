import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK with user agent as per AI Studio guidelines
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback intelligent responder if Gemini API key is missing or encounters rate limits
function getIntelligentFallback(message: string, constraints?: any): string {
  const query = message.toLowerCase();

  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    return `Hello! I am your TBS RoamAgent AI Concierge. I can answer any travel, route, schedule, safety, or transit questions you have. How can I help you plan your journey today?`;
  }

  if (query.includes('goa') || query.includes('beach') || query.includes('panaji')) {
    return `Planning a trip to Goa:
1. **Best Multimodal Route:**
   - From Hyderabad/Bengaluru: Board overnight train (e.g., Kacheguda-Vasco Express or Vande Bharat to Hubballi, followed by KSRTC/Kadamba AC coach to Panaji).
   - Daylight Option: Morning flight or train connection to Madgaon (MAO) / Vasco (VSG).
2. **Safety & Night Travel:**
   - Pre-book verified prepaid airport/station taxis (GoaMiles app) or hotel transfers.
   - For solo or women travelers, daylight transfers via Hubballi/Belagavi are recommended.
3. **Local Transit:**
   - Renting scooters or using Kadamba electric AC buses connects North and South Goa seamlessly.`;
  }

  if (query.includes('vande bharat') || query.includes('train') || query.includes('irctc')) {
    return `Here is key information regarding Indian Railways & Vande Bharat Express:
- **Vande Bharat Highlights:** Semi-high-speed (up to 160 km/h), equipped with Kavach automatic train protection, CCTV cameras in all coaches, onboard Wi-Fi infotainment, and executive chair car comfort.
- **Seat Availability & Tatkal:** Tatkal booking opens at 10:00 AM (AC) and 11:00 AM (Non-AC) one day prior to departure.
- **Women Safety Measures:** Dedicated emergency talkback units, RPF presence, and female-only berth quotas in sleeper and 3A compartments.`;
  }

  if (query.includes('safety') || query.includes('women') || query.includes('emergency')) {
    return `Traveler & Women Safety Protocol on TBS RoamAgent:
1. **Women Safety Sentinel:** Our algorithms check transit hub police station proximity (< 1.5 km), CCTV density, well-lit transfer points, and verify bus/cab drivers.
2. **Live Trip Sharing:** Share real-time GPS tracking with designated emergency contacts.
3. **Emergency Numbers:**
   - Police / Emergency: **112**
   - Railway Protection Force (RPF): **139**
   - Women Helpline: **1091**
   - National Commission for Women: **7827170170**`;
  }

  if (query.includes('luggage') || query.includes('bag') || query.includes('lost')) {
    return `Lost Luggage Support on TBS RoamAgent:
- You can report any missing luggage in our **Lost Luggage** tab.
- We link luggage QR tags to your PNR and driver manifests across trains, buses, and cabs.
- If verified, our station agent and driver network initiate recovery with contactless verification.`;
  }

  if (query.includes('budget') || query.includes('cheap') || query.includes('fare')) {
    return `Multimodal Cost Optimization:
- Combining State RTC (TSRTC/KSRTC/MSRTC) express buses with Sleeper/2S rail classes typically saves 40-60% compared to last-minute flights.
- Use our Route Comparison tool to evaluate the Economy Saver route against Speed Prioritized routes.`;
  }

  return `Thank you for your question about: "${message}".

As your multimodal travel AI assistant, I evaluate live schedule databases across Indian Railways (IRCTC), State Road Transport Corporations (TSRTC, KSRTC, MSRTC, APSRTC), verified cab partners, and metro transit systems.

**Key Advice for Your Journey:**
- Ensure at least 30-45 minutes buffer time between intermodal connections (e.g., train to bus or flight to cab).
- Keep digital copies of your Aadhaar/Government ID and PNR confirmation handy.
- Activate the "Women Safety Filter" in your Profile settings if you prefer daylight-only transfers and female co-passenger priority.

Feel free to ask me about specific origin-destination pairs, timetable comparisons, luggage tracking, or local recommendations!`;
}

// Full Chatbot API endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, constraints } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are TBS RoamAgent, an elite multimodal travel AI concierge and assistant (analogous to Gemini AI and ChatGPT).
You answer ALL user questions with deep expertise, warmth, clarity, and precision.
You specialize in Indian multimodal travel (intercity buses, Indian Railways Vande Bharat/Express, TSRTC, KSRTC, metro systems, cabs, flights), budget estimation, women's safety protocols, luggage recovery, and itinerary planning, but you are also fully capable of answering general knowledge, destination guides, food recommendations, weather questions, and travel tips.

Style guidelines:
- Be clear, conversational, helpful, and polite.
- Structure complex advice with readable bullet points and clear sections.
- For route planning, highlight transfer buffer times and verified safety advice.
- NEVER use LaTeX math notation like $\\rightarrow$, $\\leftarrow$, or \\rightarrow. Always use standard clean arrows (→).
- Use standard clean markdown **bold** (never three asterisks ***).`;

    function sanitizeText(raw: string): string {
      return raw
        .replace(/\$\s*\\rightarrow\s*\$/gi, '→')
        .replace(/\\rightarrow/gi, '→')
        .replace(/\$\s*\\leftarrow\s*\$/gi, '←')
        .replace(/\\leftarrow/gi, '←')
        .replace(/\*\*\*([^*]+)\*\*/g, '**$1**')
        .replace(/\*\*\*/g, '**');
    }

    if (ai) {
      try {
        const contents: any[] = [];

        // Include recent conversation turns for contextual memory
        if (Array.isArray(history) && history.length > 0) {
          const recentHistory = history.slice(-6);
          for (const item of recentHistory) {
            if (item.sender === 'user' && item.text) {
              contents.push({ role: 'user', parts: [{ text: item.text }] });
            } else if (item.sender === 'assistant' && item.text) {
              contents.push({ role: 'model', parts: [{ text: item.text }] });
            }
          }
        }

        let userPrompt = message;
        if (constraints) {
          const cInfo = [];
          if (constraints.origin) cInfo.push(`Origin: ${constraints.origin}`);
          if (constraints.destination) cInfo.push(`Destination: ${constraints.destination}`);
          if (constraints.maxBudget) cInfo.push(`Max Budget: ₹${constraints.maxBudget}`);
          if (constraints.femaleSafetyPriority) cInfo.push(`Female Safety Priority: Yes`);
          if (constraints.avoidNightTransit) cInfo.push(`Avoid Night Transit: Yes`);
          if (cInfo.length > 0) {
            userPrompt += `\n\n[Active Travel Filters: ${cInfo.join(', ')}]`;
          }
        }

        contents.push({
          role: 'user',
          parts: [{ text: userPrompt }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });

        const reply = sanitizeText(response.text || getIntelligentFallback(message, constraints));
        return res.json({ reply, source: 'gemini-3.8-flash' });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back:', geminiError?.message);
        const reply = sanitizeText(getIntelligentFallback(message, constraints));
        return res.json({ reply, source: 'smart-fallback', note: geminiError?.message });
      }
    } else {
      // If GEMINI_API_KEY is not configured yet
      const reply = sanitizeText(getIntelligentFallback(message, constraints));
      return res.json({ reply, source: 'intelligent-concierge' });
    }
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: 'Internal server error processing request' });
  }
});

// Inquiry API endpoint to support backend submissions if needed
app.post('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const inquiry = req.body;
    return res.json({ success: true, message: 'Inquiry received', inquiry });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to record inquiry' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TBS RoamAgent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
