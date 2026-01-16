import { BrandSystem } from '@/types/brand-system';

type ColorMode = 'light' | 'dark';

/**
 * Convert a BrandSystem to CSS custom properties
 */
export function tokensToCssVariables(
  tokens: BrandSystem,
  mode: ColorMode
): Record<string, string> {
  const vars: Record<string, string> = {};

  // Colors
  Object.entries(tokens.colors).forEach(([key, value]) => {
    vars[`--${kebabCase(key)}`] = value[mode];
  });

  // Typography - Font Family
  vars['--font-sans'] = tokens.typography.fontFamily.sans;
  vars['--font-mono'] = tokens.typography.fontFamily.mono;

  // Typography - Font Size
  Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
    vars[`--text-${key}`] = value;
  });

  // Typography - Font Weight
  Object.entries(tokens.typography.fontWeight).forEach(([key, value]) => {
    vars[`--font-${key}`] = String(value);
  });

  // Typography - Line Height
  Object.entries(tokens.typography.lineHeight).forEach(([key, value]) => {
    vars[`--leading-${key}`] = String(value);
  });

  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    vars[`--spacing-${key}`] = value;
  });

  // Border Radius
  Object.entries(tokens.borders.radius).forEach(([key, value]) => {
    vars[`--radius-${key}`] = value;
  });

  // Border Width
  Object.entries(tokens.borders.width).forEach(([key, value]) => {
    vars[`--border-${key}`] = value;
  });

  // Shadows
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    vars[`--shadow-${key}`] = value;
  });

  // Motion - Duration
  Object.entries(tokens.motion.duration).forEach(([key, value]) => {
    vars[`--duration-${key}`] = value;
  });

  // Motion - Easing
  Object.entries(tokens.motion.easing).forEach(([key, value]) => {
    vars[`--easing-${key}`] = value;
  });

  return vars;
}

/**
 * Apply CSS variables to the document root
 */
export function applyCssVariables(vars: Record<string, string>): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

/**
 * Generate a CSS string from variables
 */
export function generateCssString(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
}

/**
 * Generate full CSS with both light and dark mode
 */
export function generateFullCss(tokens: BrandSystem): string {
  const lightVars = tokensToCssVariables(tokens, 'light');
  const darkVars = tokensToCssVariables(tokens, 'dark');

  return `:root {
${generateCssString(lightVars)}
}

@media (prefers-color-scheme: dark) {
  :root {
${generateCssString(darkVars)}
  }
}`;
}

/**
 * Convert camelCase to kebab-case
 */
function kebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
