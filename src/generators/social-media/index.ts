import { BrandSystem } from '@/types/brand-system';
import {
  Generator,
  SocialMediaOptions,
  ExportResult,
} from '../types';
import {
  generateInlineStyles,
  generateGoogleFontsLink,
  getBrandCopy,
  escapeHtml,
  getTimestamp,
} from '../base-generator';

type ColorMode = 'light' | 'dark';

interface SocialTemplate {
  name: string;
  width: number;
  height: number;
  description: string;
}

const SOCIAL_TEMPLATES: Record<string, SocialTemplate> = {
  og: {
    name: 'Open Graph',
    width: 1200,
    height: 630,
    description: 'Facebook, LinkedIn, Discord previews',
  },
  twitter: {
    name: 'Twitter Card',
    width: 1200,
    height: 600,
    description: 'Twitter/X post previews',
  },
  linkedin: {
    name: 'LinkedIn Banner',
    width: 1584,
    height: 396,
    description: 'LinkedIn profile/company banner',
  },
  instagram: {
    name: 'Instagram Post',
    width: 1080,
    height: 1080,
    description: 'Square format for Instagram feed',
  },
};

function generateSocialMediaHtml(
  tokens: BrandSystem,
  mode: ColorMode,
  template: SocialTemplate,
  options: SocialMediaOptions
): string {
  const fontsLink = generateGoogleFontsLink(tokens);
  const cssVars = generateInlineStyles(tokens, mode);
  const copy = getBrandCopy(tokens);
  const brandName = tokens.metadata?.name || 'Brand';

  const headline = options.customCopy?.headline || copy.headlines[0] || brandName;
  const description = options.customCopy?.description || copy.coreMessage || copy.descriptions[0] || '';

  // Adjust font sizes based on template dimensions
  const titleSize = template.height > 600 ? '64px' : template.height > 400 ? '48px' : '36px';
  const subtitleSize = template.height > 600 ? '24px' : template.height > 400 ? '20px' : '16px';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(brandName)} - ${template.name}</title>
  ${fontsLink ? `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontsLink}" rel="stylesheet">` : ''}
  <style>
    :root {
      ${cssVars}
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-body), system-ui, sans-serif;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 40px;
    }

    .social-card {
      width: ${template.width}px;
      height: ${template.height}px;
      background: var(--background);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: ${template.height > 600 ? '80px' : '48px'};
    }

    /* Accent gradient overlay */
    .social-card::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 50%;
      height: 100%;
      background: linear-gradient(135deg, transparent 0%, var(--accent) 100%);
      opacity: 0.1;
    }

    /* Decorative shapes */
    .shape-1 {
      position: absolute;
      top: -60px;
      right: -60px;
      width: 200px;
      height: 200px;
      background: var(--accent);
      border-radius: 50%;
      opacity: 0.3;
    }

    .shape-2 {
      position: absolute;
      bottom: -40px;
      left: 20%;
      width: 120px;
      height: 120px;
      background: var(--accent);
      border-radius: var(--radius-lg);
      opacity: 0.15;
      transform: rotate(45deg);
    }

    .content {
      position: relative;
      z-index: 1;
      max-width: ${template.width > 1200 ? '80%' : '90%'};
    }

    .brand-name {
      font-family: var(--font-display), system-ui, sans-serif;
      font-size: ${subtitleSize};
      font-weight: 600;
      color: var(--accent);
      margin-bottom: 16px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .title {
      font-family: var(--font-display), system-ui, sans-serif;
      font-size: ${titleSize};
      font-weight: 700;
      color: var(--foreground);
      line-height: 1.1;
      margin-bottom: 20px;
    }

    .description {
      font-size: ${subtitleSize};
      color: var(--muted);
      line-height: 1.5;
      max-width: 80%;
    }

    /* Bottom bar with brand colors */
    .brand-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 8px;
      background: var(--accent);
    }

    .meta-info {
      position: absolute;
      bottom: ${template.height > 600 ? '48px' : '32px'};
      right: ${template.height > 600 ? '48px' : '32px'};
      text-align: right;
    }

    .meta-info .url {
      font-size: 14px;
      color: var(--muted);
      font-family: var(--font-mono), monospace;
    }

    /* Screenshot instructions */
    .instructions {
      margin-top: 24px;
      padding: 16px;
      background: white;
      border-radius: 8px;
      font-size: 14px;
      color: #666;
      max-width: ${template.width}px;
    }
  </style>
</head>
<body>
  <div>
    <div class="social-card">
      <div class="shape-1"></div>
      <div class="shape-2"></div>

      <div class="content">
        <p class="brand-name">${escapeHtml(brandName)}</p>
        <h1 class="title">${escapeHtml(headline)}</h1>
        ${description ? `<p class="description">${escapeHtml(description)}</p>` : ''}
      </div>

      <div class="brand-bar"></div>
    </div>

    <div class="instructions">
      <strong>${template.name}</strong> (${template.width} × ${template.height}px)<br>
      ${template.description}<br><br>
      <em>To save: Right-click the card above → Save as image, or use browser screenshot tools.</em>
    </div>
  </div>
</body>
</html>`;
}

export const socialMediaGenerator: Generator<SocialMediaOptions> = {
  format: 'social-media',
  name: 'Social Media',
  description: 'OG images, Twitter cards, LinkedIn banners',
  icon: 'Share2',

  async generate(tokens: BrandSystem, options: SocialMediaOptions = {}): Promise<ExportResult> {
    const brandName = tokens.metadata?.name || 'brand';
    const slug = brandName.toLowerCase().replace(/\s+/g, '-');
    const mode: ColorMode = options.colorMode === 'dark' ? 'dark' : 'light';

    const platforms = options.platforms || ['og', 'twitter', 'linkedin', 'instagram'];
    const files = [];

    for (const platform of platforms) {
      const template = SOCIAL_TEMPLATES[platform];
      if (!template) continue;

      if (options.colorMode === 'both') {
        files.push({
          filename: `${slug}-${platform}-light.html`,
          content: generateSocialMediaHtml(tokens, 'light', template, options),
          type: 'html' as const,
        });
        files.push({
          filename: `${slug}-${platform}-dark.html`,
          content: generateSocialMediaHtml(tokens, 'dark', template, options),
          type: 'html' as const,
        });
      } else {
        files.push({
          filename: `${slug}-${platform}.html`,
          content: generateSocialMediaHtml(tokens, mode, template, options),
          type: 'html' as const,
        });
      }
    }

    return {
      format: 'social-media',
      files,
      metadata: {
        generatedAt: getTimestamp(),
        brandName,
        version: tokens.metadata?.version || '2.0.0',
      },
    };
  },
};

export default socialMediaGenerator;
