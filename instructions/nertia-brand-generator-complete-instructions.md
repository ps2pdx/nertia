# Nertia Brand Generator: Complete Build Instructions
## Fresh Start from New Branch

---

## Project Overview

Build an AI-powered brand systems generator that:
1. Collects brand inputs via a discovery form
2. Generates complete design tokens using Claude API
3. Displays tokens with a visual preview
4. Shows a loading animation during generation
5. Collects feedback to improve future outputs
6. Uses "golden examples" for few-shot prompting

**Branch:** `feature/brand-generator-v2`

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

## Phase 1: Project Setup

### 1.1 Initialize Next.js Project

```bash
# Create new Next.js app with TypeScript and Tailwind
npx create-next-app@latest nertia-generator --typescript --tailwind --eslint --app --src-dir

cd nertia-generator

# Install dependencies
npm install @anthropic-ai/sdk firebase

# Dev dependencies
npm install -D @types/node
```

### 1.2 Project Structure

Create this file structure:

```
src/
├── app/
│   ├── api/
│   │   ├── generate-tokens/
│   │   │   └── route.ts
│   │   ├── generations/
│   │   │   └── feedback/
│   │   │       └── route.ts
│   │   └── admin/
│   │       └── golden-examples/
│   │           └── route.ts
│   ├── generator/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── admin/
│   │   └── generations/
│   │       └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── AuthGuard.tsx
│   ├── DiscoveryForm.tsx
│   ├── TokenPreview.tsx
│   ├── GeneratingAnimation.tsx
│   ├── GenerationFeedback.tsx
│   ├── ColorSwatch.tsx
│   └── Providers.tsx
├── lib/
│   ├── firebase.ts
│   └── auth-context.tsx
├── types/
│   ├── brand-system.ts
│   └── user.ts
├── utils/
│   ├── tokens-to-css.ts
│   └── prompt-builder.ts
└── hooks/
    └── useGenerationProgress.ts
```

### 1.3 Environment Variables

Create `.env.local`:

```env
# Anthropic
ANTHROPIC_API_KEY=your-anthropic-api-key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

---

## Phase 2: Type Definitions

### 2.1 Create `/src/types/brand-system.ts`

```typescript
// Discovery form inputs
export interface DiscoveryInputs {
  companyName: string;
  industry: string;
  targetAudience: string;
  personalityAdjectives: string[];
  colorMood: 'warm' | 'cool' | 'neutral';
  colorBrightness: 'vibrant' | 'muted' | 'dark';
  typographyStyle: 'modern' | 'classic' | 'playful' | 'technical';
  densityPreference: 'spacious' | 'balanced' | 'compact';
  existingBrandColor?: string;
}

// Generated brand system
export interface BrandSystem {
  metadata: {
    name: string;
    generatedAt: string;
    version: string;
  };

  colors: {
    background: { light: string; dark: string };
    foreground: { light: string; dark: string };
    muted: { light: string; dark: string };
    accent: { light: string; dark: string };
    accentHover: { light: string; dark: string };
    cardBackground: { light: string; dark: string };
    cardBorder: { light: string; dark: string };
    success: { light: string; dark: string };
    warning: { light: string; dark: string };
    error: { light: string; dark: string };
  };

  typography: {
    fontFamily: {
      sans: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };

  spacing: {
    '0': string;
    '1': string;
    '2': string;
    '3': string;
    '4': string;
    '6': string;
    '8': string;
    '12': string;
    '16': string;
    '24': string;
  };

  borders: {
    radius: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      full: string;
    };
    width: {
      thin: string;
      medium: string;
      thick: string;
    };
  };

  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  motion: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      default: string;
      in: string;
      out: string;
      inOut: string;
    };
  };

  voiceAndTone: {
    personality: string[];
    writingStyle: string;
    examples: {
      headlines: string[];
      cta: string[];
      descriptions: string[];
    };
  };
}

