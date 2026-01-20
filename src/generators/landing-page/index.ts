import { BrandSystem } from '@/types/brand-system';
import {
  Generator,
  LandingPageOptions,
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

function generateLandingPageHtml(
  tokens: BrandSystem,
  mode: ColorMode,
  options: LandingPageOptions
): string {
  const fontsLink = generateGoogleFontsLink(tokens);
  const cssVars = generateInlineStyles(tokens, mode);
  const copy = getBrandCopy(tokens);
  const brandName = tokens.metadata?.name || 'Brand';

  const headline = options.customCopy?.headline || copy.headlines[0] || `Welcome to ${brandName}`;
  const subheadline = options.customCopy?.subheadline || copy.descriptions[0] || 'The future of innovation starts here.';
  const ctaText = options.customCopy?.cta || copy.ctas[0] || 'Get Started';

  const sections = options.sections || ['hero', 'features', 'cta', 'footer'];

  // Feature items from voice/tone
  const features = [
    {
      title: tokens.voiceAndTone.personality?.[0] || 'Innovation',
      description: copy.descriptions[0] || 'Leading the way with cutting-edge solutions.',
    },
    {
      title: tokens.voiceAndTone.personality?.[1] || 'Quality',
      description: copy.descriptions[1] || 'Excellence in everything we do.',
    },
    {
      title: tokens.voiceAndTone.personality?.[2] || 'Trust',
      description: copy.descriptions[2] || 'Building lasting relationships.',
    },
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(brandName)}</title>
  <meta name="description" content="${escapeHtml(subheadline)}">
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
      background: var(--background);
      color: var(--foreground);
      line-height: 1.6;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Navigation */
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: var(--background);
      border-bottom: 1px solid var(--card-border);
      backdrop-filter: blur(8px);
    }

    .nav-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
    }

    .nav-brand {
      font-family: var(--font-display), system-ui, sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: var(--foreground);
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 32px;
      list-style: none;
    }

    .nav-links a {
      color: var(--muted);
      text-decoration: none;
      font-size: 14px;
      transition: color 0.2s;
    }

    .nav-links a:hover {
      color: var(--foreground);
    }

    .nav-cta {
      display: inline-block;
      padding: 8px 20px;
      background: var(--accent);
      color: white;
      text-decoration: none;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 500;
      transition: opacity 0.2s;
    }

    .nav-cta:hover {
      opacity: 0.9;
    }

    /* Hero Section */
    .hero {
      padding: 160px 0 100px;
      text-align: center;
    }

    .hero h1 {
      font-family: var(--font-display), system-ui, sans-serif;
      font-size: clamp(36px, 6vw, 64px);
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: 24px;
      color: var(--foreground);
    }

    .hero p {
      font-size: 20px;
      color: var(--muted);
      max-width: 600px;
      margin: 0 auto 40px;
    }

    .hero-cta {
      display: inline-flex;
      align-items: center;
      gap: 16px;
    }

    .btn-primary {
      display: inline-block;
      padding: 16px 32px;
      background: var(--accent);
      color: white;
      text-decoration: none;
      border-radius: var(--radius-md);
      font-size: 16px;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }

    .btn-secondary {
      display: inline-block;
      padding: 16px 32px;
      background: transparent;
      color: var(--foreground);
      text-decoration: none;
      border: 1px solid var(--card-border);
      border-radius: var(--radius-md);
      font-size: 16px;
      font-weight: 500;
      transition: background 0.2s, border-color 0.2s;
    }

    .btn-secondary:hover {
      background: var(--card-bg);
      border-color: var(--foreground);
    }

    /* Features Section */
    .features {
      padding: 100px 0;
      background: var(--card-bg);
    }

    .features-header {
      text-align: center;
      margin-bottom: 64px;
    }

    .features-header h2 {
      font-family: var(--font-display), system-ui, sans-serif;
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .features-header p {
      color: var(--muted);
      max-width: 500px;
      margin: 0 auto;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
    }

    .feature-card {
      padding: 32px;
      background: var(--background);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-lg);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.1);
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      background: var(--accent);
      border-radius: var(--radius-md);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .feature-icon svg {
      width: 24px;
      height: 24px;
      color: white;
    }

    .feature-card h3 {
      font-family: var(--font-display), system-ui, sans-serif;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .feature-card p {
      color: var(--muted);
      font-size: 15px;
      line-height: 1.6;
    }

    /* CTA Section */
    .cta-section {
      padding: 100px 0;
      text-align: center;
      background: linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 80%, black) 100%);
      color: white;
    }

    .cta-section h2 {
      font-family: var(--font-display), system-ui, sans-serif;
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .cta-section p {
      opacity: 0.9;
      margin-bottom: 32px;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }

    .btn-white {
      display: inline-block;
      padding: 16px 32px;
      background: white;
      color: var(--accent);
      text-decoration: none;
      border-radius: var(--radius-md);
      font-size: 16px;
      font-weight: 600;
      transition: transform 0.2s;
    }

    .btn-white:hover {
      transform: translateY(-2px);
    }

    /* Footer */
    .footer {
      padding: 64px 0;
      background: var(--background);
      border-top: 1px solid var(--card-border);
    }

    .footer-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-brand {
      font-family: var(--font-display), system-ui, sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--foreground);
    }

    .footer-links {
      display: flex;
      gap: 24px;
      list-style: none;
    }

    .footer-links a {
      color: var(--muted);
      text-decoration: none;
      font-size: 14px;
    }

    .footer-links a:hover {
      color: var(--foreground);
    }

    .footer-copy {
      font-size: 14px;
      color: var(--muted);
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }

      .hero {
        padding: 120px 0 80px;
      }

      .hero-cta {
        flex-direction: column;
      }

      .footer-inner {
        flex-direction: column;
        gap: 24px;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <!-- Navigation -->
  <nav class="nav">
    <div class="container nav-inner">
      <a href="#" class="nav-brand">${escapeHtml(brandName)}</a>
      <ul class="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <a href="#" class="nav-cta">${escapeHtml(ctaText)}</a>
    </div>
  </nav>

  ${sections.includes('hero') ? `
  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <h1>${escapeHtml(headline)}</h1>
      <p>${escapeHtml(subheadline)}</p>
      <div class="hero-cta">
        <a href="#" class="btn-primary">${escapeHtml(ctaText)}</a>
        <a href="#" class="btn-secondary">Learn More</a>
      </div>
    </div>
  </section>
  ` : ''}

  ${sections.includes('features') ? `
  <!-- Features Section -->
  <section id="features" class="features">
    <div class="container">
      <div class="features-header">
        <h2>Why Choose ${escapeHtml(brandName)}?</h2>
        <p>Discover what makes us different.</p>
      </div>
      <div class="features-grid">
        ${features.map(f => `
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h3>${escapeHtml(f.title)}</h3>
          <p>${escapeHtml(f.description)}</p>
        </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  ${sections.includes('cta') ? `
  <!-- CTA Section -->
  <section class="cta-section">
    <div class="container">
      <h2>Ready to Get Started?</h2>
      <p>${escapeHtml(copy.descriptions[0] || 'Join thousands of satisfied customers today.')}</p>
      <a href="#" class="btn-white">${escapeHtml(ctaText)}</a>
    </div>
  </section>
  ` : ''}

  ${sections.includes('footer') ? `
  <!-- Footer -->
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-brand">${escapeHtml(brandName)}</div>
      <ul class="footer-links">
        <li><a href="#">Privacy</a></li>
        <li><a href="#">Terms</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
      <p class="footer-copy">&copy; ${new Date().getFullYear()} ${escapeHtml(brandName)}. All rights reserved.</p>
    </div>
  </footer>
  ` : ''}
</body>
</html>`;
}

function generateLandingPageCss(tokens: BrandSystem, mode: ColorMode): string {
  const cssVars = generateInlineStyles(tokens, mode);
  return `:root {
  ${cssVars}
}

/* Copy styles from the HTML for external CSS file */
`;
}

export const landingPageGenerator: Generator<LandingPageOptions> = {
  format: 'landing-page',
  name: 'Landing Page',
  description: 'Complete landing page template with hero, features, and CTA',
  icon: 'Layout',

  async generate(tokens: BrandSystem, options: LandingPageOptions = {}): Promise<ExportResult> {
    const brandName = tokens.metadata?.name || 'brand';
    const slug = brandName.toLowerCase().replace(/\s+/g, '-');
    const mode: ColorMode = options.colorMode === 'dark' ? 'dark' : 'light';

    const files = [];

    if (options.colorMode === 'both') {
      files.push({
        filename: `${slug}-landing-light.html`,
        content: generateLandingPageHtml(tokens, 'light', options),
        type: 'html' as const,
      });
      files.push({
        filename: `${slug}-landing-dark.html`,
        content: generateLandingPageHtml(tokens, 'dark', options),
        type: 'html' as const,
      });
    } else {
      files.push({
        filename: `${slug}-landing.html`,
        content: generateLandingPageHtml(tokens, mode, options),
        type: 'html' as const,
      });
    }

    // Also include a separate CSS file
    files.push({
      filename: `${slug}-landing.css`,
      content: generateLandingPageCss(tokens, mode),
      type: 'css' as const,
    });

    return {
      format: 'landing-page',
      files,
      metadata: {
        generatedAt: getTimestamp(),
        brandName,
        version: tokens.metadata?.version || '2.0.0',
      },
    };
  },
};

export default landingPageGenerator;
