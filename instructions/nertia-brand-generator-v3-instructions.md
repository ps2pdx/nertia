# Claude Code Instructions: Nertia Brand Generator v3
## Complete Design System Output with Decision Logic

---

## Overview

Rebuild the Nertia Brand Generator with a focus on:
1. **Complete design system output** — no skimping on sections
2. **Intelligent input logic** — questions that drive decisions, not just data collection
3. **Decision framework** — the "secret sauce" algorithm for brand choices
4. **Clean UI** — single-row sections, dark mode fixes, proper spacing
5. **Preserve multi-channel** — it's already working, don't break it

**Branch:** `feature/generator-v3`

**Important:** The multi-channel output functionality is working well. This rebuild focuses on fixing the design system completeness and implementing decision logic. Do NOT remove or rebuild multi-channel — preserve it.

---

## Part 1: Current Problems (v2 Issues)

### Missing/Incomplete Output Sections
- [ ] Animations — missing entirely or sparse
- [ ] Data Visualization — no chart/graph color systems
- [ ] Iconography — undefined style guidelines
- [ ] Photography/Imagery — no direction
- [ ] Illustration Style — missing
- [ ] Grid Systems — not defined
- [ ] Responsive Breakpoints — missing specifications

### Typography Depth Issues
- [ ] Only showing font names, not full scale
- [ ] Missing context for when to use each style
- [ ] No variation examples (weights, sizes in context)
- [ ] Default body text not clearly defined

### UI/Layout Issues
- [ ] Split rows — sections cramped side-by-side
- [ ] Insufficient spacing between sections
- [ ] Dark mode bugs:
  - Link "open in new tab" button styling
  - Card backgrounds not updating
  - Contrast issues on certain elements

### Logic Issues
- [ ] Inputs disconnected from outputs
- [ ] No clear decision-making framework
- [ ] Same outputs regardless of industry/audience
- [ ] No derived values from user selections

---

## Part 2: Architecture — The Decision Framework

### The Moat: Brand Logic Algorithm

This is where Nertia differentiates. We're not just generating random tokens — we're encoding brand strategy logic into a system that makes informed decisions.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      NERTIA DECISION FRAMEWORK                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐    ┌──────────────────┐    ┌───────────────────────┐ │
│  │   INPUTS     │───▶│  DECISION LOGIC  │───▶│   DESIGN SYSTEM       │ │
│  │              │    │                  │    │                       │ │
│  │ Industry     │    │ Industry Rules   │    │ Colors (complete)     │ │
│  │ Audience     │    │ Audience Rules   │    │ Typography (full)     │ │
│  │ Positioning  │    │ Positioning Map  │    │ Spacing               │ │
│  │ Personality  │    │ Personality Mix  │    │ Components            │ │
│  │ Constraints  │    │ Constraint Check │    │ Animation             │ │
│  │              │    │                  │    │ Data Viz              │ │
│  │              │    │ ┌──────────────┐ │    │ Iconography           │ │
│  │              │    │ │ OUTLIER      │ │    │ Imagery Direction     │ │
│  │              │    │ │ RANDOMIZER   │ │    │ Voice & Tone          │ │
│  │              │    │ └──────────────┘ │    │ Grid System           │ │
│  └──────────────┘    └──────────────────┘    └───────────────────────┘ │
│                                                                         │
│  Key: Decisions are DERIVED, not random. Logic is the product.         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Decision Logic Rules (Examples)

```typescript
// Example: Industry → Color Mood Defaults
const INDUSTRY_COLOR_RULES: Record<string, ColorDefaults> = {
  'AI Infrastructure': {
    defaultMood: 'cool',
    defaultBrightness: 'muted',
    suggestedPalettes: ['deep blue + cyan accent', 'charcoal + electric green'],
    avoidColors: ['warm oranges', 'pastels'],
    reasoning: 'Technical credibility, precision, trust'
  },
  'Healthcare Tech': {
    defaultMood: 'cool',
    defaultBrightness: 'bright',
    suggestedPalettes: ['clean blue + white', 'teal + soft gray'],
    avoidColors: ['aggressive reds', 'black-heavy'],
    reasoning: 'Trust, cleanliness, care, accessibility'
  },
  'Consumer Fintech': {
    defaultMood: 'warm',
    defaultBrightness: 'bright',
    suggestedPalettes: ['green + gold', 'purple + coral'],
    avoidColors: ['dull grays', 'institutional blues'],
    reasoning: 'Approachable, modern, growth-oriented'
  },
  'Developer Tools': {
    defaultMood: 'neutral',
    defaultBrightness: 'dark',
    suggestedPalettes: ['dark + syntax-highlight accents', 'monochrome + neon'],
    avoidColors: ['corporate blue', 'childish colors'],
    reasoning: 'Technical sophistication, code-native feel'
  },
  // ... more industries
};

// Example: Audience → Typography Defaults
const AUDIENCE_TYPOGRAPHY_RULES: Record<string, TypographyDefaults> = {
  'Developers / Engineers': {
    headingStyle: 'geometric-sans',
    bodyStyle: 'clean-sans',
    monoRequired: true,
    suggestedPairings: ['Inter + JetBrains Mono', 'IBM Plex Sans + IBM Plex Mono'],
    reasoning: 'Readability, code-friendliness, no-nonsense'
  },
  'Enterprise Executives': {
    headingStyle: 'modern-serif-or-sans',
    bodyStyle: 'readable-serif',
    monoRequired: false,
    suggestedPairings: ['Instrument Serif + Inter', 'PP Editorial + Söhne'],
    reasoning: 'Authority, sophistication, trustworthiness'
  },
  'Consumers (General)': {
    headingStyle: 'friendly-sans',
    bodyStyle: 'highly-readable',
    monoRequired: false,
    suggestedPairings: ['Nunito + Open Sans', 'Poppins + Source Sans Pro'],
    reasoning: 'Approachability, warmth, accessibility'
  },
  // ... more audiences
};

// Example: Positioning → Voice & Tone
const POSITIONING_VOICE_RULES: Record<string, VoiceDefaults> = {
  'Market Leader': {
    tone: ['confident', 'authoritative', 'established'],
    avoid: ['trying too hard', 'defensive', 'comparison-heavy'],
    ctaStyle: 'direct-and-simple',
    headlineStyle: 'declarative'
  },
  'Challenger / Disruptor': {
    tone: ['bold', 'provocative', 'energetic'],
    avoid: ['corporate speak', 'safe', 'bland'],
    ctaStyle: 'action-oriented',
    headlineStyle: 'punchy-or-contrarian'
  },
  'Premium / Luxury': {
    tone: ['refined', 'understated', 'exclusive'],
    avoid: ['loud', 'salesy', 'casual'],
    ctaStyle: 'elegant-invitation',
    headlineStyle: 'minimal-and-evocative'
  },
  'Approachable / Friendly': {
    tone: ['warm', 'conversational', 'helpful'],
    avoid: ['stiff', 'jargon-heavy', 'intimidating'],
    ctaStyle: 'encouraging',
    headlineStyle: 'benefit-focused'
  },
  // ... more positioning types
};
```

