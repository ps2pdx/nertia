# BrandSystem v2.0 Schema Instructions

## Overview
Expand the BrandSystem schema to create comprehensive brand styleguides (inspired by Vantage Compute), including visual tokens, UI components, grid system, icons, motion, imagery guidelines, and brand voice.

## Reference
See Vantage Compute Brand Styleguide for structure inspiration: https://banner-brick-87973990.figma.site/

## Files to Modify
| File | Changes |
|------|---------|
| `src/types/brand-system.ts` | Add all new interfaces/types |
| `src/utils/tokens-to-css.ts` | Export new tokens as CSS variables |
| `src/components/ExportOptions.tsx` | Update Tailwind config generation |
| `src/utils/prompt-builder.ts` | Update AI prompt with new schema |
| `src/app/api/generate-tokens/route.ts` | Update demo function with sample values |

---

## Schema Sections (9 Total)

### 1. Colors (Extended)
```typescript
colors: {
  // Core (existing)
  background: { light, dark }
  foreground: { light, dark }
  accent: { light, dark }
  accentHover: { light, dark }
  muted: { light, dark }
  success: { light, dark }
  warning: { light, dark }
  error: { light, dark }

  // Interface Colors (NEW)
  surface: {
    default: { light, dark }    // Card backgrounds
    elevated: { light, dark }   // Modals, dropdowns
    sunken: { light, dark }     // Input wells
  }
  border: {
    default: { light, dark }
    subtle: { light, dark }     // Light separators
    strong: { light, dark }     // Emphasized
    focus: { light, dark }      // Focus rings
  }
  overlay: { light, dark }      // Modal backdrops (rgba)

  // Color Usage Ratios (NEW)
  usageRatios: {
    background: 60  // % of interface
    surface: 30
    accent: 10
  }
}
```

### 2. Typography
```typescript
typography: {
  fontFamily: {
    display: string    // For H1-H3 headings (e.g., "Satoshi")
    body: string       // For body text, labels, UI (e.g., "JetBrains Mono")
    sans: string       // Fallback
    mono: string       // Code blocks
  }

  // Type Scale with full specs
  scale: {
    h1: { size: "48px", weight: 500, lineHeight: 1.15, font: "display" }
    h2: { size: "36px", weight: 500, lineHeight: 1.25, font: "display" }
    h3: { size: "30px", weight: 500, lineHeight: 1.3, font: "display" }
    h4: { size: "24px", weight: 400, lineHeight: 1.4, font: "body" }
    body: { size: "18px", weight: 400, lineHeight: 1.5, font: "body" }
    label: { size: "16px", weight: 400, lineHeight: 1.5, font: "body" }
    small: { size: "14px", weight: 400, lineHeight: 1.5, font: "body" }
    micro: { size: "12px", weight: 500, lineHeight: 1.4, letterSpacing: "0.05em", textTransform: "uppercase" }
  }

  letterSpacing: { tight, normal, wide, wider, widest }
  fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 }
}
```

### 3. Grid System
```typescript
grid: {
  desktop: {
    columns: 12
    gutter: "16px"
    maxWidth: "1280px"
    margin: "32px"
  }
  mobile: {
    columns: 4
    gutter: "12px"
    margin: "16px"
  }
}

spacing: {
  // Named tokens
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  '2xl': "32px"
  '3xl': "40px"
  '4xl': "64px"

  // Semantic spacing
  semantic: {
    section: { paddingX: "32px", paddingY: "64px" }
    card: { padding: "24px" }
    component: { gap: "16px" }
    text: { gap: "8px" }
    inline: { gap: "4px" }
    container: { maxWidth: "1280px", paddingX: "24px" }
  }
}
```

### 4. Icons
```typescript
icons: {
  sizes: {
    small: "16px"
    default: "24px"
    large: "32px"
    hero: "48px"
  }
  strokeWeight: "1.5px"
  boundingBox: "24px"
  strokeCaps: "rounded"

  // Suggested icon categories based on brand
  categories: string[]  // e.g., ["compute", "storage", "network", "security"]
}
```

### 5. UI Components
```typescript
components: {
  button: {
    primary: { background, foreground, backgroundHover, border }
    secondary: { background, foreground, backgroundHover, border }
    outline: { background, foreground, backgroundHover, border }
    disabled: { background, foreground, border }
    paddingX: "24px"
    paddingY: "12px"
    fontSize: "14px"
    fontWeight: 500
    borderRadius: string
    letterSpacing: "0.025em"
  }

  card: {
    variants: {
      feature: { background, border, padding }
      stat: { background, border, padding }
      image: { background, border, padding }
    }
    borderRadius: string
  }

  input: {
    background: { light, dark }
    border: { light, dark }
    borderFocus: { light, dark }
    placeholder: { light, dark }
    paddingX: "16px"
    paddingY: "12px"
    fontSize: "16px"
    borderRadius: string
  }

  alert: {
    variants: {
      info: { background, border, icon }
      success: { background, border, icon }
      warning: { background, border, icon }
      error: { background, border, icon }
    }
    padding: "24px"
    borderLeftWidth: "4px"
  }

  table: {
    headerBackground: { light, dark }
    rowStripe: { light, dark }
    rowHover: { light, dark }
    borderColor: { light, dark }
    cellPaddingX: "16px"
    cellPaddingY: "12px"
  }

  navigation: {
    background: { light, dark }
    linkColor: { light, dark }
    linkHover: { light, dark }
    height: "64px"
  }
}
```

