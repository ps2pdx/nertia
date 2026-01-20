# Nertia Brand Generator

AI-powered brand systems generator that creates complete design token systems from brand inputs.

## Features

- **Discovery Form** - Collect brand inputs: company name, industry, audience, personality, colors, typography
- **AI Generation** - Generate comprehensive design tokens using Claude API
- **Token-Styled Preview** - Live preview that uses actual generated tokens (not site CSS)
- **Light/Dark Mode** - Toggle preview between color modes
- **Component Previews** - Buttons, inputs, cards, alerts, typography, spacing, grid
- **Export Options** - Download as JSON, CSS variables, or Tailwind config
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

## Tech Stack

- **Framework:** Next.js 15 with Turbopack
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS custom properties
- **AI:** Claude Sonnet 4 via Anthropic SDK
- **Database:** Firebase Realtime Database
- **Auth:** Firebase Authentication with Google OAuth

## Documentation

See [instructions/nertia-brand-generator-complete-instructions.md](./instructions/nertia-brand-generator-complete-instructions.md) for comprehensive documentation including:

- Project architecture
- API endpoints
- Prompt engineering details
- Firebase setup
- Development workflow

## Key Pages

- `/generator` - Main brand generator (no auth required)
- `/generator/history` - Past generations (requires auth)
- `/admin/generations` - Analytics dashboard
- `/admin/golden-examples` - Curate example outputs

## License

Private - Nertia AI