### The Outlier Randomizer

For brands that want to intentionally break conventions (think: Liquid Death, Cards Against Humanity):

```typescript
interface OutlierSettings {
  enabled: boolean;
  intensity: 'subtle' | 'moderate' | 'extreme';
  dimensions: {
    colorContrast: boolean;    // Use unexpected color for industry
    typographyMismatch: boolean; // Serif for tech, etc.
    toneInversion: boolean;    // Playful for serious industry
    visualSurprise: boolean;   // Unexpected imagery direction
  };
}

// When outlier is enabled, the system intentionally picks from "wrong" choices
// but in a deliberate, strategic way — not random chaos
```

---

## Part 3: Input System Design

### Input Categories & Questions

The form should be organized into logical sections. Answers should **pre-populate** related fields where possible.

#### Section 1: Company Foundation
```typescript
interface CompanyFoundation {
  // Required
  companyName: string;
  
  // Industry (drives many defaults)
  industry: IndustryType;
  industrySpecific?: string; // If "Other" selected
  
  // What you do (helps with voice)
  productDescription: string; // 1-2 sentences
  
  // Stage (affects sophistication level)
  companyStage: 'pre-seed' | 'seed' | 'series-a' | 'series-b+' | 'established' | 'enterprise';
}

type IndustryType = 
  | 'AI Infrastructure'
  | 'Developer Tools'
  | 'B2B SaaS'
  | 'Consumer Fintech'
  | 'Healthcare Tech'
  | 'Climate Tech'
  | 'E-commerce'
  | 'Media / Entertainment'
  | 'Education'
  | 'Real Estate Tech'
  | 'Other';
```

**UI Behavior:** When industry is selected, pre-populate:
- Suggested color mood
- Suggested typography style
- Default audience options
- Relevant personality traits

---

#### Section 2: Target Audience
```typescript
interface TargetAudience {
  // Primary audience (drives typography, complexity)
  primaryAudience: AudienceType;
  
  // Secondary audience (influences tone balance)
  secondaryAudience?: AudienceType;
  
  // Technical sophistication of audience
  technicalLevel: 'non-technical' | 'somewhat-technical' | 'highly-technical';
  
  // Geographic/cultural context
  primaryMarket: 'US' | 'Europe' | 'Asia-Pacific' | 'Global' | 'Other';
}

type AudienceType =
  | 'Developers / Engineers'
  | 'Product Managers'
  | 'Designers'
  | 'C-Suite Executives'
  | 'Enterprise Procurement'
  | 'SMB Owners'
  | 'Investors / VCs'
  | 'General Consumers'
  | 'Students / Educators'
  | 'Healthcare Professionals'
  | 'Other';
```

**UI Behavior:** When audience is selected, pre-populate:
- Typography suggestions
- Voice formality level
- Recommended reading level

---

#### Section 3: Brand Positioning
```typescript
interface BrandPositioning {
  // How you want to be perceived in market
  positioningType: PositioningType;
  
  // Key differentiator (what makes you unique)
  keyDifferentiator: string;
  
  // Competitive context
  competitorExamples?: string; // "Similar to X but..."
  
  // Price/value positioning
  pricePosition: 'budget' | 'mid-market' | 'premium' | 'enterprise';
}

type PositioningType =
  | 'Market Leader'
  | 'Challenger / Disruptor'
  | 'Premium / Luxury'
  | 'Approachable / Friendly'
  | 'Technical Expert'
  | 'Innovative Pioneer'
  | 'Trusted Partner'
  | 'Community-Driven';
```

**UI Behavior:** When positioning is selected, pre-populate:
- Voice & tone defaults
- CTA style
- Headline approach

---

