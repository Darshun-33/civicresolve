# CivicResolve — AI-Powered Citizen Grievance Management Platform

> *"Your Voice. Your City. Our Responsibility."*

CivicResolve is an urban civic intelligence platform engineered for hackathon presentation and municipal innovation. It empowers citizens to report civic grievances (potholes, garbage, broken streetlights, water pipeline leaks, hazardous drainage, and public safety threats), harnesses **Google Gemini Multimodal AI** to understand the nuance of each report, determine realistic urgency and public risk, dispatch it directly to the designated municipal department, and tracks each grievance through a **Citizen-Verified Resolution** closed loop.

---

## 🌟 Executive Highlights & Differentiating Features

1. **Google Gemini Multimodal AI Triage (`@google/genai`)**
   - Direct integration with Google's official GenAI SDK (`@google/genai`).
   - Analyzes title, description, and **uploaded evidence photographs**.
   - Accurately classifies grievances into standard categories: *Road & Potholes, Waste Management, Streetlight Problems, Water Supply & Leakage, Drainage & Sewage, Public Safety*.
   - Evaluates real-world danger levels (*Critical, High, Medium, Low*) and generates human-readable urgency rationale.
   - Recommends the authoritative municipal department (*Public Works, Sanitation, Electrical, Water Supply, Drainage & Sewerage, Public Safety*).
   - Formulates operational suggestions and confidence scoring.
   - Built-in **bilingual rule-based fallback triage** when offline or API credentials are not set (clearly identified as fallback to maintain scientific integrity).

2. **Intelligent Duplicate Complaint Detection & Corroboration**
   - Automatically cross-examines existing records using category, normalized locality, and text similarity before a complaint is registered.
   - Detects when neighbors have already reported the same issue nearby (e.g. pothole at Anna Nagar Bus Terminus).
   - Gives citizens the choice to **"Support & Corroborate (+1)"** the existing complaint—elevating public pressure without flooding municipal teams with redundant tickets—or continue filing a separate complaint.

3. **Citizen-Verified Resolution Closed Loop**
   - When administrators mark a complaint as "Resolved", the workflow does not blindly terminate.
   - The reporting citizen is prompted: *"Has this issue actually been fixed on-site?"*
   - Citizens can certify resolution (`✓ Yes, Resolved`) or dispute it (`✕ No, Persisting`) with actionable feedback.
   - Disputed complaints are flagged into a dedicated administrative review queue.

4. **Tamil & English Bilingual Intelligence (தமிழ் / English)**
   - Live language toggle in navigation (`EN` / `தமிழ்`).
   - Seamlessly accepts complaints written in Tamil, English, or mixed Tanglish.
   - Gemini and fallback engines return summaries, urgency reasons, and operational advice in the citizen's chosen language while maintaining consistent department identifiers.

5. **Civic Intelligence & Locality Analytics**
   - Dynamically calculates municipal telemetry from actual stored records.
   - Identifies top affected neighborhood clusters (e.g., Anna Nagar, T. Nagar, Adyar, Velachery).
   - Computes turnaround hours, priority distribution, and citizen-verified closure percentage.
   - Includes an **Interactive Spatial Map** with custom glowing orchid locality pins.

6. **iOS-Inspired Liquid Glass Design System**
   - Art-directed palette: Deep Plum (`#281B30`), Smoky Mauve (`#49344F`), Muted Lavender (`#856B91`), Soft Lilac (`#D4BCE0`), Orchid (`#AD42B8`), and Electric Orchid (`#E65BD6`).
   - Translucent glassmorphism with layered specular highlights, fine lavender borders, and ambient illumination.
   - Presentation-ready responsive layouts across mobile, tablet, and desktop.

7. **Hackathon Presentation Walkthrough Mode**
   - Built-in interactive 4-step modal for judges to test the complete lifecycle in under 3 minutes.
   - 1-Click "Load Realistic Demo Data" (4 distinct municipal scenarios in Chennai).
   - 1-Click "Clear Demo Records" that safely preserves real user submissions.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite 5, Tailwind CSS, Lucide React, React Router v6, Leaflet / React Leaflet.
- **Backend**: Node.js, Express.js, TypeScript via `tsx`, CORS.
- **AI Engine**: Google GenAI official JavaScript SDK (`@google/genai`) with configurable model (`gemini-2.5-flash`).
- **Persistence**: Centralized browser `localStorage` service wrapped in React Context, ensuring instantaneous synchrony across Citizen and Admin screens.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (A portable Node v20 LTS runtime is pre-configured in `.tools\node20` for instant Windows execution).

### Option 1: One-Click Production Server (Recommended for Live Demo)
Run the bundled script in PowerShell or Command Prompt:

```powershell
.\start.ps1
```
or double-click:
```bat
start.bat
```
Then open your browser at:
👉 **`http://localhost:5000`**

*(This serves both the Express backend API and the compiled Liquid Glass frontend from a single unified port)*.

---

### Option 2: Full-Stack Development Mode

```powershell
.\dev.bat
```
or with npm:
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🔑 Configuring Google Gemini API Key

