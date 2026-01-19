import { database } from '@/lib/firebase';
import { ref, get, query, orderByChild, equalTo, limitToFirst } from 'firebase/database';
import { DiscoveryInputs, BrandSystem } from '@/types/brand-system';

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
  'Healthcare Tech': `
    Calming colors: soft blues, greens, whites.
    Accessibility is critical - high contrast.
    Avoid alarming reds except for actual alerts.
  `,
  'E-commerce': `
    Vibrant accent colors for CTAs.
    Trust signals matter - clean, professional base.
    Consider seasonal flexibility in accent colors.
  `,
  'Consumer Apps': `
    Can be more playful and expressive.
    Consider demographic - younger audiences appreciate bold colors.
    Ensure accessibility across all color choices.
  `,
  'Climate Tech': `
    Natural greens, earth tones, ocean blues.
    Avoid greenwashing cliches - be sophisticated.
    Balance optimism with seriousness of mission.
  `,
};

export async function getRelevantExamples(inputs: DiscoveryInputs): Promise<string> {
  if (!database) return '';

  try {
    const examplesRef = ref(database, 'goldenExamples');
    const activeQuery = query(
      examplesRef,
      orderByChild('isActive'),
      equalTo(true),
      limitToFirst(5)
    );
    const snapshot = await get(activeQuery);

    if (!snapshot.exists()) return '';

    const examples: { inputs: DiscoveryInputs; tokens: BrandSystem }[] = [];
    snapshot.forEach((child) => {
      const data = child.val();
      // Filter by industry or color mood - get most relevant
      if (
        data.industry?.toLowerCase().includes(inputs.industry.toLowerCase()) ||
        data.colorMood === inputs.colorMood
      ) {
        examples.push({ inputs: data.inputs, tokens: data.tokens });
      }
    });

    // Limit to 2 examples for prompt size
    const selectedExamples = examples.slice(0, 2);

    if (selectedExamples.length === 0) return '';

    const exampleText = selectedExamples
      .map(
        (ex, i) => `
EXAMPLE ${i + 1}:
Company: ${ex.inputs.companyName} (${ex.inputs.industry})
Personality: ${ex.inputs.personalityAdjectives?.join(', ')}
Color Mood: ${ex.inputs.colorMood}, ${ex.inputs.colorBrightness}

Generated Tokens:
${JSON.stringify(ex.tokens, null, 2)}
`
      )
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

Return ONLY valid JSON matching this exact schema:

{
  "metadata": {
    "name": "string",
    "generatedAt": "ISO date string",
    "version": "1.0.0"
  },
  "colors": {
    "background": { "light": "#hex", "dark": "#hex" },
    "foreground": { "light": "#hex", "dark": "#hex" },
    "muted": { "light": "#hex", "dark": "#hex" },
    "accent": { "light": "#hex", "dark": "#hex" },
    "accentHover": { "light": "#hex", "dark": "#hex" },
    "cardBackground": { "light": "#hex", "dark": "#hex" },
    "cardBorder": { "light": "#hex", "dark": "#hex" },
    "success": { "light": "#hex", "dark": "#hex" },
    "warning": { "light": "#hex", "dark": "#hex" },
    "error": { "light": "#hex", "dark": "#hex" }
  },
  "typography": {
    "fontFamily": {
      "sans": "Font Name, sans-serif",
      "mono": "Mono Font, monospace"
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem"
    },
    "fontWeight": {
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "lineHeight": {
      "tight": 1.25,
      "normal": 1.5,
      "relaxed": 1.75
    }
  },
  "spacing": {
    "0": "0",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "6": "1.5rem",
    "8": "2rem",
    "12": "3rem",
    "16": "4rem",
    "24": "6rem"
  },
  "borders": {
    "radius": {
      "none": "0",
      "sm": "0.125rem",
      "md": "0.375rem",
      "lg": "0.5rem",
      "full": "9999px"
    },
    "width": {
      "thin": "1px",
      "medium": "2px",
      "thick": "4px"
    }
  },
  "shadows": {
    "sm": "shadow value",
    "md": "shadow value",
    "lg": "shadow value",
    "xl": "shadow value"
  },
  "motion": {
    "duration": {
      "fast": "150ms",
      "normal": "300ms",
      "slow": "500ms"
    },
    "easing": {
      "default": "cubic-bezier(0.4, 0, 0.2, 1)",
      "in": "cubic-bezier(0.4, 0, 1, 1)",
      "out": "cubic-bezier(0, 0, 0.2, 1)",
      "inOut": "cubic-bezier(0.4, 0, 0.2, 1)"
    }
  },
  "voiceAndTone": {
    "personality": ["adjective1", "adjective2", "adjective3"],
    "writingStyle": "Description of writing style",
    "examples": {
      "headlines": ["Headline 1", "Headline 2", "Headline 3"],
      "cta": ["CTA 1", "CTA 2", "CTA 3"],
      "descriptions": ["Description 1", "Description 2", "Description 3"]
    }
  }
}

Return ONLY the JSON. No explanations, no markdown code blocks.`;
}
