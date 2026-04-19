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
│   │   └── page.tsx               # Main generator UI (no auth required)
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
│   ├── AuthGuard.tsx              # Route protection (for pages that need it)
│   ├── DiscoveryForm.tsx          # Brand input form with personality toggles + Randomize
│   ├── TokenPreview.tsx           # Token visualization with isolated styling
│   ├── GeneratingAnimation.tsx    # SVG loading animation with orbiting tokens
│   ├── GenerationFeedback.tsx     # Thumbs up/down rating component
│   ├── ColorSwatch.tsx            # Color palette display (light/dark modes)
│   ├── Providers.tsx              # Auth provider wrapper
│   └── preview/                   # Token-styled preview components
│       ├── index.ts               # Barrel export
│       ├── IsolatedPreviewContainer.tsx  # Container with scoped token CSS vars
│       ├── PreviewButtons.tsx     # Button previews (primary, secondary, outline)
│       ├── PreviewInput.tsx       # Input field preview
│       ├── PreviewCard.tsx        # Card component preview
│       ├── PreviewAlerts.tsx      # Alert variants preview
│       ├── PreviewTypeScale.tsx   # Typography scale preview
│       ├── PreviewSpacing.tsx     # Spacing scale visualization
│       └── PreviewGrid.tsx        # Grid system info
├── hooks/
│   └── useGenerationProgress.ts   # Animation timing and phase management
├── lib/
│   ├── firebase.ts                # Firebase client initialization
│   └── auth-context.tsx           # Auth context with popup/redirect support (demo mode fallback)
├── types/
│   ├── brand-system.ts            # TypeScript interfaces
│   └── user.ts                    # User type
└── utils/
    ├── tokens-to-css.ts           # CSS variable generation
    ├── prompt-builder.ts          # Dynamic prompt with industry/personality intelligence
    └── random-inputs.ts           # Random brand input generator
```

---

## Environment Variables

### Local Development (`.env.local`)

```env
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
USE_DEMO_MODE=false  # Set to 'true' to skip Claude API calls (uses intelligent demo generation)

# Firebase Configuration (nertia-ai project)
# These are OPTIONAL for demo mode - generator works without Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nertia-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://nertia-ai-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nertia-ai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nertia-ai.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Demo Mode (No Configuration Required)

The generator works without any environment variables:
- **No Firebase:** Auth context gracefully falls back to demo mode, generator accessible without login
- **No API Key:** Uses `USE_DEMO_MODE=true` by default, generates tokens locally with intelligent industry/personality mappings
- **Anonymous Users:** See "Sign in to save" link instead of sign out button

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
- **Randomize button:** Generates realistic random brand inputs for quick testing

### TokenPreview

Displays generated brand system with **isolated token styling** (preview uses generated tokens, not site CSS):

- **Color palette:** 10 semantic colors (background, foreground, muted, accent, etc.) with light/dark mode swatches
- **Live Preview** (uses actual token styling):
  - **Typography scale:** H1-H4, body, small text examples
  - **Buttons:** Primary, secondary, outline variants with hover states
  - **Input:** Text input with placeholder and focus state
  - **Card:** Feature card with token-based styling
  - **Alerts:** Success, warning, error variants (when defined)
  - **Grid info:** Column counts, gutters, max width
  - **Spacing scale:** Visual blocks showing xs-2xl spacing tokens
  - **Voice & Tone:** Personality tags, writing style, example CTAs as styled buttons
- **Border radius samples:** Visual examples of border radius scale
- **Shadow samples:** Visual examples of shadow tokens
- **Export options:** JSON, CSS variables, Tailwind config
- **Raw JSON:** Collapsible view of full token output

### IsolatedPreviewContainer

Wrapper component that applies generated CSS variables to scope preview styling:
- Light/dark mode toggle
- Converts tokens to CSS custom properties
- Ensures preview uses actual token colors, not site defaults
- Passes colorMode to child components for mode-aware rendering

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

1. **Enhanced industry-specific color intelligence:**
   - **AI/ML Infrastructure:** Dark backgrounds, warm accents (coral, green), avoid blue/purple. Examples: OpenAI, Anthropic, Vercel
   - **Developer Tools:** Dark mode essential, syntax-highlighting inspired (blues, greens, purples). Examples: GitHub, VS Code, Linear
   - **B2B SaaS:** Professional blues/teals, both modes important. Examples: Stripe, Notion, Figma
   - **Fintech:** Trust colors (deep blues, greens), gold accents for premium. Examples: Mercury, Robinhood
   - **Healthcare Tech:** Calming blues/teals, accessibility critical (WCAG AAA). Examples: Oscar Health, One Medical
   - **E-commerce:** Vibrant CTAs, red/orange accents. Examples: Shopify, Amazon
   - **Consumer Apps:** Playful, engaging colors. Examples: Spotify, Duolingo
   - **Climate Tech:** Sophisticated greens, avoid greenwashing. Examples: Stripe Climate, Patch

