import { DiscoveryInputs } from './brand-system';

// Discovered website data before mapping to DiscoveryInputs
export interface WebsiteDiscoveryResult {
  url: string;
  discoveredAt: string;

  // Metadata
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;

  // Brand colors extracted
  colors: {
    primary?: string; // Most dominant color
    secondary?: string; // Second most common
    accent?: string; // Accent/CTA color if detected
    background?: string; // Page background
    text?: string; // Primary text color
  };

  // Typography
  fonts: {
    headings?: string; // H1/H2 font-family
    body?: string; // Body font-family
  };

  // Social links
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };

  // Confidence scores (0-1) for extracted data
  confidence: {
    colors: number;
    fonts: number;
    description: number;
  };
}

// API request/response types
export interface DiscoverWebsiteRequest {
  url: string;
}

export interface DiscoverWebsiteResponse {
  success: boolean;
  data?: WebsiteDiscoveryResult;
  suggestedInputs?: Partial<DiscoveryInputs>;
  error?: string;
  errorCode?: 'INVALID_URL' | 'FETCH_FAILED' | 'PARSE_ERROR' | 'TIMEOUT' | 'BLOCKED';
}
