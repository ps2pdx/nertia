// Brand System Token Schema
// Matches the Design System page structure on nertia.ai
// Colors, Typography, Icons, Components, Motion, Tables, Data Viz, Spacing, Logo, Grid, Voice & Tone

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

// Generation result with tracking ID
export interface GenerationResult extends BrandSystem {
  _generationId?: string;
}
