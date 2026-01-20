# Nertia Brand Generator

AI-powered brand system generator that creates comprehensive design tokens, style guides, and multi-format export assets.

## Features

### Brand System Generation

Generate a complete brand system from a simple discovery questionnaire:

- **Colors** - Core palette with light/dark mode support, surface colors, semantic colors, usage ratios
- **Typography** - Font families, size scale, type scale with full specs (H1-micro)
- **Spacing** - Numeric scale + semantic spacing (section, card, component gaps)
- **Grid System** - Desktop/mobile column layouts with gutters and margins
- **Components** - Buttons, Cards, Inputs, Alerts, Tags, Tabs, Tables, Forms
- **Icons** - Size scale, stroke specs, suggested categories
- **Motion** - Durations, easings, interaction patterns, loading states
- **Data Visualization** - Stat cards, progress bars, timelines, code blocks
- **Logo Guidelines** - Variants, clear space, sizing, do/don't rules
- **Voice & Tone** - Personality, writing style, examples, guidelines
- **Imagery** - Photo styles, treatment specs, do/don't guidelines

### Export Formats

#### Token Exports
- **JSON** - Raw brand system tokens
- **CSS** - CSS custom properties with light/dark mode
- **Tailwind** - Tailwind CSS config extension

#### Advanced Exports
- **Email Template** - Email-safe HTML with inline styles, table-based layout
- **One-Sheeter** - Print-ready brand summary (browser print to PDF)
- **Landing Page** - Complete landing page with hero, features, CTA sections
- **Social Media** - OG images, Twitter cards, LinkedIn banners, Instagram posts
- **Slideshow** - Multi-slide brand presentation deck

### Additional Features

- **Light/Dark Mode** - Toggle preview between color modes
- **Token Editing** - Edit colors, typography, borders, spacing after generation
- **Randomize** - Quick random inputs for testing and ideation
- **Demo Mode** - Works without API keys or Firebase configuration

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000/generator
```

No configuration required for demo mode. The generator works out of the box with intelligent local token generation.

## Configuration (Optional)

Create `.env.local` for full features:

```env
# Anthropic API (for Claude-powered generation)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
USE_DEMO_MODE=false

# Firebase (for saving generations and user auth)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── export/[format]/  # Export generation API
│   │   ├── generate-tokens/  # Brand system generation
│   │   └── generations/      # Saved generations
│   ├── design-system/        # Static design system reference
│   └── brand/[id]/           # Generated brand view
├── components/
│   ├── BrandSystemView.tsx   # Main brand display component
│   ├── ExportOptions.tsx     # Export UI with advanced options
│   └── ...
├── generators/             # Multi-format export generators
│   ├── types.ts             # Generator type definitions
│   ├── base-generator.ts    # Shared utilities
│   ├── email-template/
│   ├── one-sheeter/
│   ├── landing-page/
│   ├── social-media/
│   └── slideshow/
├── types/
│   └── brand-system.ts      # BrandSystem v2.1 schema
└── utils/
    ├── prompt-builder.ts    # AI prompt construction
    └── tokens-to-css.ts     # Token to CSS conversion
```

## Schema Version

Current schema version: **v2.1.0**

### v2.1 Additions
- Data Visualization tokens (stat cards, progress, timelines, code blocks)
- Logo section (variants, clear space, sizing guidelines)
- Extended components (tags, tabs, form elements, table variants)
- Loading states (spinner, skeleton, pulse, dots)

### v2.0 Features
- Light/dark mode color values
- Surface and border color hierarchies
- Typography scale with font assignments
- Semantic spacing tokens
- Component-level design tokens
- Motion interactions and principles

## API Reference

### Generate Brand System

```
POST /api/generate-tokens
```

Request body:
```json
{
  "companyName": "string",
  "industry": "string",
  "targetAudience": "string",
  "personalityAdjectives": ["bold", "trustworthy", "innovative"],
  "colorMood": "warm" | "cool" | "neutral",
  "colorBrightness": "vibrant" | "muted" | "dark",
  "typographyStyle": "modern" | "classic" | "playful" | "technical",
  "densityPreference": "spacious" | "balanced" | "compact",
  "existingBrandColor": "#optional-hex"
}
```

### Export Generation

```
POST /api/export/[format]
```

Formats: `email-template`, `one-sheeter`, `landing-page`, `social-media`, `slideshow`

Request body:
```json
{
  "tokens": { /* BrandSystem object */ },
  "options": {
    "colorMode": "light" | "dark" | "both"
  }
}
```

## Key Pages

- `/generator` - Main brand generator (no auth required)
- `/generator/history` - Past generations (requires auth)
- `/admin/generations` - Analytics dashboard
- `/admin/golden-examples` - Curate example outputs

## Tech Stack

- **Framework**: Next.js 15 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS custom properties
- **AI**: Claude Sonnet 4 via Anthropic SDK
- **Database**: Firebase Realtime Database
- **Auth**: Firebase Authentication with Google OAuth

## Documentation

See [instructions/nertia-brand-generator-complete-instructions.md](./instructions/nertia-brand-generator-complete-instructions.md) for comprehensive documentation.

## License

Private - Nertia AI
