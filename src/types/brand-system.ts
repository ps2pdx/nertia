// Brand System Token Schema v2.0
// Comprehensive brand styleguide structure inspired by Vantage Compute
// 9 sections: Colors, Typography, Grid, Icons, Components, Motion, Imagery, Voice, Utilities

// ============================================================================
// Helper Types
// ============================================================================

export interface ColorValue {
  light: string;
  dark: string;
}

export interface TypeScaleEntry {
  size: string;
  weight: number;
  lineHeight: number;
  font: 'display' | 'body' | 'mono';
  letterSpacing?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
}

// ============================================================================
// Main Brand System Interface
// ============================================================================

export interface BrandSystem {
  // ---- Metadata ----
  metadata: {
    name: string;
    generatedAt: string;
    version: string; // "2.0.0"
  };

  // ---- 1. Colors ----
  colors: {
    // Core colors (existing, required)
    background: ColorValue;
    foreground: ColorValue;
    muted: ColorValue;
    accent: ColorValue;
    accentHover: ColorValue;
    cardBackground: ColorValue;
    cardBorder: ColorValue;
    success: ColorValue;
    warning: ColorValue;
    error: ColorValue;

    // Interface colors (v2, optional)
    surface?: {
      default: ColorValue;
      elevated: ColorValue;
      sunken: ColorValue;
    };
    border?: {
      default: ColorValue;
      subtle: ColorValue;
      strong: ColorValue;
      focus: ColorValue;
    };
    overlay?: ColorValue; // rgba for modal backdrops

    // Color usage ratios (v2, optional)
    usageRatios?: {
      background: number; // % of interface (e.g., 60)
      surface: number;    // % (e.g., 30)
      accent: number;     // % (e.g., 10)
    };
  };

  // ---- 2. Typography ----
  typography: {
    fontFamily: {
      sans: string;
      mono: string;
      display?: string; // For H1-H3 headings (v2)
      body?: string;    // For body text, labels (v2)
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
      '5xl'?: string; // v2
      '6xl'?: string; // v2
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
    letterSpacing?: {
      tight: string;
      normal: string;
      wide: string;
      wider: string;
      widest: string;
    };
    // Type scale with full specs (v2, optional)
    scale?: {
      h1: TypeScaleEntry;
      h2: TypeScaleEntry;
      h3: TypeScaleEntry;
      h4: TypeScaleEntry;
      body: TypeScaleEntry;
      label: TypeScaleEntry;
      small: TypeScaleEntry;
      micro: TypeScaleEntry;
    };
  };

  // ---- 3. Grid System (v2, optional) ----
  grid?: {
    desktop: {
      columns: number;
      gutter: string;
      maxWidth: string;
      margin: string;
    };
    mobile: {
      columns: number;
      gutter: string;
      margin: string;
    };
  };

  // ---- 4. Spacing ----
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
    xs?: string;  // v2 named tokens
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
    '3xl'?: string;
    '4xl'?: string;
    // Semantic spacing (v2, optional)
    semantic?: {
      section: { paddingX: string; paddingY: string };
      card: { padding: string };
      component: { gap: string };
      text: { gap: string };
      inline: { gap: string };
      container: { maxWidth: string; paddingX: string };
    };
  };

  // ---- 5. Icons (v2, optional) ----
  icons?: {
    sizes: {
      small: string;
      default: string;
      large: string;
      hero: string;
    };
    strokeWeight: string;
    boundingBox: string;
    strokeCaps: 'rounded' | 'square' | 'butt';
    categories?: string[]; // Suggested icon categories based on brand
  };