#### Section 4: Brand Personality
```typescript
interface BrandPersonality {
  // Select 3-5 personality traits
  traits: PersonalityTrait[]; // min 3, max 5
  
  // Brand archetype (optional but helpful)
  archetype?: BrandArchetype;
  
  // What you are NOT (clarifying contrast)
  antiTraits?: PersonalityTrait[]; // max 3
}

type PersonalityTrait =
  | 'Bold'
  | 'Confident'
  | 'Playful'
  | 'Serious'
  | 'Innovative'
  | 'Traditional'
  | 'Warm'
  | 'Professional'
  | 'Edgy'
  | 'Calm'
  | 'Energetic'
  | 'Sophisticated'
  | 'Approachable'
  | 'Authoritative'
  | 'Minimal'
  | 'Expressive'
  | 'Trustworthy'
  | 'Disruptive';

type BrandArchetype =
  | 'The Hero'
  | 'The Sage'
  | 'The Explorer'
  | 'The Creator'
  | 'The Ruler'
  | 'The Caregiver'
  | 'The Magician'
  | 'The Rebel'
  | 'The Everyman'
  | 'The Lover'
  | 'The Jester'
  | 'The Innocent';
```

---

#### Section 5: Visual Preferences
```typescript
interface VisualPreferences {
  // Color mood (can be pre-populated from industry)
  colorMood: 'warm' | 'cool' | 'neutral';
  
  // Color brightness
  colorBrightness: 'bright' | 'muted' | 'dark';
  
  // Existing brand color (if any)
  existingPrimaryColor?: string; // hex
  
  // Typography preference (can be pre-populated from audience)
  typographyStyle: 'geometric-modern' | 'humanist-friendly' | 'classic-serif' | 'technical-mono' | 'editorial-elegant';
  
  // Density / whitespace preference
  densityPreference: 'spacious' | 'balanced' | 'compact';
  
  // Visual style references (optional)
  referenceUrls?: string[]; // max 3
}
```

---

#### Section 6: Outlier Mode (Advanced)
```typescript
interface OutlierMode {
  // Enable intentional rule-breaking
  enabled: boolean;
  
  // How far to push it
  intensity?: 'subtle' | 'moderate' | 'extreme';
  
  // What dimensions to break
  breakConventions?: {
    colorExpectations: boolean;
    typographyExpectations: boolean;
    toneExpectations: boolean;
  };
  
  // Reference brands that break rules well
  outlierInspiration?: string; // e.g., "Liquid Death", "Mailchimp"
}
```

---

## Part 4: Complete Design System Output Schema

### Full Output Structure

```typescript
interface BrandSystemV3 {
  // Metadata
  metadata: {
    name: string;
    generatedAt: string;
    version: string;
    inputSummary: InputSummary; // Reference to inputs that drove this
  };

  // 1. COLOR SYSTEM (Complete)
  colors: ColorSystem;

  // 2. TYPOGRAPHY (Full depth)
  typography: TypographySystem;

  // 3. SPACING & LAYOUT
  spacing: SpacingSystem;
  grid: GridSystem;
  breakpoints: BreakpointSystem;

  // 4. BORDERS & SHAPES
  borders: BorderSystem;

  // 5. SHADOWS & ELEVATION
  shadows: ShadowSystem;

  // 6. ANIMATION & MOTION
  animation: AnimationSystem;

  // 7. COMPONENTS (Reference styles)
  components: ComponentStyles;

  // 8. DATA VISUALIZATION
  dataVisualization: DataVizSystem;

  // 9. ICONOGRAPHY
  iconography: IconographySystem;

  // 10. IMAGERY & PHOTOGRAPHY
  imagery: ImagerySystem;

  // 11. VOICE & TONE
  voiceAndTone: VoiceSystem;

  // 12. USAGE GUIDELINES
  guidelines: UsageGuidelines;
}
```

---

### 1. Color System (Complete)

```typescript
interface ColorSystem {
  // Core semantic colors
  core: {
    background: { light: string; dark: string };
    foreground: { light: string; dark: string };
    muted: { light: string; dark: string };
    mutedForeground: { light: string; dark: string };
  };

  // Brand colors
  brand: {
    primary: { light: string; dark: string };
    primaryForeground: { light: string; dark: string };
    secondary: { light: string; dark: string };
    secondaryForeground: { light: string; dark: string };
    accent: { light: string; dark: string };
    accentForeground: { light: string; dark: string };
  };

  // UI colors
  ui: {
    card: { light: string; dark: string };
    cardForeground: { light: string; dark: string };
    cardBorder: { light: string; dark: string };
    popover: { light: string; dark: string };
    popoverForeground: { light: string; dark: string };
    input: { light: string; dark: string };
    inputBorder: { light: string; dark: string };
    ring: { light: string; dark: string };
  };

  // Semantic/feedback colors
  semantic: {
    success: { light: string; dark: string };
    successForeground: { light: string; dark: string };
    warning: { light: string; dark: string };
    warningForeground: { light: string; dark: string };
    error: { light: string; dark: string };
    errorForeground: { light: string; dark: string };
    info: { light: string; dark: string };
    infoForeground: { light: string; dark: string };
  };

  // Extended palette (for illustrations, gradients, etc.)
  extended: {
    palette: Array<{
      name: string;
      hex: { light: string; dark: string };
      usage: string;
    }>;
    gradients: Array<{
      name: string;
      css: string;
      usage: string;
    }>;
  };
}
```

---

### 2. Typography System (Full Depth)

