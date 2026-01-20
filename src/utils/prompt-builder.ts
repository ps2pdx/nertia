import { database } from '@/lib/firebase';
import { ref, get, query, orderByChild, equalTo, limitToFirst } from 'firebase/database';
import { DiscoveryInputs, BrandSystem } from '@/types/brand-system';

// Enhanced color intelligence with specific guidance per industry
interface IndustryGuidance {
  primaryColors: string[];
  accentColors: string[];
  avoid: string[];
  mood: string;
  typography: string;
  examples: string[];
  darkModeNotes: string;
}

const COLOR_INTELLIGENCE: Record<string, IndustryGuidance> = {
  'AI/ML Infrastructure': {
    primaryColors: ['#0A0A0A', '#121212', '#1A1A1A', '#212121'],
    accentColors: ['#FF7759', '#D97757', '#00A67E', '#10B981', '#F97316'],
    avoid: ['blue', 'purple', 'neon colors', 'overly corporate blues'],
    mood: 'Sophisticated, cutting-edge, technical yet approachable',
    typography: 'Modern sans-serif (Inter, Plus Jakarta Sans), monospace for code elements',
    examples: ['OpenAI: #000000 + #00A67E', 'Anthropic: #000000 + #D97757', 'Vercel: #000000 + #FFFFFF'],
    darkModeNotes: 'Dark mode should be primary. Light mode as secondary option.',
  },
  'Developer Tools': {
    primaryColors: ['#0D1117', '#161B22', '#21262D', '#1E1E1E'],
    accentColors: ['#58A6FF', '#7EE787', '#FF7B72', '#FFA657', '#A371F7'],
    avoid: ['overly corporate', 'pastel colors', 'low contrast combinations'],
    mood: 'Technical, efficient, powerful, trustworthy',
    typography: 'Clean sans-serif (JetBrains Sans, Inter), excellent monospace (JetBrains Mono, Fira Code)',
    examples: ['GitHub: #0D1117 + syntax colors', 'VS Code: #1E1E1E + blue accents', 'Linear: #000000 + purple'],
    darkModeNotes: 'Dark mode is essential. High contrast for code readability.',
  },
  'B2B SaaS': {
    primaryColors: ['#FFFFFF', '#F8FAFC', '#0F172A', '#1E293B'],
    accentColors: ['#3B82F6', '#0EA5E9', '#6366F1', '#8B5CF6', '#14B8A6'],
    avoid: ['overly playful colors', 'neon', 'too many competing colors'],
    mood: 'Professional, trustworthy, efficient, modern',
    typography: 'Clean sans-serif (Inter, SF Pro, Geist), readable body text',
    examples: ['Stripe: white + purple gradient', 'Notion: white + black accents', 'Figma: white + multi-color'],
    darkModeNotes: 'Both modes important. Light mode often primary for business users.',
  },
  'Fintech': {
    primaryColors: ['#0F172A', '#1E3A5F', '#FFFFFF', '#F8FAFC'],
    accentColors: ['#0066FF', '#00D4AA', '#FFB800', '#10B981', '#3B82F6'],
    avoid: ['bright red (except errors)', 'playful fonts', 'unprofessional colors'],
    mood: 'Trustworthy, secure, premium, professional',
    typography: 'Classic sans-serif (Inter, GT America), clear numbers display',
    examples: ['Stripe: dark blue + purple', 'Robinhood: white + green', 'Mercury: black + green'],
    darkModeNotes: 'Dark mode conveys premium feel. Gold accents for premium tier.',
  },
  'Healthcare Tech': {
    primaryColors: ['#FFFFFF', '#F0F9FF', '#EFF6FF', '#F8FAFC'],
    accentColors: ['#0EA5E9', '#06B6D4', '#10B981', '#3B82F6', '#8B5CF6'],
    avoid: ['alarming red (except alerts)', 'harsh colors', 'low contrast'],
    mood: 'Calming, trustworthy, accessible, caring',
    typography: 'Highly readable fonts (Inter, Source Sans Pro), generous line height',
    examples: ['Oscar Health: white + blue', 'One Medical: white + teal', 'Headspace: soft colors'],
    darkModeNotes: 'Light mode primary. Accessibility is critical - WCAG AAA preferred.',
  },
  'E-commerce': {
    primaryColors: ['#FFFFFF', '#F9FAFB', '#18181B', '#27272A'],
    accentColors: ['#EF4444', '#F97316', '#FBBF24', '#10B981', '#EC4899'],
    avoid: ['clashing colors', 'too many accents', 'hard-to-read combinations'],
    mood: 'Vibrant, trustworthy, action-oriented, clean',
    typography: 'Modern sans-serif, clear product display fonts',
    examples: ['Shopify: white + green CTA', 'Amazon: white + orange', 'Glossier: pink + minimal'],
    darkModeNotes: 'Light mode usually primary. CTAs must stand out in both modes.',
  },
  'Consumer Apps': {
    primaryColors: ['#FFFFFF', '#F5F5F5', '#1A1A1A', '#262626'],
    accentColors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FF8C42'],
    avoid: ['corporate blues (unless targeting professionals)', 'boring palettes'],
    mood: 'Playful, engaging, friendly, memorable',
    typography: 'Expressive fonts allowed (Poppins, Outfit), can be more playful',
    examples: ['Spotify: black + green', 'Instagram: gradient accents', 'Duolingo: green + bright'],
    darkModeNotes: 'Both modes important. Match the energy of the brand.',
  },
  'Climate Tech': {
    primaryColors: ['#FFFFFF', '#F0FDF4', '#052E16', '#14532D'],
    accentColors: ['#22C55E', '#10B981', '#0EA5E9', '#84CC16', '#14B8A6'],
    avoid: ['cliche greenwashing', 'overly literal green', 'cheap-looking combinations'],
    mood: 'Optimistic, serious, sophisticated, natural',
    typography: 'Clean modern fonts, can use nature-inspired serifs',
    examples: ['Stripe Climate: deep green', 'Patch: sophisticated green', 'Tomorrow: minimal + green'],
    darkModeNotes: 'Both modes work. Deep greens work well in dark mode.',
  },
};

