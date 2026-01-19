import { DiscoveryInputs } from '@/types/brand-system';
import { WebsiteDiscoveryResult } from '@/types/website-discovery';

/**
 * Map raw website discovery data to DiscoveryInputs for the form
 */
export function mapDiscoveryToInputs(
  discovery: WebsiteDiscoveryResult
): Partial<DiscoveryInputs> {
  const inputs: Partial<DiscoveryInputs> = {};

  // Extract company name from title (often "Company Name - Tagline" or "Company Name | Description")
  if (discovery.title) {
    const name = extractCompanyName(discovery.title);
    if (name) {
      inputs.companyName = name;
    }
  }

  // Set existing brand color from primary discovered color
  if (discovery.colors.primary) {
    inputs.existingBrandColor = discovery.colors.primary;
    inputs.colorMood = inferColorMood(discovery.colors.primary);
    inputs.colorBrightness = inferColorBrightness(discovery.colors.primary);
  }

  // Set typography style from discovered fonts
  if (discovery.fonts.headings) {
    inputs.typographyStyle = inferTypographyStyle(discovery.fonts.headings);
  }

  return inputs;
}

/**
 * Extract company name from page title
 * Common patterns: "Company - Tagline", "Company | Description", "Company: Subtitle"
 */
function extractCompanyName(title: string): string | null {
  // Try splitting by common separators (ordered by specificity)
  const separators = [' – ', ' — ', ' - ', ' | ', ' : ', ' · '];

  for (const sep of separators) {
    if (title.includes(sep)) {
      const parts = title.split(sep);
      // Company name is usually the first part
      const name = parts[0].trim();
      if (name.length > 1 && name.length < 50) {
        return name;
      }
    }
  }

  // If no separator, use the whole title if reasonable length
  if (title.length > 1 && title.length < 50) {
    return title;
  }

  return null;
}

/**
 * Infer color mood (warm/cool/neutral) from a hex color
 */
export function inferColorMood(hex: string): 'warm' | 'cool' | 'neutral' {
  const { h, s } = hexToHsl(hex);

  // Low saturation = neutral
  if (s < 15) {
    return 'neutral';
  }

  // Warm colors: red, orange, yellow (0-60 and 330-360)
  if ((h >= 0 && h <= 60) || h >= 330) {
    return 'warm';
  }

  // Cool colors: blue, green, purple (180-330)
  if (h >= 180 && h < 330) {
    return 'cool';
  }

  // In-between (60-180) could go either way, lean cool for greens
  if (h > 60 && h < 180) {
    return h < 120 ? 'warm' : 'cool';
  }

  return 'neutral';
}

/**
 * Infer color brightness from a hex color
 */
export function inferColorBrightness(hex: string): 'vibrant' | 'muted' | 'dark' {
  const { s, l } = hexToHsl(hex);

  // Dark colors (low lightness)
  if (l < 30) {
    return 'dark';
  }

  // Muted colors (low saturation or very high lightness)
  if (s < 40 || l > 80) {
    return 'muted';
  }

  // Vibrant (high saturation, medium lightness)
  return 'vibrant';
}

/**
 * Infer typography style from font name
 */
export function inferTypographyStyle(
  fontFamily: string
): 'modern' | 'classic' | 'playful' | 'technical' {
  const font = fontFamily.toLowerCase();

  // Technical/monospace fonts
  const technicalFonts = [
    'mono', 'code', 'fira', 'consolas', 'menlo', 'courier', 'ibm plex mono',
    'jetbrains', 'source code', 'roboto mono', 'sf mono', 'ubuntu mono'
  ];
  if (technicalFonts.some((f) => font.includes(f))) {
    return 'technical';
  }

  // Classic/serif fonts
  const classicFonts = [
    'georgia', 'times', 'serif', 'merriweather', 'playfair', 'lora',
    'crimson', 'palatino', 'garamond', 'baskerville', 'charter', 'spectral'
  ];
  if (classicFonts.some((f) => font.includes(f))) {
    return 'classic';
  }

  // Playful/rounded fonts
  const playfulFonts = [
    'comic', 'quicksand', 'poppins', 'nunito', 'pacifico', 'lobster',
    'varela', 'comfortaa', 'fredoka', 'baloo', 'chewy', 'bangers'
  ];
  if (playfulFonts.some((f) => font.includes(f))) {
    return 'playful';
  }

  // Modern (default for common sans-serif fonts)
  const modernFonts = [
    'inter', 'sf pro', 'helvetica', 'arial', 'roboto', 'open sans',
    'lato', 'source sans', 'work sans', 'dm sans', 'manrope', 'outfit'
  ];
  if (modernFonts.some((f) => font.includes(f))) {
    return 'modern';
  }

  // Default to modern for unknown fonts
  return 'modern';
}

/**
 * Convert hex color to HSL values
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  const h = hex.replace('#', '');

  // Parse RGB
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let hue = 0;
  let sat = 0;

  if (max !== min) {
    const d = max - min;
    sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        hue = ((b - r) / d + 2) / 6;
        break;
      case b:
        hue = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(hue * 360),
    s: Math.round(sat * 100),
    l: Math.round(l * 100),
  };
}