```typescript
interface TypographySystem {
  // Font families
  fontFamily: {
    heading: string;
    body: string;
    mono: string;
    accent?: string; // Optional display font
  };

  // Google Fonts import URL
  fontImport: string;

  // Complete type scale with context
  scale: {
    // Display (hero, major headings)
    display: {
      '2xl': TypeStyle;
      xl: TypeStyle;
      lg: TypeStyle;
    };
    // Headings
    heading: {
      h1: TypeStyle;
      h2: TypeStyle;
      h3: TypeStyle;
      h4: TypeStyle;
      h5: TypeStyle;
      h6: TypeStyle;
    };
    // Body text
    body: {
      lg: TypeStyle;
      base: TypeStyle;  // DEFAULT BODY TEXT
      sm: TypeStyle;
      xs: TypeStyle;
    };
    // UI text
    ui: {
      label: TypeStyle;
      button: TypeStyle;
      caption: TypeStyle;
      overline: TypeStyle;
    };
    // Code
    code: {
      block: TypeStyle;
      inline: TypeStyle;
    };
  };

  // Font weights available
  weights: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold?: number;
  };

  // Line heights
  lineHeight: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };

  // Letter spacing
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };

  // Text styles with full context
  textStyles: {
    [key: string]: {
      fontFamily: string;
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing: string;
      textTransform?: string;
      usage: string; // When to use this style
      example: string; // Example text in this style
    };
  };
}

interface TypeStyle {
  fontSize: string;
  lineHeight: number;
  fontWeight: number;
  letterSpacing: string;
  fontFamily: 'heading' | 'body' | 'mono' | 'accent';
  usage: string;
  example: string;
}
```

---

### 3. Spacing System

```typescript
interface SpacingSystem {
  // Base unit (typically 4px or 8px)
  baseUnit: number;
  
  // Scale
  scale: {
    '0': string;
    'px': string;
    '0.5': string;
    '1': string;
    '1.5': string;
    '2': string;
    '2.5': string;
    '3': string;
    '3.5': string;
    '4': string;
    '5': string;
    '6': string;
    '7': string;
    '8': string;
    '9': string;
    '10': string;
    '11': string;
    '12': string;
    '14': string;
    '16': string;
    '20': string;
    '24': string;
    '28': string;
    '32': string;
    '36': string;
    '40': string;
    '44': string;
    '48': string;
    '52': string;
    '56': string;
    '60': string;
    '64': string;
    '72': string;
    '80': string;
    '96': string;
  };

  // Semantic spacing
  semantic: {
    componentPadding: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    sectionGap: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    contentWidth: {
      prose: string;
      content: string;
      wide: string;
      full: string;
    };
  };
}
```

---

### 4. Grid System

```typescript
interface GridSystem {
  // Column system
  columns: {
    count: number; // typically 12
    gutter: string;
    margin: string;
  };

  // Container widths
  container: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };

  // Common layouts
  layouts: {
    [key: string]: {
      columns: string;
      gap: string;
      usage: string;
    };
  };
}
```

---

### 5. Breakpoint System

```typescript
interface BreakpointSystem {
  breakpoints: {
    xs: string;  // 0px
    sm: string;  // 640px
    md: string;  // 768px
    lg: string;  // 1024px
    xl: string;  // 1280px
    '2xl': string; // 1536px
  };

  // Behavior notes
  mobileFirst: boolean;
  
  // Key breakpoint behaviors
  behaviors: {
    [breakpoint: string]: {
      typography: string;
      spacing: string;
      layout: string;
    };
  };
}
```

---

### 6. Border System

```typescript
interface BorderSystem {
  // Border radius
  radius: {
    none: string;
    sm: string;
    default: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
  };

  // Border widths
  width: {
    '0': string;
    '1': string;
    '2': string;
    '4': string;
    '8': string;
  };

  // Border styles
  styles: {
    default: string;
    dashed: string;
    dotted: string;
  };
}
```

---

### 7. Shadow System

```typescript
interface ShadowSystem {
  // Elevation shadows
  elevation: {
    none: string;
    xs: string;
    sm: string;
    default: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
  };

  // Colored shadows (brand)
  colored: {
    primary: string;
    accent: string;
  };

  // Usage guidelines
  usage: {
    cards: string;
    modals: string;
    dropdowns: string;
    buttons: string;
  };
}
```

---

### 8. Animation System (CRITICAL - was missing)

```typescript
interface AnimationSystem {
  // Durations
  duration: {
    fastest: string;  // 50ms
    faster: string;   // 100ms
    fast: string;     // 150ms
    normal: string;   // 200ms
    slow: string;     // 300ms
    slower: string;   // 400ms
    slowest: string;  // 500ms
  };

  // Easing functions
  easing: {
    linear: string;
    in: string;
    out: string;
    inOut: string;
    // Brand-specific curves
    bounce: string;
    elastic: string;
    smooth: string;
  };

  // Common animations (CSS keyframes)
  keyframes: {
    fadeIn: string;
    fadeOut: string;
    slideInUp: string;
    slideInDown: string;
    slideInLeft: string;
    slideInRight: string;
    scaleIn: string;
    scaleOut: string;
    spin: string;
    pulse: string;
    bounce: string;
    // Brand-specific
    brandEntrance: string;
    brandExit: string;
  };

  // Transition presets
  transitions: {
    default: string;
    fast: string;
    slow: string;
    colors: string;
    opacity: string;
    transform: string;
    all: string;
  };

  // Animation patterns
  patterns: {
    hover: {
      buttons: string;
      cards: string;
      links: string;
    };
    loading: {
      spinner: string;
      skeleton: string;
      dots: string;
    };
    page: {
      enter: string;
      exit: string;
    };
  };

  // Reduced motion alternatives
  reducedMotion: {
    respectsPreference: boolean;
    alternatives: {
      [animation: string]: string;
    };
  };
}
```

---

### 9. Data Visualization System (CRITICAL - was missing)

