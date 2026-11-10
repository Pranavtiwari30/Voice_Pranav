# 🎙️ Voice Interview Assistant — Pranav Tiwari

A voice-enabled, interactive AI interview assistant representing **Pranav Tiwari** (AI Engineer & Systems Builder). Built with **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**, and **Google Gemini** via the official `@google/genai` SDK.

The assistant is grounded in real experience and facts from `personality.md` and `info.md`. Visitors can talk via their microphone, listen to natural spoken responses, or type questions whenever voice input is not supported.

---

## 🌟 Key Features

- **Natural Voice Interaction**:
  - **Speech-to-Text**: Browser Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) with real-time interim transcript display and silence auto-submission.
  - **Text-to-Speech**: Browser `SpeechSynthesis` API with high-quality English voice selection and natural conversational cadence.
  - **Turn-Based Coordination**: The assistant never listens to itself; listening and speaking states are strictly mutually exclusive.
  - **Replay & Interrupt Controls**: Instantly stop ongoing speech or replay the assistant's previous answer with a single click.
- **Dynamic Conversational AI**:
  - Powered by **Gemini 3.8 Flash** via `@google/genai`.
  - Configurable model name via `GEMINI_MODEL` environment variable.
  - Multi-turn conversational context: supports natural follow-up questions without losing context.
  - Spoken-first response formatting: 2–5 flowing sentences (~15–30s spoken), free of distracting markdown asterisks, raw bullets, or unnatural symbols.
- **Grounded Knowledge Base**:
  - Server-side only loader for `personality.md` (voice playbook, values, tone) and `info.md` (verified factual knowledge base).
  - Strict anti-hallucination rules: acknowledges unknown facts honestly rather than inventing credentials, numbers, or experiences.
- **Enterprise-Grade Security & Reliability**:
  - Server-only API key handling (no keys leaked to browser or bundles).
  - Request validation using **Zod** (bounded message length, sanitized history).
  - Built-in IP rate limiter (sliding window token bucket) to protect public serverless endpoints against abuse.
  - Graceful degradation: fallbacks for missing API key (`CONFIG_ERROR`), rate limits (`RATE_LIMIT`), and unsupported browsers.

---

## 🏗️ Architecture Overview

```
                      ┌──────────────────────────────────────────────┐
                      │              Client Layer                    │
                      │                                              │
                      │   InterviewApp (State & Voice Coordination)  │
                      │   ├── ConversationPanel (Transcript)         │
                      │   ├── VoiceControls (Mic, Stop, Replay)      │
                      │   ├── SuggestedQuestions (Starter Chips)     │
                      │   └── TextComposer (Keyboard Fallback)       │
                      └──────────────┬───────────────────────────────┘
                                     │
                     User Transcript │ /api/chat (POST)
                     + Recent History│ JSON: { message, history }
                                     ▼
                      ┌──────────────────────────────────────────────┐
                      │              Server Layer                    │
                      │                                              │
                      │   POST /api/chat                             │
                      │   ├── IP Rate Limiter (Token Bucket)         │
                      │   ├── Zod Request Validation                 │
                      │   ├── Knowledge Loader (Server-only)         │
                      │   │   ├── personality.md                     │
                      │   │   └── info.md (about.md)                 │
                      │   ├── Prompt Builder (System Instructions)   │
                      │   └── Gemini Service (@google/genai)         │
                      │       └── Gemini 3.8 Flash                   │
                      └──────────────┬───────────────────────────────┘
                                     │
                        Spoken Clean │ JSON: { answer }
                                Text │
                                     ▼
                      ┌──────────────────────────────────────────────┐
                      │          Browser Speech Synthesis            │
                      │                                              │
                      │   Reads answer aloud in first person as      │
                      │   Pranav with natural prosody and tempo      │
                      └──────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Serverless Node.js runtime) |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS (Dark theme, responsive, custom animations) |
| **AI Model** | Google Gemini 3.8 Flash (`gemini-3.8-flash`) |
| **AI SDK** | `@google/genai` (Official Google Gen AI SDK) |
| **Speech-to-Text** | Browser Web Speech API (`SpeechRecognition`) |
| **Text-to-Speech** | Browser SpeechSynthesis API (`speechSynthesis`) |
| **Validation** | Zod |
| **Deployment** | Vercel (Production ready) |

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js 18+ (tested on Node.js 22)
- npm or pnpm or yarn
- Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 2. Installation
```bash
git clone <your-repo-url>
cd voice
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser (Google Chrome or Microsoft Edge recommended for native microphone SpeechRecognition).

---

## 🧪 Testing and Verification

### Production Build Test
```bash
npm run build
npm run start
```

### API Endpoint Test (cURL)
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is your biggest superpower?",
    "history": []
  }'
```

Expected response format:
```json
{
  "answer": "Taking something messy and making it reliable. Give me a vague AI idea and I will turn it into a system that is tested, measured, and deployed. For example, with my job orchestrator Conductor, I proved zero double-claims at around seventy thousand claims a second under heavy contention."
}
```

---

## 🚢 Deploying to Vercel

### Option A: Via GitHub (Recommended)
1. Push this repository to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/voice-interview-assistant.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `GEMINI_MODEL`: `gemini-3.8-flash`
5. Click **Deploy**. Vercel will build and deploy the Next.js app automatically.

### Option B: Via Vercel CLI
```bash
npx vercel
```
When prompted, select your account, confirm the defaults, and set the environment variables via:
```bash
npx vercel env add GEMINI_API_KEY
npx vercel --prod
```

---

## 🔒 Security Best Practices Implemented

- `GEMINI_API_KEY` is strictly server-side and never prefixed with `NEXT_PUBLIC_`.
- `personality.md` and `info.md` are loaded through a server-only loader and never exposed directly via static URLs or client bundles.
- `next.config.mjs` configures `outputFileTracingIncludes` so serverless functions retain access to markdown knowledge files in Vercel.
- Request rate-limiting protects against quota exhaustion.
- Comprehensive input sanitization prevents injection and malicious payloads.