### 6. Motion & Interaction
```typescript
motion: {
  duration: {
    instant: "100ms"   // Hover states, toggles
    fast: "200ms"      // Dropdowns, tooltips
    base: "300ms"      // Modals, drawers
    slow: "500ms"      // Page transitions
  }

  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)"
    in: "cubic-bezier(0.4, 0, 1, 1)"
    out: "cubic-bezier(0, 0, 0.2, 1)"
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)"
  }

  interactions: {
    hover: { scale: 1.05, duration: "200ms" }
    fade: { opacity: [0, 1], duration: "300ms" }
    slide: { transform: "translateX", duration: "200ms" }
  }

  principles: string[]  // e.g., ["Performance first", "Purposeful motion"]
}
```

### 7. Imagery Guidelines
```typescript
imagery: {
  styles: string[]  // e.g., ["data centers", "hardware close-ups", "abstract tech"]

  guidelines: {
    do: string[]    // e.g., ["Use symmetrical compositions", "Feature technical details"]
    dont: string[]  // e.g., ["Use stock photos of people", "Over-saturate colors"]
  }

  photoTreatment: {
    colorGrading: string  // e.g., "violet tint"
    contrast: string      // e.g., "high"
    style: string         // e.g., "dramatic lighting"
  }
}
```

### 8. Brand Voice
```typescript
voiceAndTone: {
  // Voice attributes with descriptions
  attributes: {
    [key: string]: {
      name: string        // e.g., "Technical"
      description: string // e.g., "Precise terminology that resonates with engineers"
      example: string     // e.g., "Petaflop-scale compute resources"
    }
  }

  // Writing guidelines
  guidelines: {
    do: string[]    // e.g., ["Use active voice", "Lead with benefits", "Include specific metrics"]
    dont: string[]  // e.g., ["Use passive constructions", "Be vague", "Overuse jargon"]
  }

  // Example messages by context
  examples: {
    hero: { headline: string, subheadline: string }
    feature: { headline: string, description: string }
    cta: string[]
    stats: { value: string, label: string }[]
  }

  // Core message / positioning
  coreMessage: string

  // Personality adjectives (existing, keep)
  personality: string[]
}
```

### 9. Metadata & Utility
```typescript
metadata: {
  name: string
  version: "2.0.0"
  generatedAt: string
}

zIndex: {
  base: 0
  raised: 10
  dropdown: 20
  sticky: 30
  fixed: 40
  modal: 50
  popover: 60
  tooltip: 70
}

breakpoints: {
  sm: "640px"
  md: "768px"
  lg: "1024px"
  xl: "1280px"
  '2xl': "1536px"
}

borders: {
  radius: {
    none: "0"
    sm: "2px"
    md: "4px"
    lg: "8px"
    xl: "12px"
    '2xl': "16px"
    full: "9999px"
  }
  width: {
    thin: "1px"
    medium: "2px"
    thick: "4px"
  }
}

shadows: {
  sm: string
  md: string
  lg: string
  xl: string
}
```

---

## Implementation Notes

1. **Backward Compatibility**: All new top-level sections should be optional (`?`)
2. **Version**: Bump schema version to "2.0.0" in metadata
3. **CSS Variables**: Follow pattern `--{category}-{name}` (e.g., `--surface-elevated`, `--btn-primary-bg`)
4. **Demo Function**: Update `generate-tokens/route.ts` with comprehensive sample values
5. **AI Prompt**: Update prompt-builder to request all 9 sections with examples

## Shareable Brand System Page

Add a new route to view generated brand systems as standalone, shareable pages (like Vantage Compute styleguide).

### New Files
| File | Purpose |
|------|---------|
| `src/app/brand/[id]/page.tsx` | Public shareable brand system page |
| `src/components/BrandSystemView.tsx` | Renders full brand system (9 sections) |

### Implementation
1. **Route**: `/brand/[generationId]` - loads brand system from Firebase by ID
2. **Layout**: Similar to Vantage - sticky nav with section links, full-page scrolling content
3. **Sections**: Display all 9 schema sections with visual examples
4. **No auth required**: Public shareable URL for clients/stakeholders

### Generator Page Updates
Add to `src/app/generator/page.tsx` result section:
```tsx
// After "Edit Tokens" button, add:
<a
  href={`/brand/${result._generationId}`}
  target="_blank"
  rel="noopener noreferrer"
  className="px-3 py-1 text-sm rounded-md border border-[var(--card-border)] hover:border-[var(--accent)] transition-colors flex items-center gap-2"
>
  <ExternalLinkIcon className="w-4 h-4" />
  Open Full View
</a>
```

### Firebase Read
```typescript
// In /brand/[id]/page.tsx
const generation = await get(ref(database, `generations/${id}`));
const data = generation.val();
// Render BrandSystemView with data.tokens
```

---

## Testing
1. Run `npm run dev` and go to `/generator`
2. Generate tokens for a test brand
3. Verify JSON export includes all 9 sections
4. Test CSS and Tailwind exports include all new variables
5. Verify backward compatibility with existing generations
6. Click "Open Full View" to test shareable page at `/brand/[id]`
7. Share URL with someone not logged in - should still work (public)
