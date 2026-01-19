import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { BrandSystem, DiscoveryInputs } from '@/types/brand-system';
import { database } from '@/lib/firebase';
import { ref, push, set } from 'firebase/database';
import { buildPrompt } from '@/utils/prompt-builder';

const PROMPT_VERSION = 'v1.0';

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
  const fontFamilies: Record<string, { sans: string; mono: string }> = {
    modern: { sans: 'Inter, system-ui, sans-serif', mono: 'JetBrains Mono, monospace' },
    classic: { sans: 'Merriweather, Georgia, serif', mono: 'Courier New, monospace' },
    playful: { sans: 'Poppins, sans-serif', mono: 'Space Mono, monospace' },
    technical: { sans: 'IBM Plex Sans, sans-serif', mono: 'IBM Plex Mono, monospace' },
  };

  const fonts = fontFamilies[inputs.typographyStyle] || fontFamilies.modern;

  return {
    metadata: {
      name: inputs.companyName,
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
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
    },
    borders: {
      radius: {
        none: '0',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
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
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
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

    console.log('Generating brand system for:', inputs.companyName);
    console.log('Demo mode:', USE_DEMO_MODE);

    let tokens: BrandSystem;
    let modelVersion = 'demo';

    if (USE_DEMO_MODE) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      tokens = generateDemoBrandSystem(inputs);
      console.log('Demo brand system generated successfully');
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
        version: '1.0.0',
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

        console.log('Generation saved to Firebase:', generationId);
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
      { error: error instanceof Error ? error.message : 'Failed to generate brand system' },
      { status: 500 }
    );
  }
}
