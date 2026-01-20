import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { BrandSystem, DiscoveryInputs } from '@/types/brand-system';
import { database } from '@/lib/firebase';
import { ref, push, set } from 'firebase/database';
import { buildPrompt } from '@/utils/prompt-builder';

const PROMPT_VERSION = 'v2.0';

// Demo mode - returns a realistic sample brand system
// Set USE_DEMO_MODE=false in .env.local when you have API credits
const USE_DEMO_MODE = process.env.USE_DEMO_MODE !== 'false';

function generateDemoBrandSystem(inputs: DiscoveryInputs): BrandSystem {
  // Generate colors based on mood
  const colorPalettes = {
    warm: {
      accent: { light: '#E85D04', dark: '#F48C06' },
      accentHover: { light: '#DC2F02', dark: '#E85D04' },
    },
    cool: {
      accent: { light: '#0077B6', dark: '#00B4D8' },
      accentHover: { light: '#023E8A', dark: '#0077B6' },
    },
    neutral: {
      accent: { light: '#6C757D', dark: '#ADB5BD' },
      accentHover: { light: '#495057', dark: '#6C757D' },
    },
  };

  const palette = colorPalettes[inputs.colorMood];

  // Generate typography based on style
  const fontFamilies: Record<string, { display: string; body: string; sans: string; mono: string }> = {
    modern: { display: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif', sans: 'Inter, system-ui, sans-serif', mono: 'JetBrains Mono, monospace' },
    classic: { display: 'Playfair Display, Georgia, serif', body: 'Merriweather, Georgia, serif', sans: 'Georgia, serif', mono: 'Courier New, monospace' },
    playful: { display: 'Fredoka One, sans-serif', body: 'Poppins, sans-serif', sans: 'Poppins, sans-serif', mono: 'Space Mono, monospace' },
    technical: { display: 'IBM Plex Sans, sans-serif', body: 'IBM Plex Sans, sans-serif', sans: 'IBM Plex Sans, sans-serif', mono: 'IBM Plex Mono, monospace' },
  };

  const fonts = fontFamilies[inputs.typographyStyle] || fontFamilies.modern;

  return {
    metadata: {
      name: inputs.companyName,
      generatedAt: new Date().toISOString(),
      version: '2.0.0',
    },
    colors: {
      background: { light: '#FFFFFF', dark: '#0A0A0A' },
      foreground: { light: '#171717', dark: '#EDEDED' },
      muted: { light: '#6B7280', dark: '#9CA3AF' },
      accent: palette.accent,
      accentHover: palette.accentHover,
      cardBackground: { light: '#F9FAFB', dark: '#1A1A1A' },
      cardBorder: { light: '#E5E7EB', dark: '#2D2D2D' },
      success: { light: '#10B981', dark: '#34D399' },
      warning: { light: '#F59E0B', dark: '#FBBF24' },
      error: { light: '#EF4444', dark: '#F87171' },
      // v2: Extended colors
      surface: {
        default: { light: '#FFFFFF', dark: '#121212' },
        elevated: { light: '#FFFFFF', dark: '#1E1E1E' },
        sunken: { light: '#F3F4F6', dark: '#0A0A0A' },
      },
      border: {
        default: { light: '#E5E7EB', dark: '#2D2D2D' },
        subtle: { light: '#F3F4F6', dark: '#1F1F1F' },
        strong: { light: '#D1D5DB', dark: '#404040' },
        focus: { light: palette.accent.light, dark: palette.accent.dark },
      },
      overlay: { light: 'rgba(0, 0, 0, 0.5)', dark: 'rgba(0, 0, 0, 0.7)' },
      usageRatios: { background: 60, surface: 30, accent: 10 },
    },
    typography: {
      fontFamily: fonts,
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
      // v2: Letter spacing
      letterSpacing: {
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      // v2: Type scale
      scale: {
        h1: { size: '3rem', weight: 700, lineHeight: 1.15, font: 'display' as const },
        h2: { size: '2.25rem', weight: 600, lineHeight: 1.25, font: 'display' as const },
        h3: { size: '1.875rem', weight: 600, lineHeight: 1.3, font: 'display' as const },
        h4: { size: '1.5rem', weight: 500, lineHeight: 1.4, font: 'body' as const },
        body: { size: '1rem', weight: 400, lineHeight: 1.5, font: 'body' as const },
        label: { size: '0.875rem', weight: 500, lineHeight: 1.5, font: 'body' as const },
        small: { size: '0.75rem', weight: 400, lineHeight: 1.5, font: 'body' as const },
        micro: { size: '0.625rem', weight: 500, lineHeight: 1.4, font: 'body' as const, letterSpacing: '0.05em', textTransform: 'uppercase' as const },
      },
    },
    // v2: Grid system
    grid: {
      desktop: { columns: 12, gutter: '24px', maxWidth: '1280px', margin: '32px' },
      mobile: { columns: 4, gutter: '16px', margin: '16px' },
    },
    spacing: {
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '6': '1.5rem',
      '8': '2rem',
      '12': '3rem',
      '16': '4rem',
      '24': '6rem',
      // v2: Named tokens
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
      '4xl': '6rem',
      // v2: Semantic spacing
      semantic: {
        section: { paddingX: '2rem', paddingY: '4rem' },
        card: { padding: '1.5rem' },
        component: { gap: '1rem' },
        text: { gap: '0.5rem' },
        inline: { gap: '0.25rem' },
        container: { maxWidth: '80rem', paddingX: '1.5rem' },
      },
    },
    // v2: Icons
    icons: {
      sizes: { small: '16px', default: '24px', large: '32px', hero: '48px' },
      strokeWeight: '1.5px',
      boundingBox: '24px',
      strokeCaps: 'rounded' as const,
      categories: ['interface', 'navigation', 'social', 'actions'],
    },
    // v2: Components
    components: {
      button: {
        primary: {
          background: palette.accent,
          foreground: { light: '#FFFFFF', dark: '#FFFFFF' },
          backgroundHover: palette.accentHover,
          border: palette.accent,
        },
        secondary: {
          background: { light: '#F3F4F6', dark: '#2D2D2D' },
          foreground: { light: '#171717', dark: '#EDEDED' },
          backgroundHover: { light: '#E5E7EB', dark: '#404040' },
          border: { light: '#E5E7EB', dark: '#404040' },
        },
        outline: {
          background: { light: 'transparent', dark: 'transparent' },
          foreground: palette.accent,
          backgroundHover: { light: `${palette.accent.light}10`, dark: `${palette.accent.dark}10` },
          border: palette.accent,
        },
        paddingX: '1.5rem',
        paddingY: '0.75rem',
        fontSize: '0.875rem',
        fontWeight: 500,
        borderRadius: '0.5rem',
        letterSpacing: '0.025em',
      },
      card: {
        variants: {
          feature: { background: { light: '#F9FAFB', dark: '#1A1A1A' }, border: { light: '#E5E7EB', dark: '#2D2D2D' }, padding: '1.5rem' },
          stat: { background: { light: '#FFFFFF', dark: '#121212' }, border: { light: '#E5E7EB', dark: '#2D2D2D' }, padding: '1.5rem' },
          image: { background: { light: '#F3F4F6', dark: '#1A1A1A' }, border: { light: '#E5E7EB', dark: '#2D2D2D' }, padding: '0' },
        },
        borderRadius: '0.75rem',
      },
      input: {
        background: { light: '#FFFFFF', dark: '#121212' },
        border: { light: '#E5E7EB', dark: '#2D2D2D' },
        borderFocus: palette.accent,
        placeholder: { light: '#9CA3AF', dark: '#6B7280' },
        paddingX: '1rem',
        paddingY: '0.75rem',
        fontSize: '1rem',
        borderRadius: '0.5rem',
      },
      alert: {
        variants: {
          info: { background: { light: '#EFF6FF', dark: '#1E3A5F' }, border: { light: '#3B82F6', dark: '#3B82F6' }, icon: 'info' },
          success: { background: { light: '#ECFDF5', dark: '#064E3B' }, border: { light: '#10B981', dark: '#10B981' }, icon: 'check' },
          warning: { background: { light: '#FFFBEB', dark: '#78350F' }, border: { light: '#F59E0B', dark: '#F59E0B' }, icon: 'alert' },
          error: { background: { light: '#FEF2F2', dark: '#7F1D1D' }, border: { light: '#EF4444', dark: '#EF4444' }, icon: 'x' },
        },
        padding: '1.5rem',
        borderLeftWidth: '4px',
      },
      table: {
        headerBackground: { light: '#F9FAFB', dark: '#1A1A1A' },
        rowStripe: { light: '#F9FAFB', dark: '#121212' },
        rowHover: { light: '#F3F4F6', dark: '#1E1E1E' },
        borderColor: { light: '#E5E7EB', dark: '#2D2D2D' },
        cellPaddingX: '1rem',
        cellPaddingY: '0.75rem',
      },
      navigation: {
        background: { light: '#FFFFFF', dark: '#0A0A0A' },
        linkColor: { light: '#6B7280', dark: '#9CA3AF' },
        linkHover: { light: '#171717', dark: '#EDEDED' },
        height: '64px',
      },
    },
    borders: {
      radius: {
        none: '0',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      width: {
        thin: '1px',
        medium: '2px',
        thick: '4px',
      },
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },
    motion: {
      duration: {
        instant: '100ms',
        fast: '200ms',
        base: '300ms',
        slow: '500ms',
      },
      easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // v2: Interactions
      interactions: {
        hover: { scale: 1.02, duration: '200ms' },
        fade: { opacity: [0, 1], duration: '300ms' },
        slide: { transform: 'translateY(8px)', duration: '200ms' },
      },
      principles: ['Performance first', 'Purposeful motion', 'Subtle enhancement'],
    },
    // v2: Imagery guidelines
    imagery: {
      styles: [
        `Professional ${inputs.industry.toLowerCase()} photography`,
        'Clean product shots with consistent lighting',
        'Abstract geometric backgrounds',
      ],
      guidelines: {
        do: [
          'Use high-quality, professional images',
          'Maintain consistent color grading',
          'Feature real products and people',
        ],
        dont: [
          'Use generic stock photos',
          'Over-saturate or heavily filter images',
          'Use cluttered or busy compositions',
        ],
      },
      photoTreatment: {
        colorGrading: inputs.colorMood === 'warm' ? 'warm tones' : inputs.colorMood === 'cool' ? 'cool tones' : 'neutral',
        contrast: inputs.colorBrightness === 'vibrant' ? 'high' : 'medium',
        style: inputs.typographyStyle === 'modern' ? 'clean and minimal' : 'rich and detailed',
      },
    },
    voiceAndTone: {
      personality: inputs.personalityAdjectives,
      writingStyle: `${inputs.personalityAdjectives.join(', ')} communication style tailored for ${inputs.targetAudience} in the ${inputs.industry} space.`,
      examples: {
        headlines: [
          `${inputs.companyName}: Where ${inputs.personalityAdjectives[0] || 'innovation'} meets results`,
          `The ${inputs.personalityAdjectives[1] || 'smart'} way to transform your ${inputs.industry.toLowerCase()}`,
          `Built for ${inputs.targetAudience.split(' ')[0]?.toLowerCase() || 'teams'} who demand more`,
        ],
        cta: ['Get Started', 'See It In Action', 'Start Free Trial'],
        descriptions: [
          `${inputs.companyName} empowers ${inputs.targetAudience.toLowerCase()} with ${inputs.personalityAdjectives[0] || 'innovative'} solutions.`,
          `Experience the ${inputs.personalityAdjectives[1] || 'modern'} approach to ${inputs.industry.toLowerCase()}.`,
          `Join thousands who trust ${inputs.companyName} for their ${inputs.industry.toLowerCase()} needs.`,
        ],
      },
      // v2: Voice attributes
      attributes: {
        tone: {
          name: inputs.personalityAdjectives[0] || 'Professional',
          description: `Our communication is ${inputs.personalityAdjectives[0]?.toLowerCase() || 'professional'} and resonates with ${inputs.targetAudience.toLowerCase()}.`,
          example: `"${inputs.companyName} delivers ${inputs.personalityAdjectives[0]?.toLowerCase() || 'exceptional'} results."`,
        },
        clarity: {
          name: 'Clear',
          description: 'We communicate complex ideas simply and directly.',
          example: 'We make the complex simple.',
        },
      },
      guidelines: {
        do: [
          'Use active voice',
          'Lead with benefits, not features',
          'Be specific with numbers and metrics',
        ],
        dont: [
          'Use jargon without explanation',
          'Make unsubstantiated claims',
          'Use passive constructions',
        ],
      },
      coreMessage: `${inputs.companyName} is the ${inputs.personalityAdjectives[0]?.toLowerCase() || 'leading'} solution for ${inputs.targetAudience.toLowerCase()} in ${inputs.industry.toLowerCase()}.`,
    },
    // v2: Utility tokens
    zIndex: {
      base: 0,
      raised: 10,
      dropdown: 20,
      sticky: 30,
      fixed: 40,
      modal: 50,
      popover: 60,
      tooltip: 70,
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    // Support both { inputs, userId } format and direct inputs
    const inputs: DiscoveryInputs = body.inputs || body;
    const userId: string | undefined = body.userId;

    let tokens: BrandSystem;
    let modelVersion = 'demo';

    if (USE_DEMO_MODE) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      tokens = generateDemoBrandSystem(inputs);
    } else {
      // Real API mode with Claude
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY not configured');
      }

      const anthropic = new Anthropic({ apiKey });
      const prompt = await buildPrompt(inputs);

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      });

      // Extract text content
      const textBlock = response.content.find(
        (block): block is Anthropic.TextBlock => block.type === 'text'
      );
      if (!textBlock) {
        throw new Error('No text response from Claude');
      }

      // Parse JSON (handle potential markdown code blocks)
      let jsonText = textBlock.text.trim();
      if (jsonText.startsWith('```')) {
        jsonText = jsonText
          .replace(/```json?\n?/g, '')
          .replace(/```$/g, '')
          .trim();
      }

      tokens = JSON.parse(jsonText);
      modelVersion = 'claude-sonnet-4-5';

      // Ensure metadata is set
      tokens.metadata = {
        name: inputs.companyName,
        generatedAt: new Date().toISOString(),
        version: '2.0.0',
      };
    }

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
          modelVersion,
          promptVersion: PROMPT_VERSION,
          generationTimeMs,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      } catch {
        // Database save failed - non-critical, continue with response
      }
    }

    return NextResponse.json({
      ...tokens,
      _generationId: generationId,
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate brand system' },
      { status: 500 }
    );
  }
}