```typescript
interface DataVizSystem {
  // Chart color palette
  chartColors: {
    primary: string[];    // Sequential palette (5-7 colors)
    secondary: string[];  // Categorical palette (5-7 colors)
    diverging: string[];  // For positive/negative (7 colors)
    status: {
      positive: string;
      negative: string;
      neutral: string;
    };
  };

  // Chart typography
  chartTypography: {
    title: TypeStyle;
    axis: TypeStyle;
    label: TypeStyle;
    tooltip: TypeStyle;
    legend: TypeStyle;
  };

  // Grid and lines
  chartElements: {
    gridLine: {
      color: { light: string; dark: string };
      width: string;
      style: string;
    };
    axisLine: {
      color: { light: string; dark: string };
      width: string;
    };
    tickMark: {
      color: { light: string; dark: string };
      length: string;
    };
  };

  // Specific chart styles
  chartStyles: {
    bar: {
      borderRadius: string;
      gap: string;
    };
    line: {
      strokeWidth: string;
      dotRadius: string;
      tension: number;
    };
    pie: {
      innerRadius: string; // 0 for pie, >0 for donut
      padAngle: number;
      cornerRadius: string;
    };
    area: {
      opacity: number;
      strokeWidth: string;
    };
  };

  // Tooltip styles
  tooltip: {
    background: { light: string; dark: string };
    border: { light: string; dark: string };
    borderRadius: string;
    padding: string;
    shadow: string;
  };
}
```

---

### 10. Iconography System (was missing)

```typescript
interface IconographySystem {
  // Icon style
  style: 'outline' | 'solid' | 'duotone' | 'custom';
  
  // Recommended icon library
  library: {
    name: string; // e.g., "Lucide", "Heroicons", "Phosphor"
    url: string;
    variant: string;
  };

  // Icon sizing
  sizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  // Stroke weight (for outline icons)
  strokeWidth: string;

  // Icon colors
  colors: {
    default: { light: string; dark: string };
    muted: { light: string; dark: string };
    accent: { light: string; dark: string };
  };

  // Usage guidelines
  usage: {
    inlineWithText: {
      size: string;
      verticalAlign: string;
    };
    standalone: {
      minTouchTarget: string;
    };
    decorative: {
      ariaHidden: boolean;
    };
  };
}
```

---

### 11. Imagery System (was missing)

```typescript
interface ImagerySystem {
  // Photography style
  photography: {
    style: 'candid' | 'editorial' | 'lifestyle' | 'product' | 'abstract' | 'documentary';
    colorTreatment: 'full-color' | 'muted' | 'black-and-white' | 'duotone' | 'high-contrast';
    subjects: string[]; // e.g., ['people', 'workspaces', 'technology']
    avoid: string[]; // e.g., ['stock-looking', 'staged', 'outdated tech']
  };

  // Illustration style (if applicable)
  illustration: {
    style: 'flat' | 'isometric' | '3d' | 'hand-drawn' | 'line-art' | 'none';
    colorPalette: string[]; // References to brand colors
    strokeWeight?: string;
    complexity: 'simple' | 'detailed' | 'complex';
  };

  // Image treatments
  treatments: {
    borderRadius: string;
    overlay?: {
      color: string;
      opacity: number;
    };
    aspectRatios: {
      hero: string;
      card: string;
      thumbnail: string;
      avatar: string;
    };
  };

  // Placeholder/loading
  placeholder: {
    backgroundColor: { light: string; dark: string };
    shimmerColor: { light: string; dark: string };
    blurDataURL: boolean;
  };
}
```

---

### 12. Voice & Tone System

```typescript
interface VoiceSystem {
  // Core voice attributes
  voiceAttributes: string[]; // 3-5 adjectives
  
  // Tone variations by context
  toneVariations: {
    marketing: {
      attributes: string[];
      example: string;
    };
    product: {
      attributes: string[];
      example: string;
    };
    support: {
      attributes: string[];
      example: string;
    };
    error: {
      attributes: string[];
      example: string;
    };
  };

  // Writing style guidelines
  writingStyle: {
    sentenceLength: 'short' | 'medium' | 'varied';
    vocabulary: 'simple' | 'professional' | 'technical';
    contractions: boolean;
    exclamationPoints: 'never' | 'sparingly' | 'frequently';
    emojiUse: 'never' | 'sparingly' | 'encouraged';
  };

  // Example content
  examples: {
    headlines: Array<{
      context: string;
      text: string;
    }>;
    ctas: Array<{
      context: string;
      text: string;
    }>;
    productCopy: Array<{
      context: string;
      text: string;
    }>;
    errorMessages: Array<{
      context: string;
      text: string;
    }>;
  };

  // Words and phrases
  vocabulary: {
    preferred: string[];
    avoid: string[];
  };
}
```

---

### 13. Component Reference Styles

```typescript
interface ComponentStyles {
  // Button variants
  button: {
    variants: {
      primary: ComponentVariant;
      secondary: ComponentVariant;
      outline: ComponentVariant;
      ghost: ComponentVariant;
      destructive: ComponentVariant;
      link: ComponentVariant;
    };
    sizes: {
      sm: SizeVariant;
      md: SizeVariant;
      lg: SizeVariant;
      xl: SizeVariant;
    };
  };

  // Input styles
  input: {
    default: ComponentVariant;
    error: ComponentVariant;
    disabled: ComponentVariant;
    sizes: {
      sm: SizeVariant;
      md: SizeVariant;
      lg: SizeVariant;
    };
  };

  // Card styles
  card: {
    default: ComponentVariant;
    elevated: ComponentVariant;
    outlined: ComponentVariant;
    interactive: ComponentVariant;
  };

  // Badge styles
  badge: {
    variants: {
      default: ComponentVariant;
      secondary: ComponentVariant;
      success: ComponentVariant;
      warning: ComponentVariant;
      error: ComponentVariant;
      outline: ComponentVariant;
    };
  };

  // Alert styles
  alert: {
    variants: {
      info: ComponentVariant;
      success: ComponentVariant;
      warning: ComponentVariant;
      error: ComponentVariant;
    };
  };
}

interface ComponentVariant {
  background: string;
  foreground: string;
  border?: string;
  shadow?: string;
  hover?: {
    background?: string;
    foreground?: string;
    border?: string;
    shadow?: string;
  };
  active?: {
    background?: string;
    transform?: string;
  };
  focus?: {
    ring?: string;
    ringOffset?: string;
  };
}

interface SizeVariant {
  padding: string;
  fontSize: string;
  height: string;
  borderRadius: string;
}
```

