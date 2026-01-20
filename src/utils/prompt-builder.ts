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

  return `You are a brand systems architect. Generate a comprehensive design token system (v2.0).

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
    },
    "tag": {
      "variants": {
        "default": { "background": { "light": "#hex", "dark": "#hex" }, "foreground": { "light": "#hex", "dark": "#hex" }, "border": { "light": "#hex", "dark": "#hex" } },
        "accent": { "background": { "light": "#hex", "dark": "#hex" }, "foreground": { "light": "#hex", "dark": "#hex" }, "border": { "light": "#hex", "dark": "#hex" } },
        "success": { "background": { "light": "#hex", "dark": "#hex" }, "foreground": { "light": "#hex", "dark": "#hex" }, "border": { "light": "#hex", "dark": "#hex" } },
        "warning": { "background": { "light": "#hex", "dark": "#hex" }, "foreground": { "light": "#hex", "dark": "#hex" }, "border": { "light": "#hex", "dark": "#hex" } },
        "error": { "background": { "light": "#hex", "dark": "#hex" }, "foreground": { "light": "#hex", "dark": "#hex" }, "border": { "light": "#hex", "dark": "#hex" } }
      },
      "sizes": {
        "sm": { "paddingX": "0.5rem", "paddingY": "0.125rem", "fontSize": "0.75rem" },
        "md": { "paddingX": "0.75rem", "paddingY": "0.25rem", "fontSize": "0.875rem" },
        "lg": { "paddingX": "1rem", "paddingY": "0.375rem", "fontSize": "1rem" }
      },
      "borderRadius": "9999px",
      "fontWeight": 500
    },
    "tabs": {
      "variants": {
        "bordered": {
          "background": { "light": "transparent", "dark": "transparent" },
          "foreground": { "light": "#hex", "dark": "#hex" },
          "border": { "light": "#hex", "dark": "#hex" },
          "activeBackground": { "light": "#hex", "dark": "#hex" },
          "activeForeground": { "light": "#hex", "dark": "#hex" },
          "activeBorder": { "light": "#hex", "dark": "#hex" }
        },
        "underline": {
          "background": { "light": "transparent", "dark": "transparent" },
          "foreground": { "light": "#hex", "dark": "#hex" },
          "border": { "light": "transparent", "dark": "transparent" },
          "activeBackground": { "light": "transparent", "dark": "transparent" },
          "activeForeground": { "light": "#hex", "dark": "#hex" },
          "activeBorder": { "light": "#hex", "dark": "#hex" }
        },
        "pill": {
          "background": { "light": "transparent", "dark": "transparent" },
          "foreground": { "light": "#hex", "dark": "#hex" },
          "border": { "light": "transparent", "dark": "transparent" },
          "activeBackground": { "light": "#hex", "dark": "#hex" },
          "activeForeground": { "light": "#hex", "dark": "#hex" },
          "activeBorder": { "light": "transparent", "dark": "transparent" }
        }
      },
      "gap": "0.25rem",
      "padding": "0.5rem 1rem"
    },
    "form": {
      "textarea": {
        "background": { "light": "#hex", "dark": "#hex" },
        "border": { "light": "#hex", "dark": "#hex" },
        "borderFocus": { "light": "#hex", "dark": "#hex" },
        "minHeight": "120px",
        "padding": "0.75rem",
        "borderRadius": "0.5rem"
      },
      "checkbox": {
        "size": "1.25rem",
        "borderRadius": "0.25rem",
        "borderColor": { "light": "#hex", "dark": "#hex" },
        "checkedBackground": { "light": "#hex", "dark": "#hex" },
        "checkedBorder": { "light": "#hex", "dark": "#hex" },
        "checkmarkColor": { "light": "#hex", "dark": "#hex" }
      },
      "radio": {
        "size": "1.25rem",
        "borderColor": { "light": "#hex", "dark": "#hex" },
        "checkedBackground": { "light": "#hex", "dark": "#hex" },
        "checkedBorder": { "light": "#hex", "dark": "#hex" },
        "dotColor": { "light": "#hex", "dark": "#hex" }
      },
      "toggle": {
        "width": "3rem",
        "height": "1.5rem",
        "borderRadius": "9999px",
        "offBackground": { "light": "#hex", "dark": "#hex" },
        "onBackground": { "light": "#hex", "dark": "#hex" },
        "thumbColor": { "light": "#hex", "dark": "#hex" }
      }
    },
    "tableVariants": {
      "basic": { "headerBackground": { "light": "#hex", "dark": "#hex" }, "rowBackground": { "light": "#hex", "dark": "#hex" }, "borderColor": { "light": "#hex", "dark": "#hex" } },
      "striped": { "headerBackground": { "light": "#hex", "dark": "#hex" }, "rowEven": { "light": "#hex", "dark": "#hex" }, "rowOdd": { "light": "#hex", "dark": "#hex" }, "borderColor": { "light": "#hex", "dark": "#hex" } },
      "hover": { "headerBackground": { "light": "#hex", "dark": "#hex" }, "rowBackground": { "light": "#hex", "dark": "#hex" }, "rowHover": { "light": "#hex", "dark": "#hex" }, "borderColor": { "light": "#hex", "dark": "#hex" } },
      "comparison": { "headerBackground": { "light": "#hex", "dark": "#hex" }, "highlightColumn": { "light": "#hex", "dark": "#hex" }, "rowBackground": { "light": "#hex", "dark": "#hex" }, "borderColor": { "light": "#hex", "dark": "#hex" } },
      "bordered": { "headerBackground": { "light": "#hex", "dark": "#hex" }, "rowBackground": { "light": "#hex", "dark": "#hex" }, "borderColor": { "light": "#hex", "dark": "#hex" }, "borderWidth": "2px" }
    }
  },
  "dataVisualization": {
    "statCard": {
      "default": {
        "background": { "light": "#hex", "dark": "#hex" },
        "border": { "light": "#hex", "dark": "#hex" },
        "labelColor": { "light": "#hex", "dark": "#hex" },
        "valueColor": { "light": "#hex", "dark": "#hex" },
        "padding": "1.5rem",
        "borderRadius": "0.75rem"
      },
      "hero": {
        "background": { "light": "#hex", "dark": "#hex" },
        "border": { "light": "#hex", "dark": "#hex" },
        "labelColor": { "light": "#hex", "dark": "#hex" },
        "valueColor": { "light": "#hex", "dark": "#hex" },
        "padding": "2rem",
        "borderRadius": "1rem"
      }
    },
    "progress": {
      "track": { "light": "#hex", "dark": "#hex" },
      "fill": { "light": "#hex", "dark": "#hex" },
      "height": "0.5rem",
      "borderRadius": "9999px"
    },
    "timeline": {
      "lineColor": { "light": "#hex", "dark": "#hex" },
      "dotColor": { "light": "#hex", "dark": "#hex" },
      "dotSize": "0.75rem",
      "lineWidth": "2px"
    },
    "codeBlock": {
      "background": { "light": "#hex", "dark": "#hex" },
      "border": { "light": "#hex", "dark": "#hex" },
      "textColor": { "light": "#hex", "dark": "#hex" },
      "padding": "1rem",
      "borderRadius": "0.5rem",
      "fontFamily": "Mono Font, monospace"
    }
  },
  "logo": {
    "variants": {
      "primary": { "description": "Full color logo for primary use", "usage": "Website headers, marketing materials", "background": "any" },
      "light": { "description": "Light version for dark backgrounds", "usage": "Dark mode, dark sections", "background": "dark" },
      "dark": { "description": "Dark version for light backgrounds", "usage": "Light mode, print materials", "background": "light" },
      "wordmark": { "description": "Text-only logo variant", "usage": "Small spaces, text-heavy contexts", "background": "any" },
      "icon": { "description": "Icon-only logo mark", "usage": "Favicons, app icons, small sizes", "background": "any" }
    },
    "clearSpace": {
      "unit": "x-height of logo",
      "minimum": "1x"
    },
    "sizing": {
      "minimum": "24px",
      "recommended": {
        "header": "32px",
        "footer": "24px",
        "favicon": "32px",
        "social": "400px"
      }
    },
    "guidelines": {
      "do": ["Maintain aspect ratio", "Use approved color variants", "Ensure adequate contrast"],
      "dont": ["Stretch or distort", "Add effects or shadows", "Place on busy backgrounds"]
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
    "principles": ["Performance first", "Purposeful motion", "Subtle enhancement"],
    "loading": {
      "spinner": {
        "size": { "sm": "1rem", "md": "1.5rem", "lg": "2rem" },
        "borderWidth": "2px",
        "color": { "light": "#hex", "dark": "#hex" },
        "trackColor": { "light": "#hex", "dark": "#hex" },
        "duration": "750ms"
      },
      "skeleton": {
        "background": { "light": "#hex", "dark": "#hex" },
        "shimmer": { "light": "#hex", "dark": "#hex" },
        "borderRadius": "0.25rem",
        "duration": "1.5s"
      },
      "pulse": {
        "color": { "light": "#hex", "dark": "#hex" },
        "duration": "1s",
        "scale": [0.95, 1.05]
      },
      "dots": {
        "size": "0.5rem",
        "gap": "0.25rem",
        "color": { "light": "#hex", "dark": "#hex" },
        "duration": "1.4s"
      }
    }
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