2. **Personality-to-style mappings:**
   - **innovative:** Vibrant accents, spacious, rounded corners
   - **trustworthy:** Blue-based, subtle borders, professional motion
   - **bold:** High contrast, varied radii, impactful animations
   - **friendly:** Warm tones, very rounded (pills), bouncy motion
   - **premium:** Dark backgrounds, gold accents, elegant transitions
   - **technical:** Dark mode primary, monospace-friendly, precise motion
   - **playful:** Bright palette, very rounded, energetic motion
   - **minimal:** Monochromatic, subtle borders, purposeful motion
   - **sophisticated:** Refined palette, serif-friendly, smooth transitions
   - **approachable:** Warm, balanced contrast, friendly motion

3. **Golden examples injection:**
   - Fetches high-quality examples from Firebase
   - Filters by matching industry or color mood
   - Provides few-shot context for better outputs

4. **Schema requirements:**
   - WCAG AA contrast ratios
   - Semantic color naming
   - Google Fonts for typography
   - rem-based spacing (4px grid)

## Demo Mode Generation

When `USE_DEMO_MODE=true` or no API key is configured, the generator uses intelligent demo mode (`src/app/api/generate-tokens/route.ts`):

1. **Industry-specific accent palettes:** Each industry has warm/cool/neutral color presets
2. **Brightness-based backgrounds:** vibrant (high contrast), muted (softer), dark (premium feel)
3. **Personality-influenced border radius:** playful = rounded, minimal = subtle, bold = varied
4. **Personality-based CTAs:** playful = "Let's Go", premium = "Request Access", etc.
5. **Typography by style:** modern (Inter), classic (Playfair/Source Serif), playful (Fredoka/Nunito), technical (JetBrains/IBM Plex)

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
- [x] Export options (JSON, CSS, Tailwind)
- [x] Token editing (colors, typography, borders, spacing)
- [x] History view for past generations
- [x] Golden examples admin page

---

## Completed Features

1. **Export Options** - Download tokens as JSON, CSS variables, or Tailwind config
2. **Token Editing** - Edit colors (with pickers), typography, borders, spacing after generation
3. **History View** - View and reuse past generations at `/generator/history`
4. **Golden Examples Admin** - Curate examples at `/admin/golden-examples`
5. **Token-Styled Preview** - Preview uses actual generated tokens (not site CSS variables)
6. **Isolated Preview Container** - Scoped CSS vars with light/dark mode toggle
7. **Expanded Preview Components** - Buttons, inputs, cards, alerts, type scale, spacing, grid info
8. **Random Input Generator** - "Randomize" button for quick testing and ideation
9. **Enhanced Generation Intelligence** - Detailed industry guidance and personality-to-style mappings
10. **Demo Mode Without Auth** - Generator accessible without login (uses demo mode if Firebase not configured)

---

## Future Enhancements

1. **Chat-based editing** - Natural language token updates ("make the accent color more blue")
2. **Figma export** - Export tokens as Figma variables
3. ~~**Component previews** - Show sample UI components using the generated tokens~~ (DONE)
4. **Batch generation** - Generate variations of a brand system
5. **Team sharing** - Share brand systems with team members

---

## Changelog

### January 2026 (Latest)

**Token-Styled Preview System**
- Added `IsolatedPreviewContainer` that applies generated token CSS variables
- Preview now uses actual token colors instead of site CSS variables
- Light/dark mode toggle in preview section
- New preview components: buttons, inputs, cards, alerts, type scale, spacing, grid

**Random Input Generator**
- Added "Randomize" button to DiscoveryForm
- Generates realistic company names (e.g., "NovaLabs", "PulseAI")
- Random industry, audience, and personality combinations
- Useful for quick testing and ideation

**Enhanced Generation Intelligence**
- Expanded `COLOR_INTELLIGENCE` with detailed guidance per industry (primary colors, accents, what to avoid, mood, typography notes, examples, dark mode notes)
- Added `PERSONALITY_MAPPINGS` linking personality adjectives to design decisions (color tendency, typography hints, spacing density, border radius, motion style)
- Demo mode now uses industry-specific accent palettes
- Personality-influenced border radius in demo mode

**Demo Mode Without Authentication**
- Generator page (`/generator`) no longer requires login
- Auth context handles missing Firebase configuration gracefully
- Anonymous users can generate brands, see "Sign in to save" link
- Useful for testing and demos without Firebase setup

---

*Last Updated: January 2026*
*Branch: confident-varahamihira*
