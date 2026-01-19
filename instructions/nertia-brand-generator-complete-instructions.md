# Nertia Brand Generator: Complete Build Instructions
## Implementation Complete - January 2026

---

## Project Overview

An AI-powered brand systems generator that:
1. Collects brand inputs via a discovery form
2. Generates complete design tokens using Claude API (Sonnet 4)
3. Displays tokens with a visual preview showing colors, typography, and voice & tone
4. Shows an animated loading state during generation
5. Collects thumbs up/down feedback to improve future outputs
6. Saves all generations to Firebase Realtime Database

**Production URL:** https://www.nertia.ai/generator
**Admin Dashboard:** https://www.nertia.ai/admin/generations

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        NERTIA BRAND GENERATOR                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │   DISCOVERY  │───▶│  GENERATION  │───▶│      PREVIEW         │  │
│  │   (Form UI)  │    │ (Claude API) │    │   (Token Display)    │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│         │                   │                       │               │
│         │                   ▼                       ▼               │
│         │            ┌─────────────┐         ┌───────────┐         │
│         │            │  ANIMATION  │         │ FEEDBACK  │         │
│         │            │  (Loading)  │         │ (Ratings) │         │
│         │            └─────────────┘         └───────────┘         │
│         │                                           │               │
│         ▼                                           ▼               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   FIREBASE REALTIME DATABASE                 │   │
│  │  generations | golden_examples | token_edits                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

- **Framework:** Next.js 15.5.9 with Turbopack
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS custom properties
- **AI:** Claude Sonnet 4 (`claude-sonnet-4-20250514`) via Anthropic SDK
- **Database:** Firebase Realtime Database
- **Auth:** Firebase Authentication with Google OAuth
- **Hosting:** Vercel

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate-tokens/
│   │   │   └── route.ts           # Main generation endpoint (Claude API)
│   │   └── generations/
│   │       └── feedback/
│   │           └── route.ts       # Feedback endpoint (thumbs up/down)
│   ├── generator/
│   │   └── page.tsx               # Main generator UI
│   ├── login/
│   │   └── page.tsx               # Google Sign-in page
│   ├── auth/
│   │   └── callback/
│   │       └── page.tsx           # OAuth callback handler
│   ├── admin/
│   │   └── generations/
│   │       └── page.tsx           # Admin analytics dashboard
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── AuthGuard.tsx              # Route protection
│   ├── DiscoveryForm.tsx          # Brand input form with personality toggles
│   ├── TokenPreview.tsx           # Token visualization (colors, typography, voice)
│   ├── GeneratingAnimation.tsx    # SVG loading animation with orbiting tokens
│   ├── GenerationFeedback.tsx     # Thumbs up/down rating component
│   ├── ColorSwatch.tsx            # Color palette display (light/dark modes)
│   └── Providers.tsx              # Auth provider wrapper
├── hooks/
│   └── useGenerationProgress.ts   # Animation timing and phase management
├── lib/
│   ├── firebase.ts                # Firebase client initialization
│   └── auth-context.tsx           # Auth context with popup/redirect support
├── types/
│   ├── brand-system.ts            # TypeScript interfaces
│   └── user.ts                    # User type
└── utils/
    ├── tokens-to-css.ts           # CSS variable generation
    └── prompt-builder.ts          # Dynamic prompt construction with industry intelligence
```

---

## Environment Variables

### Local Development (`.env.local`)

```env
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
USE_DEMO_MODE=false

# Firebase Configuration (nertia-ai project)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nertia-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://nertia-ai-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nertia-ai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nertia-ai.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Vercel Production

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:
- `ANTHROPIC_API_KEY`
- `USE_DEMO_MODE=false`
- All `NEXT_PUBLIC_FIREBASE_*` variables

---

## Firebase Setup

### Authorized Domains (Firebase Console)

Authentication → Settings → Authorized domains:
- `localhost`
- `nertia.ai`
- `www.nertia.ai`

### Google Cloud Console OAuth

APIs & Credentials → OAuth 2.0 Client IDs → Web client:

**Authorized JavaScript origins:**
- `http://localhost:3000`
- `https://nertia.ai`
- `https://www.nertia.ai`

**Authorized redirect URIs:**
- `https://nertia-ai.firebaseapp.com/__/auth/handler`

### Database Structure

```
/generations
  /{generationId}
    - id: string
    - userId: string | null
    - inputs: DiscoveryInputs
    - tokens: BrandSystem
    - rating: 1 | 5 | null
    - feedbackText: string | null
    - modelVersion: string ("claude-sonnet-4-5" or "demo")
    - promptVersion: string ("v1.0")
    - generationTimeMs: number
    - createdAt: number (timestamp)
    - updatedAt: number (timestamp)

/goldenExamples
  /{exampleId}
    - inputs: DiscoveryInputs
    - tokens: BrandSystem
    - industry: string
    - colorMood: string
    - isActive: boolean
    - notes: string
    - createdAt: number (timestamp)
```