// Personality to style mappings
interface PersonalityStyle {
  colorTendency: string;
  typographyHints: string[];
  spacingDensity: string;
  borderRadius: string;
  motionStyle: string;
}

const PERSONALITY_MAPPINGS: Record<string, PersonalityStyle> = {
  innovative: {
    colorTendency: 'Vibrant accents, gradient-friendly, bold contrast',
    typographyHints: ['modern', 'technical'],
    spacingDensity: 'spacious',
    borderRadius: 'rounded (lg, xl)',
    motionStyle: 'Smooth, slightly playful transitions',
  },
  trustworthy: {
    colorTendency: 'Blue-based, muted tones, consistent palette',
    typographyHints: ['classic', 'modern'],
    spacingDensity: 'balanced',
    borderRadius: 'subtle (sm, md)',
    motionStyle: 'Subtle, professional transitions',
  },
  bold: {
    colorTendency: 'High contrast, striking accents, dramatic',
    typographyHints: ['modern', 'display-heavy'],
    spacingDensity: 'spacious',
    borderRadius: 'varied (can mix sharp and round)',
    motionStyle: 'Confident, impactful animations',
  },
  friendly: {
    colorTendency: 'Warm tones, approachable colors, soft palette',
    typographyHints: ['playful', 'rounded'],
    spacingDensity: 'spacious',
    borderRadius: 'rounded (lg, xl, full for pills)',
    motionStyle: 'Bouncy, welcoming transitions',
  },
  premium: {
    colorTendency: 'Dark backgrounds, gold/amber accents, sophisticated',
    typographyHints: ['classic', 'serif-friendly'],
    spacingDensity: 'spacious',
    borderRadius: 'subtle (sm, md)',
    motionStyle: 'Elegant, smooth transitions',
  },
  technical: {
    colorTendency: 'Dark mode primary, syntax-inspired accents',
    typographyHints: ['technical', 'monospace-friendly'],
    spacingDensity: 'compact to balanced',
    borderRadius: 'subtle (sm, md)',
    motionStyle: 'Precise, functional transitions',
  },
  playful: {
    colorTendency: 'Bright, varied palette, can use gradients',
    typographyHints: ['playful', 'rounded'],
    spacingDensity: 'balanced to spacious',
    borderRadius: 'very rounded (xl, 2xl, full)',
    motionStyle: 'Fun, bouncy, energetic',
  },
  minimal: {
    colorTendency: 'Monochromatic, limited palette, high contrast',
    typographyHints: ['modern', 'clean'],
    spacingDensity: 'spacious',
    borderRadius: 'subtle (none, sm, md)',
    motionStyle: 'Minimal, subtle, purposeful',
  },
  sophisticated: {
    colorTendency: 'Refined palette, subtle accents, elegant combinations',
    typographyHints: ['classic', 'serif-friendly'],
    spacingDensity: 'spacious',
    borderRadius: 'subtle (sm, md)',
    motionStyle: 'Smooth, refined transitions',
  },
  approachable: {
    colorTendency: 'Warm, inviting colors, balanced contrast',
    typographyHints: ['modern', 'rounded'],
    spacingDensity: 'balanced',
    borderRadius: 'rounded (md, lg)',
    motionStyle: 'Friendly, smooth transitions',
  },
};

