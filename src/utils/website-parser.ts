import * as cheerio from 'cheerio';
import { WebsiteDiscoveryResult } from '@/types/website-discovery';

/**
 * Parse website HTML and extract brand-related information
 */
export async function parseWebsiteHtml(
  html: string,
  url: string
): Promise<WebsiteDiscoveryResult> {
  const $ = cheerio.load(html);

  // Extract meta tags
  const title = $('title').first().text().trim() || $('meta[property="og:title"]').attr('content');
  const description =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content');
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDescription = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');

  // Extract colors from inline styles and style tags
  const allStyles = extractAllStyles($, html);
  const extractedColors = extractColorsFromCss(allStyles);

  // Extract fonts from styles
  const extractedFonts = extractFontsFromCss(allStyles);

  // Find social links
  const socialLinks = findSocialLinks($);

  // Calculate confidence scores
  const confidence = {
    colors: extractedColors.length > 0 ? Math.min(extractedColors.length / 5, 1) : 0,
    fonts: extractedFonts.length > 0 ? Math.min(extractedFonts.length / 2, 1) : 0,
    description: description ? 1 : ogDescription ? 0.8 : 0,
  };

  // Categorize colors by their likely purpose
  const categorizedColors = categorizeColors(extractedColors);

  return {
    url,
    discoveredAt: new Date().toISOString(),
    title: title || undefined,
    description: description || undefined,
    ogTitle: ogTitle || undefined,
    ogDescription: ogDescription || undefined,
    ogImage: ogImage || undefined,
    colors: categorizedColors,
    fonts: {
      headings: extractedFonts[0] || undefined,
      body: extractedFonts[1] || extractedFonts[0] || undefined,
    },
    socialLinks,
    confidence,
  };
}

/**
 * Extract all CSS from the page (inline styles, style tags, linked stylesheets content if available)
 */
function extractAllStyles($: cheerio.CheerioAPI, html: string): string {
  const styles: string[] = [];

  // Get all <style> tag contents
  $('style').each((_, el) => {
    const content = $(el).html();
    if (content) styles.push(content);
  });

  // Get inline styles from elements
  $('[style]').each((_, el) => {
    const style = $(el).attr('style');
    if (style) styles.push(style);
  });

  // Look for CSS custom properties in :root
  const rootMatch = html.match(/:root\s*\{([^}]+)\}/g);
  if (rootMatch) {
    styles.push(...rootMatch);
  }

  return styles.join('\n');
}

/**
 * Extract hex and rgb colors from CSS text
 */
export function extractColorsFromCss(cssText: string): string[] {
  const colors: Map<string, number> = new Map();

  // Match hex colors (3, 4, 6, or 8 digits)
  const hexPattern = /#([0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})\b/g;
  let match;
  while ((match = hexPattern.exec(cssText)) !== null) {
    const hex = normalizeHex(match[0]);
    if (hex && !isGrayScale(hex) && !isNearWhiteOrBlack(hex)) {
      colors.set(hex, (colors.get(hex) || 0) + 1);
    }
  }

  // Match rgb/rgba colors
  const rgbPattern = /rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/g;
  while ((match = rgbPattern.exec(cssText)) !== null) {
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    const hex = rgbToHex(r, g, b);
    if (!isGrayScale(hex) && !isNearWhiteOrBlack(hex)) {
      colors.set(hex, (colors.get(hex) || 0) + 1);
    }
  }

  // Sort by frequency and return top colors
  return [...colors.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([color]) => color);
}

/**
 * Extract font-family declarations from CSS
 */
export function extractFontsFromCss(cssText: string): string[] {
  const fonts: Map<string, number> = new Map();

  // Match font-family declarations
  const fontPattern = /font-family\s*:\s*([^;}\n]+)/gi;
  let match;
  while ((match = fontPattern.exec(cssText)) !== null) {
    const fontValue = match[1].trim();
    // Extract the first font in the stack (primary font)
    const primaryFont = fontValue
      .split(',')[0]
      .trim()
      .replace(/["']/g, '');

    // Skip generic font families
    const genericFonts = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'inherit', 'initial'];
    if (!genericFonts.includes(primaryFont.toLowerCase())) {
      fonts.set(primaryFont, (fonts.get(primaryFont) || 0) + 1);
    }
  }

  // Sort by frequency
  return [...fonts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([font]) => font);
}

/**
 * Find social media links on the page
 */
export function findSocialLinks($: cheerio.CheerioAPI): WebsiteDiscoveryResult['socialLinks'] {
  const socialLinks: WebsiteDiscoveryResult['socialLinks'] = {};

  const patterns = {
    twitter: /(?:twitter\.com|x\.com)\/([^/?]+)/i,
    linkedin: /linkedin\.com\/(?:company|in)\/([^/?]+)/i,
    github: /github\.com\/([^/?]+)/i,
    instagram: /instagram\.com\/([^/?]+)/i,
  };

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;

    for (const [platform, pattern] of Object.entries(patterns)) {
      if (pattern.test(href) && !socialLinks[platform as keyof typeof socialLinks]) {
        socialLinks[platform as keyof typeof socialLinks] = href;
      }
    }
  });

  return socialLinks;
}

/**
 * Categorize extracted colors by their likely purpose
 */
function categorizeColors(colors: string[]): WebsiteDiscoveryResult['colors'] {
  if (colors.length === 0) {
    return {};
  }

  // First color is likely primary (most frequent)
  const primary = colors[0];

  // Second most frequent is likely secondary
  const secondary = colors[1];

  // Find a potentially "accent" color (more saturated or different hue)
  const accent = colors.find((c, i) => i > 1 && isHighSaturation(c)) || colors[2];

  return {
    primary,
    secondary,
    accent,
  };
}

// Helper functions

function normalizeHex(hex: string): string {
  // Remove # and normalize to 6-digit hex
  let h = hex.replace('#', '').toLowerCase();

  // Convert 3-digit to 6-digit
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }

  // Handle 4-digit (with alpha) by ignoring alpha
  if (h.length === 4) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }

  // Handle 8-digit (with alpha) by taking first 6
  if (h.length === 8) {
    h = h.substring(0, 6);
  }

  return '#' + h;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

function isGrayScale(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Check if all channels are within 15 units of each other
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max - min < 15;
}

function isNearWhiteOrBlack(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const avg = (r + g + b) / 3;
  return avg < 20 || avg > 235; // Near black or near white
}

function isHighSaturation(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) return false;

  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  return s > 0.5; // Saturation > 50%
}