---

### 14. Usage Guidelines

```typescript
interface UsageGuidelines {
  // Do's and Don'ts
  colorUsage: {
    do: string[];
    dont: string[];
  };
  
  typographyUsage: {
    do: string[];
    dont: string[];
  };

  spacingUsage: {
    do: string[];
    dont: string[];
  };

  // Accessibility notes
  accessibility: {
    colorContrast: string;
    focusStates: string;
    motionPreferences: string;
    textSizing: string;
  };

  // Dark mode notes
  darkMode: {
    colorAdjustments: string;
    imageHandling: string;
    shadowAdjustments: string;
  };
}
```

---

## Part 5: UI Layout Specifications

### Key Requirements

1. **Each section on its own row** — no split/cramped layouts
2. **Generous spacing between sections** — minimum 64px, ideally 96px
3. **Dark mode must work completely** — all elements, not just some

### Section Layout Pattern

```tsx
// Each output section should follow this pattern
<section className="py-16 md:py-24 border-b border-card-border">
  {/* Section header */}
  <div className="mb-8 md:mb-12">
    <h2 className="text-2xl md:text-3xl font-bold mb-2">{sectionTitle}</h2>
    <p className="text-muted max-w-2xl">{sectionDescription}</p>
  </div>
  
  {/* Section content - FULL WIDTH, NOT SPLIT */}
  <div className="space-y-8">
    {/* Content goes here */}
  </div>
</section>
```

### Dark Mode Fixes Required

```css
/* Ensure ALL card backgrounds respect dark mode */
.card,
[data-slot="card"],
.bg-card-bg {
  background-color: var(--card-bg);
  color: var(--foreground);
  border-color: var(--card-border);
}

/* Fix link/button in dark mode */
.link-button,
.external-link {
  color: var(--accent);
  background-color: var(--card-bg);
  border-color: var(--card-border);
}

/* Ensure hover states work */
.link-button:hover {
  background-color: var(--accent);
  color: var(--background);
}
```

### CSS Variables (Complete)

```css
:root {
  /* Light mode defaults */
  --background: #ffffff;
  --foreground: #0a0a0a;
  --card-bg: #f5f5f5;
  --card-border: #e5e5e5;
  --muted: #737373;
  --muted-foreground: #525252;
  --accent: #00ff88;
  --accent-foreground: #0a0a0a;
  /* ... all other variables */
}

.dark,
[data-theme="dark"] {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --card-bg: #171717;
  --card-border: #262626;
  --muted: #a3a3a3;
  --muted-foreground: #d4d4d4;
  --accent: #00ff88;
  --accent-foreground: #0a0a0a;
  /* ... all other variables */
}
```

---

## Part 6: Zip Export Feature

### Overview

Users should be able to download **one zip file** containing every possible export, organized into a clean folder architecture. This replaces the need to download individual files.

### Folder Architecture

```
{company-name}-brand-system/
│
├── README.md                           # Quick start guide
├── brand-overview.pdf                  # Visual summary (if generated)
│
├── tokens/
│   ├── json/
│   │   ├── tokens.json                 # Complete token file
│   │   ├── colors.json                 # Colors only
│   │   ├── typography.json             # Typography only
│   │   ├── spacing.json                # Spacing only
│   │   ├── shadows.json                # Shadows only
│   │   ├── animation.json              # Animation only
│   │   └── components.json             # Component styles
│   │
│   ├── css/
│   │   ├── variables.css               # CSS custom properties (all)
│   │   ├── variables-light.css         # Light mode only
│   │   ├── variables-dark.css          # Dark mode only
│   │   └── utilities.css               # Utility classes
│   │
│   ├── scss/
│   │   ├── _variables.scss             # SCSS variables
│   │   ├── _mixins.scss                # Typography/spacing mixins
│   │   └── _tokens.scss                # All tokens as SCSS
│   │
│   └── tailwind/
│       ├── tailwind.config.js          # Tailwind config extension
│       └── tailwind-preset.js          # As a preset
│
├── design-system/
│   ├── colors/
│   │   ├── color-palette.png           # Visual color swatches
│   │   ├── color-usage.md              # Color usage guidelines
│   │   └── color-accessibility.md      # Contrast ratios
│   │
│   ├── typography/
│   │   ├── type-scale.png              # Visual type scale
│   │   ├── type-specimens.md           # Full specimens with examples
│   │   └── font-files/                 # Or links to Google Fonts
│   │       └── README.md               # Font installation instructions
│   │
│   ├── spacing/
│   │   ├── spacing-scale.png           # Visual spacing scale
│   │   └── spacing-usage.md            # When to use what
│   │
│   ├── components/
│   │   ├── buttons.md                  # Button variants + code
│   │   ├── inputs.md                   # Input variants + code
│   │   ├── cards.md                    # Card variants + code
│   │   └── ...                         # Other components
│   │
│   ├── animation/
│   │   ├── animation-tokens.md         # Durations, easings
│   │   ├── keyframes.css               # CSS keyframe definitions
│   │   └── motion-guidelines.md        # When/how to animate
│   │
│   ├── data-viz/
│   │   ├── chart-colors.png            # Chart color palettes
│   │   ├── chart-styles.md             # Chart styling guide
│   │   └── chart-config.json           # Config for chart libraries
│   │
│   ├── iconography/
│   │   └── icon-guidelines.md          # Style, sizing, usage
│   │
│   └── imagery/
│       └── imagery-guidelines.md       # Photo/illustration direction
│
├── voice-and-tone/
│   ├── voice-guidelines.md             # Core voice attributes
│   ├── writing-examples.md             # Headlines, CTAs, copy
│   └── vocabulary.md                   # Preferred/avoided words
│
├── channels/                           # Multi-channel assets
│   ├── web/
│   │   ├── README.md                   # Web implementation guide
│   │   └── ...                         # Web-specific assets
│   │
│   ├── social/
│   │   ├── README.md                   # Social guidelines
│   │   ├── templates/                  # Post templates (if any)
│   │   └── sizing-guide.md             # Platform dimensions
│   │
│   ├── email/
│   │   ├── README.md                   # Email guidelines
│   │   └── email-tokens.json           # Email-safe values
│   │
│   ├── presentation/
│   │   ├── README.md                   # Slide guidelines
│   │   └── color-palette.pptx          # PowerPoint theme (if possible)
│   │
│   └── print/
│       ├── README.md                   # Print guidelines
│       ├── cmyk-colors.json            # CMYK conversions
│       └── bleed-margins.md            # Print specifications
│
└── figma/                              # Figma-ready exports
    ├── README.md                       # How to import to Figma
    ├── figma-tokens.json               # Figma Tokens plugin format
    └── style-dictionary.json           # Style Dictionary config
```