// Format industry guidance for the prompt
function formatIndustryGuidance(industry: string): string {
  const guidance = COLOR_INTELLIGENCE[industry];
  if (!guidance) return '';

  return `
## Industry Color Intelligence: ${industry}

**Recommended Primary Colors:** ${guidance.primaryColors.join(', ')}
**Recommended Accent Colors:** ${guidance.accentColors.join(', ')}
**Colors to Avoid:** ${guidance.avoid.join(', ')}
**Target Mood:** ${guidance.mood}
**Typography Notes:** ${guidance.typography}
**Industry References:** ${guidance.examples.join('; ')}
**Dark Mode Notes:** ${guidance.darkModeNotes}
`;
}

// Format personality guidance for the prompt
function formatPersonalityGuidance(adjectives: string[]): string {
  const relevantMappings = adjectives
    .filter((adj) => PERSONALITY_MAPPINGS[adj])
    .map((adj) => {
      const mapping = PERSONALITY_MAPPINGS[adj];
      return `
- **${adj}:**
  - Colors: ${mapping.colorTendency}
  - Typography: ${mapping.typographyHints.join(', ')}
  - Spacing: ${mapping.spacingDensity}
  - Border Radius: ${mapping.borderRadius}
  - Motion: ${mapping.motionStyle}`;
    });

  if (relevantMappings.length === 0) return '';

  return `
## Personality Style Guidance

${relevantMappings.join('\n')}

**Combined Approach:** Find the common ground between these personality traits. Prioritize the first 2-3 traits listed.
`;
}

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

export function getColorIntelligence(industry: string): IndustryGuidance | null {
  return COLOR_INTELLIGENCE[industry] || null;
}

export function getPersonalityMapping(adjective: string): PersonalityStyle | null {
  return PERSONALITY_MAPPINGS[adjective] || null;
}

