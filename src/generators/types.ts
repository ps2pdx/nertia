import { BrandSystem } from '@/types/brand-system';

// ============================================================================
// Export Format Types
// ============================================================================

export type ExportFormat =
  | 'email-template'
  | 'one-sheeter'
  | 'landing-page'
  | 'social-media'
  | 'slideshow';

export interface ExportFile {
  filename: string;
  content: string;
  type: 'html' | 'css' | 'json' | 'txt';
}

export interface ExportResult {
  format: ExportFormat;
  files: ExportFile[];
  metadata: {
    generatedAt: string;
    brandName: string;
    version: string;
  };
}

// ============================================================================
// Generator Options
// ============================================================================

export interface GeneratorOptions {
  colorMode?: 'light' | 'dark' | 'both';
  includeAnimations?: boolean;
  customCopy?: {
    headline?: string;
    subheadline?: string;
    cta?: string;
    description?: string;
  };
}

export interface EmailTemplateOptions extends GeneratorOptions {
  templateType?: 'welcome' | 'newsletter' | 'announcement' | 'promotional';
}

export interface OneSheeterOptions extends GeneratorOptions {
  pageSize?: 'letter' | 'a4';
  orientation?: 'portrait' | 'landscape';
}

export interface LandingPageOptions extends GeneratorOptions {
  sections?: Array<'hero' | 'features' | 'testimonials' | 'pricing' | 'cta' | 'footer'>;
}

export interface SocialMediaOptions extends GeneratorOptions {
  platforms?: Array<'og' | 'twitter' | 'linkedin' | 'instagram'>;
  size?: {
    width: number;
    height: number;
  };
}

export interface SlideshowOptions extends GeneratorOptions {
  slides?: Array<'title' | 'mission' | 'colors' | 'typography' | 'components' | 'examples' | 'contact'>;
  aspectRatio?: '16:9' | '4:3' | '1:1';
}

// ============================================================================
// Generator Interface
// ============================================================================

export interface Generator<T extends GeneratorOptions = GeneratorOptions> {
  format: ExportFormat;
  name: string;
  description: string;
  icon: string;
  generate(tokens: BrandSystem, options?: T): Promise<ExportResult>;
}

// ============================================================================
// Generator Registry Type
// ============================================================================

export type GeneratorRegistry = {
  [K in ExportFormat]: Generator;
};