  // ---- 6. UI Components (v2, optional) ----
  components?: {
    button: {
      primary: {
        background: ColorValue;
        foreground: ColorValue;
        backgroundHover: ColorValue;
        border: ColorValue;
      };
      secondary: {
        background: ColorValue;
        foreground: ColorValue;
        backgroundHover: ColorValue;
        border: ColorValue;
      };
      outline?: {
        background: ColorValue;
        foreground: ColorValue;
        backgroundHover: ColorValue;
        border: ColorValue;
      };
      disabled?: {
        background: ColorValue;
        foreground: ColorValue;
        border: ColorValue;
      };
      paddingX: string;
      paddingY: string;
      fontSize: string;
      fontWeight: number;
      borderRadius: string;
      letterSpacing?: string;
    };
    card?: {
      variants: {
        feature: { background: ColorValue; border: ColorValue; padding: string };
        stat: { background: ColorValue; border: ColorValue; padding: string };
        image: { background: ColorValue; border: ColorValue; padding: string };
      };
      borderRadius: string;
    };
    input?: {
      background: ColorValue;
      border: ColorValue;
      borderFocus: ColorValue;
      placeholder: ColorValue;
      paddingX: string;
      paddingY: string;
      fontSize: string;
      borderRadius: string;
    };
    alert?: {
      variants: {
        info: { background: ColorValue; border: ColorValue; icon: string };
        success: { background: ColorValue; border: ColorValue; icon: string };
        warning: { background: ColorValue; border: ColorValue; icon: string };
        error: { background: ColorValue; border: ColorValue; icon: string };
      };
      padding: string;
      borderLeftWidth: string;
    };
    table?: {
      headerBackground: ColorValue;
      rowStripe: ColorValue;
      rowHover: ColorValue;
      borderColor: ColorValue;
      cellPaddingX: string;
      cellPaddingY: string;
    };
    navigation?: {
      background: ColorValue;
      linkColor: ColorValue;
      linkHover: ColorValue;
      height: string;
    };
  };

  // ---- 7. Borders ----
  borders: {
    radius: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      xl?: string;   // v2
      '2xl'?: string; // v2
      full: string;
    };
    width: {
      thin: string;
      medium: string;
      thick: string;
    };
  };

  // ---- 8. Shadows ----
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  // ---- 9. Motion & Interaction ----
  motion: {
    duration: {
      instant?: string; // v2 - hover states, toggles
      fast: string;
      normal?: string;  // v2 renamed from 'normal' to 'base' in some places
      base?: string;    // v2
      slow: string;
    };
    easing: {
      default: string;
      in: string;
      out: string;
      inOut: string;
    };
    // v2 additions
    interactions?: {
      hover?: { scale: number; duration: string };
      fade?: { opacity: [number, number]; duration: string };
      slide?: { transform: string; duration: string };
    };
    principles?: string[]; // e.g., ["Performance first", "Purposeful motion"]
  };

  // ---- 10. Imagery Guidelines (v2, optional) ----
  imagery?: {
    styles: string[]; // e.g., ["data centers", "hardware close-ups", "abstract tech"]
    guidelines: {
      do: string[];   // e.g., ["Use symmetrical compositions", "Feature technical details"]
      dont: string[]; // e.g., ["Use stock photos of people", "Over-saturate colors"]
    };
    photoTreatment: {
      colorGrading: string; // e.g., "violet tint"
      contrast: string;     // e.g., "high"
      style: string;        // e.g., "dramatic lighting"
    };
  };

  // ---- 11. Voice & Tone ----
  voiceAndTone: {
    personality: string[];
    writingStyle: string;
    examples: {
      headlines: string[];
      cta: string[];
      descriptions: string[];
    };
    // v2 additions
    attributes?: {
      [key: string]: {
        name: string;
        description: string;
        example: string;
      };
    };
    guidelines?: {
      do: string[];
      dont: string[];
    };
    coreMessage?: string;
  };

  // ---- 12. Utility Tokens (v2, optional) ----
  zIndex?: {
    base: number;
    raised: number;
    dropdown: number;
    sticky: number;
    fixed: number;
    modal: number;
    popover: number;
    tooltip: number;
  };

  breakpoints?: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

// ============================================================================
// Discovery Inputs (unchanged)
// ============================================================================

export interface DiscoveryInputs {
  companyName: string;
  industry: string;
  targetAudience: string;
  personalityAdjectives: string[]; // 3-5 words like "bold", "trustworthy", "innovative"
  colorMood: 'warm' | 'cool' | 'neutral';
  colorBrightness: 'vibrant' | 'muted' | 'dark';
  typographyStyle: 'modern' | 'classic' | 'playful' | 'technical';
  densityPreference: 'spacious' | 'balanced' | 'compact';
  existingBrandColor?: string; // Optional hex if they have one
}

// ============================================================================
// Generation Result (unchanged)
// ============================================================================

export interface GenerationResult extends BrandSystem {
  _generationId?: string;
}