export async function buildPrompt(inputs: DiscoveryInputs): Promise<string> {
  const industryGuidance = formatIndustryGuidance(inputs.industry);
  const personalityGuidance = formatPersonalityGuidance(inputs.personalityAdjectives);
  const examples = await getRelevantExamples(inputs);

  const existingColorLine = inputs.existingBrandColor
    ? `- Existing Brand Color: ${inputs.existingBrandColor} (incorporate this as primary or accent)`
    : '';

  // Brightness guidance
  const brightnessGuidance = {
    vibrant: 'Use high saturation colors, strong contrast, energetic palette',
    muted: 'Use desaturated tones, softer contrast, sophisticated palette',
    dark: 'Use dark backgrounds as primary, light text, premium feel',
  };

  // Color mood guidance
  const moodGuidance = {
    warm: 'Lean towards oranges, reds, yellows, coral, terra cotta',
    cool: 'Lean towards blues, teals, cyans, greens',
    neutral: 'Lean towards grays, blacks, whites, with minimal color accent',
  };

  return `You are a brand systems architect. Generate a comprehensive design token system (v2.0).

BRAND INPUTS:
- Company: ${inputs.companyName}
- Industry: ${inputs.industry}
- Target Audience: ${inputs.targetAudience}
- Personality: ${inputs.personalityAdjectives.join(', ')}
- Color Mood: ${inputs.colorMood} (${moodGuidance[inputs.colorMood]})
- Color Brightness: ${inputs.colorBrightness} (${brightnessGuidance[inputs.colorBrightness]})
- Typography Style: ${inputs.typographyStyle}
- Density: ${inputs.densityPreference}
${existingColorLine}

${industryGuidance}

${personalityGuidance}

${examples}

REQUIREMENTS:
1. Generate a cohesive visual system that feels ${inputs.personalityAdjectives.join(', ')}
2. All colors must work for both light and dark modes
3. Ensure WCAG AA contrast ratios (4.5:1 for text, 3:1 for UI)
4. Use semantic naming (background, foreground, accent) not color names
5. Typography should use widely available Google Fonts (recommend distinct display & body fonts)
6. Spacing uses rem units based on 4px grid (0.25rem, 0.5rem, 1rem, etc.)
7. Generate comprehensive voice/tone with attributes, guidelines, and examples
8. Include imagery guidelines relevant to the industry
9. Component tokens should be consistent with the overall design language

Return ONLY valid JSON matching this exact schema:

{
  "metadata": {
    "name": "string",
    "generatedAt": "ISO date string",
    "version": "2.0.0"
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
    "error": { "light": "#hex", "dark": "#hex" },
    "surface": {
      "default": { "light": "#hex", "dark": "#hex" },
      "elevated": { "light": "#hex", "dark": "#hex" },
      "sunken": { "light": "#hex", "dark": "#hex" }
    },
    "border": {
      "default": { "light": "#hex", "dark": "#hex" },
      "subtle": { "light": "#hex", "dark": "#hex" },
      "strong": { "light": "#hex", "dark": "#hex" },
      "focus": { "light": "#hex", "dark": "#hex" }
    },
    "overlay": { "light": "rgba(...)", "dark": "rgba(...)" },
    "usageRatios": { "background": 60, "surface": 30, "accent": 10 }
  },
  "typography": {
    "fontFamily": {
      "display": "Display Font, sans-serif",
      "body": "Body Font, sans-serif",
      "sans": "Fallback Sans, sans-serif",
      "mono": "Mono Font, monospace"
    },
    "fontSize": {
      "xs": "0.75rem", "sm": "0.875rem", "base": "1rem", "lg": "1.125rem",
      "xl": "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem",
      "5xl": "3rem", "6xl": "3.75rem"
    },
    "fontWeight": { "normal": 400, "medium": 500, "semibold": 600, "bold": 700 },
    "lineHeight": { "tight": 1.25, "normal": 1.5, "relaxed": 1.75 },
    "letterSpacing": { "tight": "-0.025em", "normal": "0em", "wide": "0.025em", "wider": "0.05em", "widest": "0.1em" },
    "scale": {
      "h1": { "size": "3rem", "weight": 700, "lineHeight": 1.15, "font": "display" },
      "h2": { "size": "2.25rem", "weight": 600, "lineHeight": 1.25, "font": "display" },
      "h3": { "size": "1.875rem", "weight": 600, "lineHeight": 1.3, "font": "display" },
      "h4": { "size": "1.5rem", "weight": 500, "lineHeight": 1.4, "font": "body" },
      "body": { "size": "1rem", "weight": 400, "lineHeight": 1.5, "font": "body" },
      "label": { "size": "0.875rem", "weight": 500, "lineHeight": 1.5, "font": "body" },
      "small": { "size": "0.75rem", "weight": 400, "lineHeight": 1.5, "font": "body" },
      "micro": { "size": "0.625rem", "weight": 500, "lineHeight": 1.4, "font": "body", "letterSpacing": "0.05em", "textTransform": "uppercase" }
    }
  },
  "grid": {
    "desktop": { "columns": 12, "gutter": "24px", "maxWidth": "1280px", "margin": "32px" },
    "mobile": { "columns": 4, "gutter": "16px", "margin": "16px" }
  },
  "spacing": {
    "0": "0", "1": "0.25rem", "2": "0.5rem", "3": "0.75rem", "4": "1rem",
    "6": "1.5rem", "8": "2rem", "12": "3rem", "16": "4rem", "24": "6rem",
    "xs": "0.25rem", "sm": "0.5rem", "md": "1rem", "lg": "1.5rem", "xl": "2rem",
    "2xl": "3rem", "3xl": "4rem", "4xl": "6rem",
    "semantic": {
      "section": { "paddingX": "2rem", "paddingY": "4rem" },
      "card": { "padding": "1.5rem" },
      "component": { "gap": "1rem" },
      "text": { "gap": "0.5rem" },
      "inline": { "gap": "0.25rem" },
      "container": { "maxWidth": "80rem", "paddingX": "1.5rem" }
    }
  },
  "icons": {
    "sizes": { "small": "16px", "default": "24px", "large": "32px", "hero": "48px" },
    "strokeWeight": "1.5px",
    "boundingBox": "24px",
    "strokeCaps": "rounded",
    "categories": ["category1", "category2", "category3"]
  },
  "components": {
    "button": {
      "primary": {
        "background": { "light": "#hex", "dark": "#hex" },
        "foreground": { "light": "#hex", "dark": "#hex" },
        "backgroundHover": { "light": "#hex", "dark": "#hex" },
        "border": { "light": "#hex", "dark": "#hex" }
      },
      "secondary": {
        "background": { "light": "#hex", "dark": "#hex" },
        "foreground": { "light": "#hex", "dark": "#hex" },
        "backgroundHover": { "light": "#hex", "dark": "#hex" },
        "border": { "light": "#hex", "dark": "#hex" }
      },
      "outline": {
        "background": { "light": "transparent", "dark": "transparent" },
        "foreground": { "light": "#hex", "dark": "#hex" },
        "backgroundHover": { "light": "#hex", "dark": "#hex" },
        "border": { "light": "#hex", "dark": "#hex" }
      },
      "paddingX": "1.5rem",
      "paddingY": "0.75rem",
      "fontSize": "0.875rem",
      "fontWeight": 500,
      "borderRadius": "0.5rem",
      "letterSpacing": "0.025em"
    },
    "card": {
      "variants": {
        "feature": { "background": { "light": "#hex", "dark": "#hex" }, "border": { "light": "#hex", "dark": "#hex" }, "padding": "1.5rem" },
        "stat": { "background": { "light": "#hex", "dark": "#hex" }, "border": { "light": "#hex", "dark": "#hex" }, "padding": "1.5rem" },
        "image": { "background": { "light": "#hex", "dark": "#hex" }, "border": { "light": "#hex", "dark": "#hex" }, "padding": "0" }
      },
      "borderRadius": "0.75rem"
    },
    "input": {
      "background": { "light": "#hex", "dark": "#hex" },
      "border": { "light": "#hex", "dark": "#hex" },
      "borderFocus": { "light": "#hex", "dark": "#hex" },
      "placeholder": { "light": "#hex", "dark": "#hex" },
      "paddingX": "1rem",
      "paddingY": "0.75rem",
      "fontSize": "1rem",
      "borderRadius": "0.5rem"
    },
    "alert": {
      "variants": {
        "info": { "background": { "light": "#hex", "dark": "#hex" }, "border": { "light": "#hex", "dark": "#hex" }, "icon": "info" },
        "success": { "background": { "light": "#hex", "dark": "#hex" }, "border": { "light": "#hex", "dark": "#hex" }, "icon": "check" },
        "warning": { "background": { "light": "#hex", "dark": "#hex" }, "border": { "light": "#hex", "dark": "#hex" }, "icon": "alert" },
        "error": { "background": { "light": "#hex", "dark": "#hex" }, "border": { "light": "#hex", "dark": "#hex" }, "icon": "x" }
      },
      "padding": "1.5rem",
      "borderLeftWidth": "4px"
    },
    "table": {
      "headerBackground": { "light": "#hex", "dark": "#hex" },
      "rowStripe": { "light": "#hex", "dark": "#hex" },
      "rowHover": { "light": "#hex", "dark": "#hex" },
      "borderColor": { "light": "#hex", "dark": "#hex" },
      "cellPaddingX": "1rem",
      "cellPaddingY": "0.75rem"
    },
    "navigation": {
      "background": { "light": "#hex", "dark": "#hex" },
      "linkColor": { "light": "#hex", "dark": "#hex" },
      "linkHover": { "light": "#hex", "dark": "#hex" },
      "height": "64px"
    }
  },
  "borders": {
    "radius": { "none": "0", "sm": "0.125rem", "md": "0.375rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px" },
    "width": { "thin": "1px", "medium": "2px", "thick": "4px" }
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1)"
  },
  "motion": {
    "duration": { "instant": "100ms", "fast": "200ms", "base": "300ms", "slow": "500ms" },
    "easing": {
      "default": "cubic-bezier(0.4, 0, 0.2, 1)",
      "in": "cubic-bezier(0.4, 0, 1, 1)",
      "out": "cubic-bezier(0, 0, 0.2, 1)",
      "inOut": "cubic-bezier(0.4, 0, 0.2, 1)"
    },
    "interactions": {
      "hover": { "scale": 1.02, "duration": "200ms" },
      "fade": { "opacity": [0, 1], "duration": "300ms" },
      "slide": { "transform": "translateY(8px)", "duration": "200ms" }
    },
    "principles": ["Performance first", "Purposeful motion", "Subtle enhancement"]
  },
  "imagery": {
    "styles": ["style1", "style2", "style3"],
    "guidelines": {
      "do": ["guideline1", "guideline2", "guideline3"],
      "dont": ["avoid1", "avoid2", "avoid3"]
    },
    "photoTreatment": {
      "colorGrading": "description",
      "contrast": "high/medium/low",
      "style": "description"
    }
  },
  "voiceAndTone": {
    "personality": ["adjective1", "adjective2", "adjective3"],
    "writingStyle": "Description of writing style",
    "examples": {
      "headlines": ["Headline 1", "Headline 2", "Headline 3"],
      "cta": ["CTA 1", "CTA 2", "CTA 3"],
      "descriptions": ["Description 1", "Description 2", "Description 3"]
    },
    "attributes": {
      "attr1": { "name": "Attribute Name", "description": "What this means", "example": "Example usage" },
      "attr2": { "name": "Attribute Name", "description": "What this means", "example": "Example usage" }
    },
    "guidelines": {
      "do": ["writing guideline 1", "writing guideline 2"],
      "dont": ["avoid 1", "avoid 2"]
    },
    "coreMessage": "The central brand message or positioning statement"
  },
  "zIndex": {
    "base": 0, "raised": 10, "dropdown": 20, "sticky": 30,
    "fixed": 40, "modal": 50, "popover": 60, "tooltip": 70
  },
  "breakpoints": {
    "sm": "640px", "md": "768px", "lg": "1024px", "xl": "1280px", "2xl": "1536px"
  }
}

Return ONLY the JSON. No explanations, no markdown code blocks.`;
}