The application is fully operational out-of-the-box using the built-in algorithmic triage fallback. To connect genuine Google Gemini AI:

1. Obtain a free API key from [Google AI Studio](https://aistudio.google.com/).
2. Open `.env` in the root directory:
   ```env
   PORT=5000
   GEMINI_API_KEY=AIzaSy...your_actual_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
3. Restart the server (`.\start.ps1` or `start.bat`).
4. Check `http://localhost:5000/api/health`. You will see `"geminiConfigured": true`.

---

## 🧪 Acceptance Criteria & Test Verification

All 8 mandatory problem-statement test flows have been built and verified:

| Test Flow | Status | Verification Detail |
|---|---|---|
| **TEST 1: Citizen Pothole Filing** | ✅ Pass | Citizen fills form, uploads photo, submits complaint, and receives unique ID (e.g. `CR-2026-4819`). |
| **TEST 2: Gemini Classification** | ✅ Pass | Evaluates issue as "Road & Potholes", priority "High", and assigns "Public Works Department". |
| **TEST 3: Citizen Dashboard Display** | ✅ Pass | Saved complaint appears immediately in citizen dashboard with "Reported" status badge. |
| **TEST 4: Admin Status Advancement** | ✅ Pass | Admin enters control center and moves status from "Reported" to "In Progress" with official action note. |
| **TEST 5: Real-time Citizen Tracking** | ✅ Pass | Citizen searches the Complaint ID in the Track page and observes the updated "In Progress" stepper and timeline note. |
| **TEST 6: Resolution & Citizen Verification** | ✅ Pass | Admin marks issue "Resolved". Citizen verifies resolution on-site (`✓ Yes`) or disputes (`✕ No`). |
| **TEST 7: Fallback Engine Resiliency** | ✅ Pass | When Gemini API key is absent or offline, rule-based algorithmic classifier runs and badges `Source: Fallback`. |
| **TEST 8: Persistence across Refresh** | ✅ Pass | Browser reload retains all complaints, timeline history, and corroboration counts via local storage. |

---

## 📂 Project Structure

```
civicresolve/
├── dist/                     # Optimized production bundle
├── public/                   # Static assets
├── server/
│   ├── index.ts              # Express API server & static hosting
│   └── gemini.ts             # Official Google GenAI SDK integration & prompt engineering
├── src/
│   ├── components/
│   │   ├── Navbar.tsx        # Liquid Glass navigation, role switch & language toggle
│   │   ├── Footer.tsx        # Brand footer & architecture notice
│   │   ├── StatusBadge.tsx   # Color-coded status pills (Blue/Amber/Green)
│   │   ├── PriorityBadge.tsx # Urgency indicators with pulse effects
│   │   ├── Timeline.tsx      # Chronological audit trail & stepper
│   │   ├── ComplaintCard.tsx # Translucent responsive card
│   │   ├── ComplaintDetailModal.tsx # Full triage dossier drawer
│   │   ├── InteractiveMap.tsx# Spatial cluster map with custom markers
│   │   └── DemoWalkthroughModal.tsx # Interactive presentation guide for judges
│   ├── context/
│   │   ├── ComplaintContext.tsx # Centralized single source of truth
│   │   └── LanguageContext.tsx  # Bilingual state manager
│   ├── pages/
│   │   ├── Home.tsx          # Asymmetric editorial landing page
│   │   ├── ReportIssue.tsx   # Grievance intake & AI scanning animation
│   │   ├── TrackComplaint.tsx# Stepper, audit trail & citizen verification
│   │   ├── CitizenDashboard.tsx # Filterable community overview
│   │   └── AdminDashboard.tsx# Municipal control center & locality analytics
│   ├── services/
│   │   └── storage.ts        # LocalStorage CRUD, compression, duplicate finder
│   ├── types/
│   │   ├── complaint.ts      # Strict TypeScript domain interfaces
│   │   └── language.ts       # Localization schema
│   ├── utils/
│   │   ├── classificationFallback.ts # Rule-based triage engine (EN & TA)
│   │   └── translations.ts   # English & Tamil dictionaries
│   ├── App.tsx               # Root router & layout
│   ├── main.tsx              # React DOM entry
│   └── index.css             # Liquid Glass CSS material definitions
├── .env.example              # Template environment configuration
├── .env                      # Local server environment
├── dev.bat                   # 1-Click development launcher
├── start.bat                 # 1-Click production launcher
├── start.ps1                 # PowerShell production launcher
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

---

## 🛡️ Security & Ethical Guardrails

- **API Credential Protection**: The Gemini API key is accessed exclusively on the Node.js Express backend. Client bundles never contain API keys.
- **Image Compression**: Photos are safely compressed before caching, preventing `QUOTA_EXCEEDED` exceptions.
- **Truthful Platform Scope**: The application explicitly informs users that complaints are registered on a prototype platform and are not physically routed to emergency services.
- **Independent Verification**: Municipal status changes and citizen verification are stored in separate, immutable fields to preserve civic accountability.