### README.md Template

The root README should include:

```markdown
# {Company Name} Brand System

Generated by Nertia Brand Generator on {date}

## Quick Start

### For Developers

1. **CSS Variables**: Copy `tokens/css/variables.css` into your project
2. **Tailwind**: Extend your config with `tokens/tailwind/tailwind.config.js`
3. **JSON**: Import `tokens/json/tokens.json` for programmatic access

### For Designers

1. **Figma**: Import `figma/figma-tokens.json` using the Figma Tokens plugin
2. **Reference**: See `design-system/` folder for visual guidelines

### Brand Guidelines

- Colors: `design-system/colors/`
- Typography: `design-system/typography/`
- Voice & Tone: `voice-and-tone/`

## Token Formats

| Format | Location | Use Case |
|--------|----------|----------|
| JSON | `tokens/json/` | JavaScript, frameworks |
| CSS | `tokens/css/` | Any web project |
| SCSS | `tokens/scss/` | Sass/SCSS projects |
| Tailwind | `tokens/tailwind/` | Tailwind CSS projects |
| Figma | `figma/` | Design tools |

## Support

Generated by [Nertia](https://nertia.ai) — Identity in Motion
```

### Implementation

```typescript
// Use JSZip for client-side zip generation
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ExportOptions {
  brandSystem: BrandSystemV3;
  companyName: string;
  includeChannels: boolean;
  includeFigma: boolean;
}

async function generateBrandZip(options: ExportOptions): Promise<void> {
  const { brandSystem, companyName } = options;
  const zip = new JSZip();
  
  const folderName = `${slugify(companyName)}-brand-system`;
  const root = zip.folder(folderName)!;
  
  // README
  root.file('README.md', generateReadme(brandSystem, companyName));
  
  // Tokens folder
  const tokens = root.folder('tokens')!;
  
  // JSON tokens
  const jsonFolder = tokens.folder('json')!;
  jsonFolder.file('tokens.json', JSON.stringify(brandSystem, null, 2));
  jsonFolder.file('colors.json', JSON.stringify(brandSystem.colors, null, 2));
  jsonFolder.file('typography.json', JSON.stringify(brandSystem.typography, null, 2));
  // ... other JSON files
  
  // CSS tokens
  const cssFolder = tokens.folder('css')!;
  cssFolder.file('variables.css', generateCSSVariables(brandSystem));
  cssFolder.file('variables-light.css', generateCSSVariables(brandSystem, 'light'));
  cssFolder.file('variables-dark.css', generateCSSVariables(brandSystem, 'dark'));
  
  // SCSS tokens
  const scssFolder = tokens.folder('scss')!;
  scssFolder.file('_variables.scss', generateSCSSVariables(brandSystem));
  scssFolder.file('_mixins.scss', generateSCSSMixins(brandSystem));
  
  // Tailwind config
  const tailwindFolder = tokens.folder('tailwind')!;
  tailwindFolder.file('tailwind.config.js', generateTailwindConfig(brandSystem));
  
  // Design system documentation
  const designSystem = root.folder('design-system')!;
  // ... add all design system files
  
  // Voice and tone
  const voice = root.folder('voice-and-tone')!;
  voice.file('voice-guidelines.md', generateVoiceGuidelines(brandSystem.voiceAndTone));
  voice.file('writing-examples.md', generateWritingExamples(brandSystem.voiceAndTone));
  
  // Channels (if multi-channel is included)
  if (options.includeChannels) {
    const channels = root.folder('channels')!;
    // ... add channel-specific folders and files
  }
  
  // Figma exports
  if (options.includeFigma) {
    const figma = root.folder('figma')!;
    figma.file('figma-tokens.json', generateFigmaTokens(brandSystem));
    figma.file('README.md', generateFigmaReadme());
  }
  
  // Generate and download
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${folderName}.zip`);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
```

### UI Component

```tsx
// components/ExportButton.tsx

interface ExportButtonProps {
  brandSystem: BrandSystemV3;
  companyName: string;
}