---

## Key Components

### DiscoveryForm

Collects brand inputs with:
- Company name (text input)
- Industry (dropdown: AI/ML, Developer Tools, B2B SaaS, Fintech, etc.)
- Target audience (text input)
- Personality adjectives (toggle chips, max 5)
- Color mood (warm/cool/neutral)
- Color brightness (vibrant/muted/dark)
- Typography style (modern/classic/playful/technical)
- Density preference (spacious/balanced/compact)
- Optional existing brand color

### TokenPreview

Displays generated brand system with:
- **Color palette:** 10 semantic colors (background, foreground, muted, accent, etc.) with light/dark mode swatches
- **Typography:** Font family preview with sample headline and description
- **Voice & Tone:** Personality tags, writing style description
- **Raw JSON:** Collapsible view of full token output

### GeneratingAnimation

SVG animation featuring:
- Central design system "core" box
- Three orbiting tokens (color circle, typography bar, component square)
- Tokens illuminate as generation phases complete
- Phase progress dots below animation
- Respects `prefers-reduced-motion`

### GenerationFeedback

Simple feedback widget:
- Thumbs up (rating: 5) / Thumbs down (rating: 1)
- Optional text feedback for negative ratings
- Submits to `/api/generations/feedback`

---

## API Endpoints

### POST `/api/generate-tokens`

Generates a complete brand system.

**Request body:**
```json
{
  "companyName": "Acme Corp",
  "industry": "AI/ML Infrastructure",
  "targetAudience": "Enterprise developers",
  "personalityAdjectives": ["innovative", "trustworthy", "bold"],
  "colorMood": "cool",
  "colorBrightness": "dark",
  "typographyStyle": "modern",
  "densityPreference": "balanced",
  "existingBrandColor": "#FF5500"
}
```

**Response:**
```json
{
  "metadata": { "name": "Acme Corp", "generatedAt": "...", "version": "1.0.0" },
  "colors": { ... },
  "typography": { ... },
  "spacing": { ... },
  "borders": { ... },
  "shadows": { ... },
  "motion": { ... },
  "voiceAndTone": { ... },
  "_generationId": "-OjMiM7Gzlw_rw0fBddO"
}
```

**Demo Mode:**
- Set `USE_DEMO_MODE=true` to use deterministic demo output (no API calls)
- Useful for testing without spending API credits

### POST `/api/generations/feedback`

Saves user feedback for a generation.

**Request body:**
```json
{
  "generationId": "-OjMiM7Gzlw_rw0fBddO",
  "rating": 5,
  "feedbackText": "Great colors!"
}
```

---

## Prompt Engineering

The prompt builder (`src/utils/prompt-builder.ts`) includes:

1. **Industry-specific color intelligence:**
   - AI/ML: Dark backgrounds + warm accents (avoid blue/purple)
   - Developer Tools: Syntax-highlighting inspired
   - B2B SaaS: Professional blues/teals
   - Fintech: Trust colors (deep blues, greens, gold accents)

2. **Golden examples injection:**
   - Fetches high-quality examples from Firebase
   - Filters by matching industry or color mood
   - Provides few-shot context for better outputs

3. **Schema requirements:**
   - WCAG AA contrast ratios
   - Semantic color naming
   - Google Fonts for typography
   - rem-based spacing (4px grid)

---

## Development Workflow

### Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:3000/generator
```

### Git Workflow

```bash
# Stage changes
git add -A

# Commit
git commit -m "Description of changes"

# Switch to main and sync
git checkout main
git pull origin main

# Merge feature branch
git merge <branch-name>

# Push to deploy (triggers Vercel)
git push origin main
```

---

## Admin Dashboard

Access at `/admin/generations` to view:

- **Total generations count**
- **Positive/negative feedback breakdown**
- **Average generation time**
- **List of all generations** with:
  - Company name and industry
  - Rating indicator (thumbs up/down)
  - Feedback text (if provided)
  - Timestamp

---

## Testing Checklist

- [x] Firebase connection works
- [x] Firebase Auth (Google Sign-in) works locally
- [x] Firebase Auth works on production (after adding domains)
- [x] `/generator` page renders discovery form
- [x] Form validation prevents empty submissions
- [x] Generation API returns valid tokens (demo mode)
- [x] Generation API returns valid tokens (Claude mode)
- [x] Loading animation plays during generation
- [x] Token preview displays colors, typography, voice & tone
- [x] Feedback submission works
- [x] Admin dashboard shows generations
- [ ] Golden examples inject into prompts (needs examples added)

---

## Next Steps

1. **Add Golden Examples** - Manually curate 5-10 high-quality generations in Firebase
2. **Export Options** - Download tokens as JSON, CSS variables, or Tailwind config
3. **Token Editing** - Allow users to tweak individual values after generation
4. **History View** - Let users view their past generations

---

*Last Updated: January 2026*
*Branch: main (commit ab0767c)*
