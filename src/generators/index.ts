import { BrandSystem } from '@/types/brand-system';
import {
  ExportFormat,
  ExportResult,
  GeneratorOptions,
  Generator,
  GeneratorRegistry,
} from './types';

// Import all generators
import { emailTemplateGenerator } from './email-template';
import { oneSheeterGenerator } from './one-sheeter';
import { landingPageGenerator } from './landing-page';
import { socialMediaGenerator } from './social-media';
import { slideshowGenerator } from './slideshow';

// ============================================================================
// Generator Registry
// ============================================================================

export const generators: GeneratorRegistry = {
  'email-template': emailTemplateGenerator,
  'one-sheeter': oneSheeterGenerator,
  'landing-page': landingPageGenerator,
  'social-media': socialMediaGenerator,
  'slideshow': slideshowGenerator,
};

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Get a generator by format
 */
export function getGenerator(format: ExportFormat): Generator | undefined {
  return generators[format];
}

/**
 * Get all available generators
 */
export function getAvailableGenerators(): Generator[] {
  return Object.values(generators);
}

/**
 * Check if a format is valid
 */
export function isValidFormat(format: string): format is ExportFormat {
  return format in generators;
}

/**
 * Generate export for a given format
 */
export async function generateExport(
  format: ExportFormat,
  tokens: BrandSystem,
  options?: GeneratorOptions
): Promise<ExportResult> {
  const generator = getGenerator(format);

  if (!generator) {
    throw new Error(`Unknown export format: ${format}`);
  }

  return generator.generate(tokens, options);
}

// ============================================================================
// Re-exports
// ============================================================================

export * from './types';
export { emailTemplateGenerator } from './email-template';
export { oneSheeterGenerator } from './one-sheeter';
export { landingPageGenerator } from './landing-page';
export { socialMediaGenerator } from './social-media';
export { slideshowGenerator } from './slideshow';