export function ExportButton({ brandSystem, companyName }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  
  const handleExport = async () => {
    setExporting(true);
    try {
      await generateBrandZip({
        brandSystem,
        companyName,
        includeChannels: true,
        includeFigma: true,
      });
    } finally {
      setExporting(false);
    }
  };
  
  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="flex items-center gap-2 px-6 py-3 bg-accent text-background font-medium rounded-md hover:bg-accent-hover disabled:opacity-50 transition-colors"
    >
      {exporting ? (
        <>
          <Spinner className="w-4 h-4" />
          Preparing download...
        </>
      ) : (
        <>
          <DownloadIcon className="w-4 h-4" />
          Download Complete Brand System
        </>
      )}
    </button>
  );
}
```

### Dependencies

```bash
npm install jszip file-saver
npm install -D @types/file-saver
```

---

## Part 7: Implementation Phases

### Phase 0: Preserve What's Working
- [ ] **Do NOT remove multi-channel output** — it's working
- [ ] Document current multi-channel functionality
- [ ] Ensure new changes don't break existing features

### Phase 1: Zip Export Feature (New)
- [ ] Implement single zip download with complete folder architecture
- [ ] Include all token formats (JSON, CSS, SCSS, Tailwind)
- [ ] Include all channel-specific assets
- [ ] Generate README with usage instructions

### Phase 2: Input System Rebuild
- [ ] Create new input schema with all sections
- [ ] Build form UI with logical grouping
- [ ] Implement pre-population logic (industry → defaults)
- [ ] Add outlier mode toggle

### Phase 3: Decision Logic Layer
- [ ] Create rule files for industry defaults
- [ ] Create rule files for audience defaults
- [ ] Create rule files for positioning defaults
- [ ] Implement derivation functions
- [ ] Add outlier randomizer

### Phase 4: Complete Output Schema
- [ ] Implement full ColorSystem
- [ ] Implement full TypographySystem with examples
- [ ] Add AnimationSystem (was missing)
- [ ] Add DataVizSystem (was missing)
- [ ] Add IconographySystem (was missing)
- [ ] Add ImagerySystem (was missing)
- [ ] Add all other sections

### Phase 5: UI/Display Rebuild
- [ ] Single-row section layout
- [ ] Generous spacing (96px between sections)
- [ ] Complete dark mode support
- [ ] Fix all color variables
- [ ] Add section navigation

### Phase 6: Claude Prompt Engineering
- [ ] Update system prompt with full schema
- [ ] Include decision rules in prompt
- [ ] Add examples for each section
- [ ] Test output completeness
- [ ] Iterate on quality

---

## Part 8: File Structure

```
src/
├── app/
│   ├── generator/
│   │   └── page.tsx              # Main generator page
│   └── api/
│       └── generate-tokens/
│           └── route.ts          # Claude API endpoint
├── components/
│   ├── generator/
│   │   ├── InputForm.tsx         # Full input form
│   │   ├── InputSection.tsx      # Reusable section wrapper
│   │   └── OutlierToggle.tsx     # Outlier mode control
│   ├── output/
│   │   ├── DesignSystemView.tsx  # Main output display
│   │   ├── ColorSection.tsx      # Color system display
│   │   ├── TypographySection.tsx # Typography display
│   │   ├── AnimationSection.tsx  # Animation display
│   │   ├── DataVizSection.tsx    # Data viz display
│   │   └── ...                   # Other sections
│   ├── export/
│   │   └── ExportButton.tsx      # Single zip download button
│   └── ui/
│       └── ...                   # shadcn components
├── lib/
│   ├── decision-rules/
│   │   ├── industry-rules.ts     # Industry → defaults
│   │   ├── audience-rules.ts     # Audience → defaults
│   │   ├── positioning-rules.ts  # Positioning → defaults
│   │   └── outlier-logic.ts      # Outlier randomizer
│   ├── export/
│   │   ├── generate-zip.ts       # Main zip generation logic
│   │   ├── generate-css.ts       # CSS variable generation
│   │   ├── generate-scss.ts      # SCSS generation
│   │   ├── generate-tailwind.ts  # Tailwind config generation
│   │   ├── generate-figma.ts     # Figma tokens generation
│   │   └── generate-readme.ts    # README generation
│   ├── derivation.ts             # Input → derived values
│   └── prompt-builder.ts         # Build Claude prompt
├── types/
│   ├── inputs.ts                 # Input types
│   ├── outputs.ts                # Full output schema
│   └── rules.ts                  # Rule types
└── styles/
    └── globals.css               # CSS variables + dark mode
```

---

## Summary: Key Differences from v2

| Aspect | v2 (Current) | v3 (New) |
|--------|-------------|----------|
| **Missing sections** | Animation, Data Viz, Icons, Imagery | All sections complete |
| **Typography depth** | Font name only | Full scale with context & examples |
| **Layout** | Split rows, cramped | Single-row sections, 96px spacing |
| **Dark mode** | Buggy, incomplete | Fully working |
| **Input logic** | Disconnected | Industry/audience drives defaults |
| **Decision framework** | Random generation | Rule-based with derivation |
| **Outlier support** | None | Intentional rule-breaking mode |
| **The moat** | Generic output | Strategic logic algorithm |
| **Multi-channel** | Working | **PRESERVE** — don't remove |
| **Export** | Individual downloads | Single zip with full folder structure |

---

## Important: Preserve Multi-Channel Output

The multi-channel output functionality from v2 is working well and should be **preserved**. Do not remove or rebuild it.

The focus of v3 is:
1. Fix the design system completeness (missing sections)
2. Implement decision logic framework
3. Fix UI/layout issues
4. Keep multi-channel working as-is

Multi-channel enhancements can come later, but don't break what's already working.

---

*Created: January 2026*
*For: Nertia Brand Generator v3*
*Focus: Design system completeness + decision logic (preserve multi-channel)*