// Generation result with tracking ID
export interface GenerationResult extends BrandSystem {
  _generationId?: string;
}
```

---

## Phase 3: Firebase Setup

### 3.1 Create `/src/lib/firebase.ts`

```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let database: Database | null = null;
let auth: Auth | null = null;

try {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  database = getDatabase(app);
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export { database, auth, googleProvider };
```

### 3.2 Create `/src/lib/auth-context.tsx`

```typescript
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(mapFirebaseUser(firebaseUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Auth not initialized');
    await signInWithPopup(auth, googleProvider);
  };

  const signOut = async () => {
    if (!auth) throw new Error('Auth not initialized');
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 3.3 Database Structure (Firebase Realtime Database)

```
/generations
  /{generationId}
    - id: string
    - userId: string
    - inputs: object (DiscoveryInputs)
    - tokens: object (BrandSystem)
    - rating: number | null (1 or 5)
    - feedbackText: string | null
    - modelVersion: string
    - promptVersion: string
    - generationTimeMs: number
    - createdAt: number (timestamp)
    - updatedAt: number (timestamp)

/tokenEdits
  /{editId}
    - generationId: string
    - tokenPath: string
    - originalValue: string
    - newValue: string
    - createdAt: number (timestamp)

/goldenExamples
  /{exampleId}
    - generationId: string | null
    - inputs: object
    - tokens: object
    - notes: string
    - industry: string
    - personalityTags: string[]
    - colorMood: string
    - isActive: boolean
    - createdAt: number (timestamp)
```

---

## Phase 4: Core Generation API

### 4.1 Create `/src/utils/prompt-builder.ts`

```typescript
import { database } from '@/lib/firebase';
import { ref, get, query, orderByChild, equalTo, limitToFirst } from 'firebase/database';
import { DiscoveryInputs } from '@/types/brand-system';

// Color intelligence from research (inject industry-specific guidance)
const COLOR_INTELLIGENCE: Record<string, string> = {
  'AI/ML Infrastructure': `
    Use dark backgrounds (#0A0A0A to #212121).
    Add ONE warm accent (coral #FF7759, terra cotta #D97757, or green #00A67E).
    Avoid blue/purple - saturated market.
    Reference: OpenAI #000000 + #00A67E, Anthropic #000000 + #D97757
  `,
  'Developer Tools': `
    Dark themes preferred by developers.
    Consider syntax-highlighting inspired accents.
    High contrast for readability.
  `,
  'B2B SaaS': `
    Professional blues and teals still work here.
    Balance trust (blue) with energy (accent color).
    Clean, corporate-friendly palettes.
  `,
  'Fintech': `
    Trust colors: deep blues, greens.
    Avoid overly playful colors.
    Consider gold/amber accents for premium feel.
  `,
};

export async function getRelevantExamples(inputs: DiscoveryInputs): Promise<string> {
  if (!database) return '';

  try {
    const examplesRef = ref(database, 'goldenExamples');
    const activeQuery = query(examplesRef, orderByChild('isActive'), equalTo(true), limitToFirst(2));
    const snapshot = await get(activeQuery);

    if (!snapshot.exists()) return '';

    const examples: { inputs: DiscoveryInputs; tokens: object }[] = [];
    snapshot.forEach((child) => {
      const data = child.val();
      // Filter by industry or color mood
      if (data.industry?.includes(inputs.industry) || data.colorMood === inputs.colorMood) {
        examples.push({ inputs: data.inputs, tokens: data.tokens });
      }
    });

    if (examples.length === 0) return '';

    const exampleText = examples
      .map((ex, i) => `
EXAMPLE ${i + 1}:
Company: ${ex.inputs.companyName} (${ex.inputs.industry})
Personality: ${ex.inputs.personalityAdjectives?.join(', ')}
Color Mood: ${ex.inputs.colorMood}, ${ex.inputs.colorBrightness}

Generated Tokens:
${JSON.stringify(ex.tokens, null, 2)}
`)
      .join('\n---\n');

    return `
## High-Quality Examples

Match this quality level:

${exampleText}

---

Now generate for the new inputs:
`;
  } catch (error) {
    console.error('Failed to fetch golden examples:', error);
    return '';
  }
}

export function getColorIntelligence(industry: string): string {
  return COLOR_INTELLIGENCE[industry] || '';
}

export async function buildPrompt(inputs: DiscoveryInputs): Promise<string> {
  const colorGuidance = getColorIntelligence(inputs.industry);
  const examples = await getRelevantExamples(inputs);

  const existingColorLine = inputs.existingBrandColor
    ? `- Existing Brand Color: ${inputs.existingBrandColor} (incorporate this as primary or accent)`
    : '';

  return `You are a brand systems architect. Generate a complete design token system.

BRAND INPUTS:
- Company: ${inputs.companyName}
- Industry: ${inputs.industry}
- Target Audience: ${inputs.targetAudience}
- Personality: ${inputs.personalityAdjectives.join(', ')}
- Color Mood: ${inputs.colorMood}, ${inputs.colorBrightness}
- Typography Style: ${inputs.typographyStyle}
- Density: ${inputs.densityPreference}
${existingColorLine}

${colorGuidance ? `## Industry Color Intelligence\n${colorGuidance}\n` : ''}

${examples}

REQUIREMENTS:
1. Generate a cohesive visual system that feels ${inputs.personalityAdjectives.join(', ')}
2. All colors must work for both light and dark modes
3. Ensure WCAG AA contrast ratios (4.5:1 for text, 3:1 for UI)
4. Use semantic naming (background, foreground, accent) not color names
5. Typography should use widely available Google Fonts
6. Spacing uses rem units based on 4px grid (0.25rem, 0.5rem, 1rem, etc.)
7. Generate 3 example headlines, 3 CTAs, and 3 descriptions matching the voice

Return ONLY valid JSON matching the BrandSystem schema. No explanations or markdown.`;
}
```

### 4.2 Create `/src/app/api/generate-tokens/route.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { BrandSystem, DiscoveryInputs } from '@/types/brand-system';
import { database } from '@/lib/firebase';
import { ref, push, set } from 'firebase/database';
import { buildPrompt } from '@/utils/prompt-builder';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PROMPT_VERSION = 'v1.0';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { inputs, userId }: { inputs: DiscoveryInputs; userId?: string } = await request.json();

    // Build prompt with examples and industry intelligence
    const prompt = await buildPrompt(inputs);

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text content
    const textBlock = response.content.find(block => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse JSON (handle potential markdown code blocks)
    let jsonText = textBlock.text.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
    }

    const tokens: BrandSystem = JSON.parse(jsonText);

    // Add metadata
    tokens.metadata = {
      name: inputs.companyName,
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
    };

    const generationTimeMs = Date.now() - startTime;

    // Save to Firebase
    let generationId: string | undefined;
    if (database) {
      try {
        const generationsRef = ref(database, 'generations');
        const newGenerationRef = push(generationsRef);
        generationId = newGenerationRef.key || undefined;

        await set(newGenerationRef, {
          id: generationId,
          userId: userId || null,
          inputs,
          tokens,
          rating: null,
          feedbackText: null,
          modelVersion: 'claude-sonnet-4-5',
          promptVersion: PROMPT_VERSION,
          generationTimeMs,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      } catch (dbError) {
        console.error('Failed to save generation:', dbError);
      }
    }

    return NextResponse.json({
      ...tokens,
      _generationId: generationId,
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate brand system', details: String(error) },
      { status: 500 }
    );
  }
}
```

---

## Phase 5: Feedback System

### 5.1 Create `/src/app/api/generations/feedback/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/firebase';
import { ref, update } from 'firebase/database';

interface FeedbackPayload {
  generationId: string;
  rating: 1 | 5;
  feedbackText?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { generationId, rating, feedbackText }: FeedbackPayload = await request.json();

    if (!generationId || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating !== 1 && rating !== 5) {
      return NextResponse.json({ error: 'Rating must be 1 or 5' }, { status: 400 });
    }

    if (!database) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }

    const generationRef = ref(database, `generations/${generationId}`);
    await update(generationRef, {
      rating,
      feedbackText: feedbackText || null,
      updatedAt: Date.now(),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Failed to process feedback' }, { status: 500 });
  }
}
```

### 5.2 Create `/src/components/GenerationFeedback.tsx`

```typescript
'use client';

import { useState } from 'react';

interface GenerationFeedbackProps {
  generationId: string | undefined;
  onFeedbackSubmit?: () => void;
}

export function GenerationFeedback({ generationId, onFeedbackSubmit }: GenerationFeedbackProps) {
  const [rating, setRating] = useState<1 | 5 | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!generationId) return null;

  const handleSubmit = async () => {
    if (!rating) return;

    setSubmitting(true);

    try {
      const response = await fetch('/api/generations/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationId,
          rating,
          feedbackText: feedback || undefined,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        onFeedbackSubmit?.();
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900">
        <p className="text-sm text-zinc-400 flex items-center gap-2">
          <span className="text-green-500">✓</span> Thanks for your feedback!
        </p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900">
      <p className="text-sm font-medium mb-3 text-zinc-200">How's this brand system?</p>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setRating(1)}
          className={`px-4 py-2 rounded-md text-lg transition-colors ${
            rating === 1
              ? 'bg-red-500/20 border-2 border-red-500'
              : 'bg-zinc-800 border border-zinc-700 hover:border-zinc-500'
          }`}
          aria-label="Thumbs down"
        >
          👎
        </button>
        <button
          onClick={() => setRating(5)}
          className={`px-4 py-2 rounded-md text-lg transition-colors ${
            rating === 5
              ? 'bg-green-500/20 border-2 border-green-500'
              : 'bg-zinc-800 border border-zinc-700 hover:border-zinc-500'
          }`}
          aria-label="Thumbs up"
        >
          👍
        </button>
      </div>

      {rating === 1 && (
        <div className="mb-3">
          <textarea
            placeholder="What could be better? (optional but helpful)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-sm text-zinc-200 resize-none focus:outline-none focus:border-zinc-500"
            rows={2}
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={rating === null || submitting}
        className="px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </div>
  );
}
```

---

## Phase 6: Loading Animation

### 6.1 Create `/src/hooks/useGenerationProgress.ts`

```typescript
import { useState, useEffect } from 'react';

const PHASES = [
  { duration: 2000, message: 'Analyzing brand inputs...' },
  { duration: 3000, message: 'Generating color palette...' },
  { duration: 3000, message: 'Selecting typography...' },
  { duration: 2000, message: 'Building component tokens...' },
  { duration: 2000, message: 'Assembling design system...' },
];

export function useGenerationProgress(isGenerating: boolean) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setPhase(0);
      return;
    }

    let elapsed = 0;
    const timers: NodeJS.Timeout[] = [];

    PHASES.forEach((p, i) => {
      const timer = setTimeout(() => setPhase(i), elapsed);
      timers.push(timer);
      elapsed += p.duration;
    });

    return () => timers.forEach(t => clearTimeout(t));
  }, [isGenerating]);

  return {
    phase,
    message: PHASES[phase]?.message || 'Processing...',
    totalPhases: PHASES.length,
  };
}
```

### 6.2 Create `/src/components/GeneratingAnimation.tsx`

```typescript
'use client';

import { useGenerationProgress } from '@/hooks/useGenerationProgress';

interface GeneratingAnimationProps {
  isGenerating: boolean;
}

export function GeneratingAnimation({ isGenerating }: GeneratingAnimationProps) {
  const { phase, message, totalPhases } = useGenerationProgress(isGenerating);

  if (!isGenerating) return null;

  // Check for reduced motion preference
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-sm text-zinc-400 animate-pulse">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Main Animation */}
      <div className="relative w-48 h-48 mb-8">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Background pulse */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.1"
            className="animate-ping"
            style={{ animationDuration: '3s' }}
          />

          {/* Orbiting color token */}
          <g className="origin-center animate-spin" style={{ animationDuration: '8s', transformOrigin: '100px 100px' }}>
            <circle
              cx="100"
              cy="30"
              r="8"
              className={`transition-all duration-500 ${
                phase >= 1 ? 'fill-emerald-500 opacity-100' : 'fill-zinc-600 opacity-30'
              }`}
            />
          </g>

          {/* Orbiting typography token */}
          <g className="origin-center animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse', transformOrigin: '100px 100px' }}>
            <rect
              x="160"
              y="95"
              width="24"
              height="10"
              rx="2"
              className={`transition-all duration-500 ${
                phase >= 2 ? 'fill-emerald-500 opacity-100' : 'fill-zinc-600 opacity-30'
              }`}
            />
          </g>

          {/* Orbiting component token */}
          <g className="origin-center animate-spin" style={{ animationDuration: '10s', transformOrigin: '100px 100px' }}>
            <rect
              x="88"
              y="160"
              width="24"
              height="24"
              rx="4"
              className={`transition-all duration-500 ${
                phase >= 3 ? 'fill-emerald-500 opacity-100' : 'fill-zinc-600 opacity-30'
              }`}
            />
          </g>

          {/* Center system core */}
          <rect
            x="80"
            y="80"
            width="40"
            height="40"
            rx="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-pulse text-zinc-400"
          />

          {/* Connection lines */}
          <g className="opacity-20 text-zinc-500">
            <line x1="100" y1="38" x2="100" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="160" y1="100" x2="120" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="100" y1="120" x2="100" y2="160" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          </g>
        </svg>
      </div>

      {/* Phase indicator */}
      <div className="text-center">
        <p className="text-sm font-medium mb-3 text-zinc-200">{message}</p>
        <div className="flex gap-2 justify-center">
          {Array.from({ length: totalPhases }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i <= phase ? 'bg-emerald-500' : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 7: Discovery Form & Main Page

### 7.1 Create `/src/components/DiscoveryForm.tsx`

```typescript
'use client';

import { DiscoveryInputs } from '@/types/brand-system';

interface DiscoveryFormProps {
  inputs: DiscoveryInputs;
  setInputs: (inputs: DiscoveryInputs) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const INDUSTRIES = [
  'AI/ML Infrastructure',
  'Developer Tools',
  'B2B SaaS',
  'Fintech',
  'Healthcare Tech',
  'E-commerce',
  'Consumer Apps',
  'Climate Tech',
];

const PERSONALITIES = [
  'innovative', 'trustworthy', 'bold', 'friendly', 'premium',
  'technical', 'playful', 'minimal', 'sophisticated', 'approachable',
];

export function DiscoveryForm({ inputs, setInputs, onGenerate, isLoading }: DiscoveryFormProps) {
  const updateField = <K extends keyof DiscoveryInputs>(field: K, value: DiscoveryInputs[K]) => {
    setInputs({ ...inputs, [field]: value });
  };

  const togglePersonality = (adj: string) => {
    const current = inputs.personalityAdjectives;
    if (current.includes(adj)) {
      updateField('personalityAdjectives', current.filter(a => a !== adj));
    } else if (current.length < 5) {
      updateField('personalityAdjectives', [...current, adj]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium mb-2 text-zinc-300">Company Name</label>
        <input
          type="text"
          value={inputs.companyName}
          onChange={(e) => updateField('companyName', e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-500"
          placeholder="Acme Corp"
        />
      </div>

      {/* Industry */}
      <div>
        <label className="block text-sm font-medium mb-2 text-zinc-300">Industry</label>
        <select
          value={inputs.industry}
          onChange={(e) => updateField('industry', e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-500"
        >
          {INDUSTRIES.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-sm font-medium mb-2 text-zinc-300">Target Audience</label>
        <input
          type="text"
          value={inputs.targetAudience}
          onChange={(e) => updateField('targetAudience', e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-500"
          placeholder="Enterprise developers, DevOps teams"
        />
      </div>

      {/* Personality */}
      <div>
        <label className="block text-sm font-medium mb-2 text-zinc-300">
          Brand Personality (select up to 5)
        </label>
        <div className="flex flex-wrap gap-2">
          {PERSONALITIES.map(adj => (
            <button
              key={adj}
              type="button"
              onClick={() => togglePersonality(adj)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                inputs.personalityAdjectives.includes(adj)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {adj}
            </button>
          ))}
        </div>
      </div>

      {/* Color Mood */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-300">Color Mood</label>
          <select
            value={inputs.colorMood}
            onChange={(e) => updateField('colorMood', e.target.value as DiscoveryInputs['colorMood'])}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="warm">Warm</option>
            <option value="cool">Cool</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-300">Brightness</label>
          <select
            value={inputs.colorBrightness}
            onChange={(e) => updateField('colorBrightness', e.target.value as DiscoveryInputs['colorBrightness'])}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="vibrant">Vibrant</option>
            <option value="muted">Muted</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      {/* Typography & Density */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-300">Typography Style</label>
          <select
            value={inputs.typographyStyle}
            onChange={(e) => updateField('typographyStyle', e.target.value as DiscoveryInputs['typographyStyle'])}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="playful">Playful</option>
            <option value="technical">Technical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-300">Density</label>
          <select
            value={inputs.densityPreference}
            onChange={(e) => updateField('densityPreference', e.target.value as DiscoveryInputs['densityPreference'])}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-500"
          >
            <option value="spacious">Spacious</option>
            <option value="balanced">Balanced</option>
            <option value="compact">Compact</option>
          </select>
        </div>
      </div>

      {/* Existing Color (optional) */}
      <div>
        <label className="block text-sm font-medium mb-2 text-zinc-300">
          Existing Brand Color (optional)
        </label>
        <input
          type="text"
          value={inputs.existingBrandColor || ''}
          onChange={(e) => updateField('existingBrandColor', e.target.value)}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-500"
          placeholder="#FF5500"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isLoading || !inputs.companyName || inputs.personalityAdjectives.length === 0}
        className="w-full py-3 bg-white text-black font-medium rounded-md hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Generating...' : 'Generate Brand System'}
      </button>
    </div>
  );
}
```

### 7.2 Create `/src/components/TokenPreview.tsx`

```typescript
'use client';

import { BrandSystem } from '@/types/brand-system';

interface TokenPreviewProps {
  tokens: BrandSystem;
}

export function TokenPreview({ tokens }: TokenPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Colors Preview */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-zinc-300">Colors (Dark Mode)</h3>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(tokens.colors).map(([name, value]) => (
            <div key={name} className="text-center">
              <div
                className="w-full h-12 rounded-md border border-zinc-700 mb-1"
                style={{ backgroundColor: value.dark }}
              />
              <span className="text-xs text-zinc-500">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Preview */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-zinc-300">Typography</h3>
        <div className="bg-zinc-800 rounded-md p-4">
          <p className="text-xs text-zinc-500 mb-1">Font: {tokens.typography.fontFamily.sans}</p>
          <p className="text-4xl font-bold mb-2" style={{ fontFamily: tokens.typography.fontFamily.sans }}>
            {tokens.voiceAndTone.examples.headlines[0] || 'Headline Example'}
          </p>
          <p className="text-base text-zinc-400" style={{ fontFamily: tokens.typography.fontFamily.sans }}>
            {tokens.voiceAndTone.examples.descriptions[0] || 'Description text example'}
          </p>
        </div>
      </div>

      {/* Voice & Tone */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-zinc-300">Voice & Tone</h3>
        <div className="bg-zinc-800 rounded-md p-4 space-y-2">
          <div className="flex flex-wrap gap-2">
            {tokens.voiceAndTone.personality.map(p => (
              <span key={p} className="px-2 py-1 bg-zinc-700 rounded text-xs text-zinc-300">
                {p}
              </span>
            ))}
          </div>
          <p className="text-sm text-zinc-400">{tokens.voiceAndTone.writingStyle}</p>
        </div>
      </div>

      {/* Raw JSON (collapsible) */}
      <details className="group">
        <summary className="text-sm font-medium cursor-pointer text-zinc-300 hover:text-zinc-100">
          View Raw JSON
        </summary>
        <pre className="mt-2 p-4 bg-zinc-800 rounded-md text-xs text-zinc-400 overflow-auto max-h-64">
          {JSON.stringify(tokens, null, 2)}
        </pre>
      </details>
    </div>
  );
}
```

### 7.3 Create `/src/app/generator/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { DiscoveryInputs, GenerationResult } from '@/types/brand-system';
import { DiscoveryForm } from '@/components/DiscoveryForm';
import { TokenPreview } from '@/components/TokenPreview';
import { GeneratingAnimation } from '@/components/GeneratingAnimation';
import { GenerationFeedback } from '@/components/GenerationFeedback';

const defaultInputs: DiscoveryInputs = {
  companyName: '',
  industry: 'AI/ML Infrastructure',
  targetAudience: '',
  personalityAdjectives: [],
  colorMood: 'cool',
  colorBrightness: 'dark',
  typographyStyle: 'modern',
  densityPreference: 'balanced',
};

export default function GeneratorPage() {
  const [inputs, setInputs] = useState<DiscoveryInputs>(defaultInputs);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const tokens = await response.json();
      setResult(tokens);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Brand Systems Generator</h1>
          <p className="text-zinc-400">Generate a complete design token system powered by AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Discovery Form */}
          <div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Brand Discovery</h2>
              <DiscoveryForm
                inputs={inputs}
                setInputs={setInputs}
                onGenerate={handleGenerate}
                isLoading={loading}
              />
              {error && (
                <p className="mt-4 text-red-400 text-sm">{error}</p>
              )}
            </div>
          </div>

          {/* Right: Output */}
          <div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden min-h-[500px]">
              {loading ? (
                <GeneratingAnimation isGenerating={loading} />
              ) : result ? (
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Generated System</h2>
                  <TokenPreview tokens={result} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[500px] text-zinc-500">
                  <p>Fill out the form and generate a brand system</p>
                </div>
              )}
            </div>

            {/* Feedback */}
            {result && !loading && (
              <div className="mt-4">
                <GenerationFeedback generationId={result._generationId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 8: Admin Dashboard

### 8.1 Create `/src/app/admin/generations/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { database } from '@/lib/firebase';
import { ref, query, orderByChild, limitToLast, get } from 'firebase/database';

interface Generation {
  id: string;
  inputs: Record<string, unknown>;
  tokens: Record<string, unknown>;
  rating: number | null;
  feedbackText: string | null;
  promptVersion: string;
  generationTimeMs: number;
  createdAt: number;
}

export default function GenerationsAdminPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGenerations() {
      if (!database) {
        setError('Database not initialized');
        setLoading(false);
        return;
      }

      try {
        const generationsRef = ref(database, 'generations');
        const generationsQuery = query(generationsRef, orderByChild('createdAt'), limitToLast(50));
        const snapshot = await get(generationsQuery);

        if (snapshot.exists()) {
          const data: Generation[] = [];
          snapshot.forEach((child) => {
            data.push({ id: child.key!, ...child.val() });
          });
          // Reverse to show newest first
          setGenerations(data.reverse());
        }
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchGenerations();
  }, []);

  if (loading) {
    return <div className="p-8 text-zinc-400">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-400">Error: {error}</div>;
  }

  const total = generations.length;
  const rated = generations.filter(g => g.rating !== null);
  const positive = rated.filter(g => g.rating === 5).length;
  const negative = rated.filter(g => g.rating === 1).length;
  const avgTime = total > 0
    ? generations.reduce((acc, g) => acc + (g.generationTimeMs || 0), 0) / total
    : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Generation Analytics</h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-400">Total</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-400">Positive</p>
            <p className="text-2xl font-bold text-green-500">{positive}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-400">Negative</p>
            <p className="text-2xl font-bold text-red-500">{negative}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-400">Avg Time</p>
            <p className="text-2xl font-bold">{(avgTime / 1000).toFixed(1)}s</p>
          </div>
        </div>

        {/* Generations List */}
        <div className="space-y-4">
          {generations.map((gen) => (
            <div
              key={gen.id}
              className={`border rounded-lg p-4 ${
                gen.rating === 5
                  ? 'border-green-500/50 bg-green-500/5'
                  : gen.rating === 1
                    ? 'border-red-500/50 bg-red-500/5'
                    : 'border-zinc-800 bg-zinc-900'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium">{(gen.inputs as { companyName?: string })?.companyName || 'Unknown'}</span>
                  <span className="text-sm text-zinc-400 ml-2">
                    {(gen.inputs as { industry?: string })?.industry}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {gen.rating === 5 && <span className="text-green-500">👍</span>}
                  {gen.rating === 1 && <span className="text-red-500">👎</span>}
                  <span className="text-xs text-zinc-500">
                    {new Date(gen.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {gen.feedbackText && (
                <p className="text-sm text-zinc-400 mt-2 p-2 bg-zinc-800 rounded">
                  {gen.feedbackText}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 9: Global Styles

### 9.1 Update `/src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #09090b;
  --foreground: #fafafa;
}

body {
  background-color: var(--background);
  color: var(--foreground);
}

/* Custom animation for loading spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}
```

### 9.2 Update `/src/app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nertia Brand Generator',
  description: 'AI-powered brand systems generator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

---

## Testing Checklist

- [ ] Project initializes without errors
- [ ] Environment variables load correctly
- [ ] Firebase connection works
- [ ] Firebase Auth (Google Sign-in) works
- [ ] `/generator` page renders discovery form
- [ ] Form validation prevents empty submissions
- [ ] Generation API returns valid tokens
- [ ] Loading animation plays during generation
- [ ] Token preview displays generated colors
- [ ] Feedback submission works
- [ ] Admin dashboard shows generations
- [ ] Golden examples inject into prompts

---

## File Summary

```
src/
├── app/
│   ├── api/
│   │   ├── generate-tokens/route.ts      # Main generation endpoint
│   │   └── generations/feedback/route.ts # Feedback endpoint
│   ├── generator/page.tsx                # Main generator UI
│   ├── login/page.tsx                    # Google Sign-in page
│   ├── admin/generations/page.tsx        # Admin dashboard
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── AuthGuard.tsx                     # Route protection
│   ├── DiscoveryForm.tsx                 # Brand input form
│   ├── TokenPreview.tsx                  # Token visualization
│   ├── GeneratingAnimation.tsx           # Loading animation
│   ├── GenerationFeedback.tsx            # Rating component
│   └── Providers.tsx                     # Auth provider wrapper
├── hooks/
│   └── useGenerationProgress.ts          # Animation timing
├── lib/
│   ├── firebase.ts                       # Firebase client
│   └── auth-context.tsx                  # Auth context/hooks
├── types/
│   ├── brand-system.ts                   # TypeScript interfaces
│   └── user.ts                           # User type
└── utils/
    ├── tokens-to-css.ts                  # CSS variable generation
    └── prompt-builder.ts                 # Dynamic prompt construction
```

---

## Next Steps After MVP

1. **Add Golden Examples** - Manually curate 5-10 high-quality generations
2. **Research Agent** - Automate color/typography research
3. **Chat Editing** - Natural language token updates
4. **Export Options** - Download tokens as JSON/CSS

---

*Created: January 2026*
*For: Nertia Brand Generator - Complete Build*
