import { BrandSystem, ColorValue } from '@/types/brand-system';

type ColorMode = 'light' | 'dark';

// ============================================================================
// Shared Utilities for Generators
// ============================================================================

/**
 * Get color value for specified mode
 */
export function getColor(colorValue: ColorValue, mode: ColorMode): string {
  return colorValue[mode];
}

/**
 * Generate inline CSS styles for a brand system
 */
export function generateInlineStyles(tokens: BrandSystem, mode: ColorMode): string {
  const styles: string[] = [];

  // Colors
  styles.push(`--background: ${tokens.colors.background[mode]};`);
  styles.push(`--foreground: ${tokens.colors.foreground[mode]};`);
  styles.push(`--muted: ${tokens.colors.muted[mode]};`);
  styles.push(`--accent: ${tokens.colors.accent[mode]};`);
  styles.push(`--accent-hover: ${tokens.colors.accentHover[mode]};`);
  styles.push(`--card-bg: ${tokens.colors.cardBackground[mode]};`);
  styles.push(`--card-border: ${tokens.colors.cardBorder[mode]};`);
  styles.push(`--success: ${tokens.colors.success[mode]};`);
  styles.push(`--warning: ${tokens.colors.warning[mode]};`);
  styles.push(`--error: ${tokens.colors.error[mode]};`);

  // Typography
  styles.push(`--font-display: ${tokens.typography.fontFamily.display || tokens.typography.fontFamily.sans};`);
  styles.push(`--font-body: ${tokens.typography.fontFamily.body || tokens.typography.fontFamily.sans};`);
  styles.push(`--font-mono: ${tokens.typography.fontFamily.mono};`);

  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    if (typeof value === 'string') {
      styles.push(`--spacing-${key}: ${value};`);
    }
  });

  // Border radius
  Object.entries(tokens.borders.radius).forEach(([key, value]) => {
    if (typeof value === 'string') {
      styles.push(`--radius-${key}: ${value};`);
    }
  });

  // Shadows
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    styles.push(`--shadow-${key}: ${value};`);
  });

  return styles.join('\n');
}

/**
 * Generate Google Fonts link for brand typography
 */
export function generateGoogleFontsLink(tokens: BrandSystem): string {
  const fonts = new Set<string>();

  // Extract font family names (first part before comma)
  const extractFontName = (fontFamily: string): string => {
    return fontFamily.split(',')[0].trim().replace(/["']/g, '');
  };

  if (tokens.typography.fontFamily.display) {
    fonts.add(extractFontName(tokens.typography.fontFamily.display));
  }
  if (tokens.typography.fontFamily.body) {
    fonts.add(extractFontName(tokens.typography.fontFamily.body));
  }
  fonts.add(extractFontName(tokens.typography.fontFamily.sans));

  // Build Google Fonts URL
  const fontParams = Array.from(fonts)
    .filter(f => !['sans-serif', 'serif', 'monospace', 'system-ui'].includes(f.toLowerCase()))
    .map(f => `family=${encodeURIComponent(f)}:wght@400;500;600;700`)
    .join('&');

  if (!fontParams) return '';

  return `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
}

/**
 * Generate base HTML document structure
 */
export function generateHtmlDocument(options: {
  title: string;
  styles: string;
  body: string;
  fontsLink?: string;
  meta?: Record<string, string>;
}): string {
  const { title, styles, body, fontsLink, meta = {} } = options;

  const metaTags = Object.entries(meta)
    .map(([name, content]) => `<meta name="${name}" content="${content}">`)
    .join('\n    ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${metaTags}
  <title>${title}</title>
  ${fontsLink ? `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontsLink}" rel="stylesheet">` : ''}
  <style>
${styles}
  </style>
</head>
<body>
${body}
</body>
</html>`;
}

/**
 * Generate email-safe inline styles (no CSS variables)
 */
export function generateEmailInlineStyles(tokens: BrandSystem, mode: ColorMode): Record<string, string> {
  return {
    background: tokens.colors.background[mode],
    foreground: tokens.colors.foreground[mode],
    muted: tokens.colors.muted[mode],
    accent: tokens.colors.accent[mode],
    accentHover: tokens.colors.accentHover[mode],
    cardBg: tokens.colors.cardBackground[mode],
    cardBorder: tokens.colors.cardBorder[mode],
    success: tokens.colors.success[mode],
    warning: tokens.colors.warning[mode],
    error: tokens.colors.error[mode],
    fontDisplay: tokens.typography.fontFamily.display || tokens.typography.fontFamily.sans,
    fontBody: tokens.typography.fontFamily.body || tokens.typography.fontFamily.sans,
    radiusMd: tokens.borders.radius.md,
    radiusLg: tokens.borders.radius.lg,
  };
}

/**
 * Get brand copy from voice and tone tokens
 */
export function getBrandCopy(tokens: BrandSystem): {
  headlines: string[];
  ctas: string[];
  descriptions: string[];
  coreMessage?: string;
} {
  return {
    headlines: tokens.voiceAndTone.examples.headlines,
    ctas: tokens.voiceAndTone.examples.cta,
    descriptions: tokens.voiceAndTone.examples.descriptions,
    coreMessage: tokens.voiceAndTone.coreMessage,
  };
}

/**
 * Generate button HTML with inline styles
 */
export function generateButton(
  text: string,
  tokens: BrandSystem,
  mode: ColorMode,
  variant: 'primary' | 'secondary' = 'primary'
): string {
  const btn = tokens.components?.button;
  if (!btn) {
    return `<a href="#" style="display: inline-block; padding: 12px 24px; background: ${tokens.colors.accent[mode]}; color: white; text-decoration: none; border-radius: 4px;">${text}</a>`;
  }

  const styles = variant === 'primary'
    ? `background: ${btn.primary.background[mode]}; color: ${btn.primary.foreground[mode]};`
    : `background: ${btn.secondary.background[mode]}; color: ${btn.secondary.foreground[mode]}; border: 1px solid ${btn.secondary.border[mode]};`;

  return `<a href="#" style="display: inline-block; padding: ${btn.paddingY} ${btn.paddingX}; ${styles} text-decoration: none; border-radius: ${btn.borderRadius}; font-size: ${btn.fontSize}; font-weight: ${btn.fontWeight};">${text}</a>`;
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, char => htmlEntities[char]);
}

/**
 * Generate timestamp string
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}
