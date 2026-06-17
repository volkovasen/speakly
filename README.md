# Speakly

A premium Telegram Mini App for learning English — personalized AI tutoring with a deep focus on **speaking** and **pronunciation**.

## Design System

### Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| **Primary** | `#6366F1` | `#6366F1` | CTAs, active states, brand accent |
| **Secondary** | `#14B8A6` | `#14B8A6` | Success, skill highlights, secondary actions |
| **Background** | `#FAFAFA` | `#0A0A0B` | App canvas |
| **Surface** | `#FFFFFF` | `#141416` | Cards, elevated panels |
| **Surface Elevated** | `#FFFFFF` | `#1C1C1E` | Modals, headers |
| **Text Primary** | `#18181B` | `#FAFAFA` | Headlines, body |
| **Text Secondary** | `#71717A` | `#A1A1AA` | Captions, hints |
| **Border** | `#E4E4E7` | `#3F3F46` | Dividers, card edges |
| **Success** | `#22C55E` | `#22C55E` | Correct answers, achievements |
| **Warning** | `#F59E0B` | `#F59E0B` | Streak reminders |
| **Error** | `#EF4444` | `#EF4444` | Mistakes, alerts |

Gradients: `indigo → teal` for hero cards, progress bars, and brand moments.

### Typography

- **Font:** Inter (400, 500, 600, 700)
- **Headlines:** tight tracking, bold
- **Body:** relaxed line-height, muted secondary text

### Motion

- Fade-in / slide-up on step transitions (Framer Motion)
- Soft scale on button press (`active:scale-[0.98]`)
- Progress bar animates over 500ms
- Haptic feedback via Telegram WebApp SDK

---

## Screen Architecture

```
Speakly
├── Onboarding (first launch)
│   ├── 0. Welcome — brand intro, value props
│   ├── 1. Level Test — adaptive A0–C2 assessment (7 questions)
│   ├── 2. Goals — General, Business, Medicine, IT, Relocation, Exams
│   ├── 3. Skills — Speaking, Pronunciation, Listening, Vocabulary, Grammar
│   ├── 4. Preferences — daily minutes + 30/60/90-day course
│   └── 5. Plan Ready — AI plan generation animation → home
│
└── Main App (tab bar)
    ├── Home — dashboard, streak, today's goal
    ├── Practice — voice recording + AI analysis
    ├── Learn — lessons, conversation simulator, topic generator
    └── Progress — skills chart, weekly reports, achievements, history
```

### Planned Feature Screens

- **Speaking Practice** — 90s recording, pronunciation/grammar/fluency analysis, transcript highlights, AI comparison
- **Conversation Simulator** — role-play dialogs
- **Topic Generator** — domain-specific prompts
- **Vocabulary Builder** — spaced repetition
- **Recording History** — replay all sessions
- **Weekly Report** — AI progress summary
- **Profile / Settings** — dark mode, goals, track selection

---

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 3 + shadcn/ui
- Framer Motion
- Zustand (persisted state)
- Telegram WebApp SDK

## Getting Started

```bash
cd ~/Projects/speakly
npm install
npm run dev
```

Open in Telegram via [@BotFather](https://t.me/BotFather) Mini App URL, or test locally in browser.

## Project Structure

```
src/
├── components/
│   ├── onboarding/     # Onboarding flow steps
│   └── ui/             # shadcn/ui primitives
├── data/               # Static content (questions, options)
├── lib/                # Utils, Telegram SDK helpers
├── pages/              # Main app screens
├── stores/             # Zustand state
└── types/              # TypeScript definitions
```

## Current Status

**Implemented:** Full onboarding flow with level test (A0–C2), goals, skills, preferences, and plan generation.

**Next up:** Speaking practice, AI analysis UI, progress tracking, conversation simulator.
