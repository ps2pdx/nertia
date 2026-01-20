import { BrandSystem } from '@/types/brand-system';
import {
  Generator,
  SlideshowOptions,
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

interface SlideConfig {
  id: string;
  title: string;
  content: (tokens: BrandSystem, mode: ColorMode) => string;
}

function getSlideConfigs(tokens: BrandSystem, mode: ColorMode): SlideConfig[] {
  const copy = getBrandCopy(tokens);
  const brandName = tokens.metadata?.name || 'Brand';

  return [
    {
      id: 'title',
      title: 'Title',
      content: () => `
        <div class="slide-center">
          <h1 class="slide-title" style="font-size: 72px;">${escapeHtml(brandName)}</h1>
          <p class="slide-subtitle">Brand Guidelines</p>
          <p class="slide-meta">v${tokens.metadata?.version || '2.0.0'}</p>
        </div>
      `,
    },
    {
      id: 'mission',
      title: 'Mission',
      content: () => `
        <div class="slide-content">
          <h2 class="slide-heading">Our Mission</h2>
          ${copy.coreMessage ? `<blockquote class="slide-quote">"${escapeHtml(copy.coreMessage)}"</blockquote>` : ''}
          <div class="personality-grid">
            ${(tokens.voiceAndTone.personality || []).map(trait => `
              <div class="personality-item">${escapeHtml(trait)}</div>
            `).join('')}
          </div>
        </div>
      `,
    },
    {
      id: 'colors',
      title: 'Colors',
      content: () => {
        const colors = [
          { name: 'Background', value: tokens.colors.background[mode] },
          { name: 'Foreground', value: tokens.colors.foreground[mode] },
          { name: 'Accent', value: tokens.colors.accent[mode] },
          { name: 'Muted', value: tokens.colors.muted[mode] },
          { name: 'Success', value: tokens.colors.success[mode] },
          { name: 'Warning', value: tokens.colors.warning[mode] },
          { name: 'Error', value: tokens.colors.error[mode] },
        ];
        return `
          <div class="slide-content">
            <h2 class="slide-heading">Color Palette</h2>
            <div class="color-grid">
              ${colors.map(c => `
                <div class="color-card">
                  <div class="color-swatch" style="background: ${c.value};"></div>
                  <p class="color-name">${c.name}</p>
                  <p class="color-value">${c.value}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      },
    },
    {
      id: 'typography',
      title: 'Typography',
      content: () => {
        const displayFont = (tokens.typography.fontFamily.display || tokens.typography.fontFamily.sans).split(',')[0].replace(/["']/g, '');
        const bodyFont = (tokens.typography.fontFamily.body || tokens.typography.fontFamily.sans).split(',')[0].replace(/["']/g, '');
        return `
          <div class="slide-content">
            <h2 class="slide-heading">Typography</h2>
            <div class="type-showcase">
              <div class="type-family">
                <p class="type-label">Display</p>
                <p class="type-sample" style="font-family: var(--font-display); font-size: 48px;">${displayFont}</p>
                <p class="type-chars" style="font-family: var(--font-display);">Aa Bb Cc 123</p>
              </div>
              <div class="type-family">
                <p class="type-label">Body</p>
                <p class="type-sample" style="font-family: var(--font-body); font-size: 36px;">${bodyFont}</p>
                <p class="type-chars" style="font-family: var(--font-body);">Aa Bb Cc 123</p>
              </div>
            </div>
          </div>
        `;
      },
    },
    {
      id: 'components',
      title: 'Components',
      content: () => `
        <div class="slide-content">
          <h2 class="slide-heading">UI Components</h2>
          <div class="component-showcase">
            <div class="component-group">
              <p class="component-label">Buttons</p>
              <div class="component-row">
                <button class="btn btn-primary">Primary</button>
                <button class="btn btn-secondary">Secondary</button>
                <button class="btn btn-outline">Outline</button>
              </div>
            </div>
            <div class="component-group">
              <p class="component-label">Border Radius</p>
              <div class="radius-showcase">
                ${['sm', 'md', 'lg', 'full'].map(key => {
                  const value = tokens.borders.radius[key as keyof typeof tokens.borders.radius];
                  if (typeof value !== 'string') return '';
                  return `
                    <div class="radius-item">
                      <div class="radius-box" style="border-radius: ${value};"></div>
                      <p class="radius-label">${key}</p>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>
      `,
    },
    {
      id: 'examples',
      title: 'Examples',
      content: () => `
        <div class="slide-content">
          <h2 class="slide-heading">Copy Examples</h2>
          <div class="examples-grid">
            <div class="example-section">
              <p class="example-label">Headlines</p>
              ${copy.headlines.slice(0, 3).map(h => `<p class="example-text headline">${escapeHtml(h)}</p>`).join('')}
            </div>
            <div class="example-section">
              <p class="example-label">Call-to-Actions</p>
              <div class="cta-examples">
                ${copy.ctas.slice(0, 3).map(c => `<span class="cta-pill">${escapeHtml(c)}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
      `,
    },
    {
      id: 'contact',
      title: 'Contact',
      content: () => `
        <div class="slide-center">
          <h2 class="slide-heading" style="font-size: 48px;">Thank You</h2>
          <p class="slide-subtitle">${escapeHtml(brandName)} Brand Guidelines</p>
          <p class="slide-meta" style="margin-top: 32px;">Generated by Nertia Brand Generator</p>
        </div>
      `,
    },
  ];
}

function generateSlideshowHtml(
  tokens: BrandSystem,
  mode: ColorMode,
  options: SlideshowOptions
): string {
  const fontsLink = generateGoogleFontsLink(tokens);
  const cssVars = generateInlineStyles(tokens, mode);
  const brandName = tokens.metadata?.name || 'Brand';

  const slideIds = options.slides || ['title', 'mission', 'colors', 'typography', 'components', 'examples', 'contact'];
  const allSlides = getSlideConfigs(tokens, mode);
  const slides = slideIds
    .map(id => allSlides.find(s => s.id === id))
    .filter((s): s is SlideConfig => s !== undefined);

  // Aspect ratio dimensions
  const aspectRatio = options.aspectRatio || '16:9';
  const width = aspectRatio === '16:9' ? 1920 : aspectRatio === '4:3' ? 1600 : 1200;
  const height = aspectRatio === '16:9' ? 1080 : aspectRatio === '4:3' ? 1200 : 1200;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(brandName)} - Brand Slideshow</title>
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
      background: #1a1a1a;
      color: var(--foreground);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
    }

    .slideshow-nav {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      background: rgba(0,0,0,0.8);
      padding: 8px 16px;
      border-radius: 24px;
      z-index: 100;
    }

    .slideshow-nav button {
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(255,255,255,0.2);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      font-size: 14px;
    }

    .slideshow-nav button:hover {
      background: var(--accent);
    }

    .slideshow-nav .nav-dots {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 0 8px;
    }

    .slideshow-nav .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      cursor: pointer;
    }

    .slideshow-nav .dot.active {
      background: var(--accent);
    }

    .slides-container {
      display: flex;
      flex-direction: column;
      gap: 40px;
      margin-bottom: 80px;
    }

    .slide {
      width: ${width}px;
      height: ${height}px;
      background: var(--background);
      position: relative;
      overflow: hidden;
      transform: scale(0.5);
      transform-origin: top center;
      border-radius: 8px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    @media (max-width: 1000px) {
      .slide {
        transform: scale(0.35);
      }
    }

    .slide-inner {
      width: 100%;
      height: 100%;
      padding: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .slide-number {
      position: absolute;
      bottom: 40px;
      right: 40px;
      font-size: 14px;
      color: var(--muted);
    }

    .slide-center {
      text-align: center;
    }

    .slide-title {
      font-family: var(--font-display), system-ui, sans-serif;
      font-size: 96px;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 24px;
    }

    .slide-subtitle {
      font-size: 32px;
      color: var(--muted);
    }

    .slide-meta {
      font-size: 18px;
      color: var(--muted);
      margin-top: 16px;
    }

    .slide-heading {
      font-family: var(--font-display), system-ui, sans-serif;
      font-size: 56px;
      font-weight: 700;
      margin-bottom: 48px;
      color: var(--accent);
    }

    .slide-quote {
      font-size: 36px;
      font-style: italic;
      line-height: 1.4;
      max-width: 80%;
      margin-bottom: 48px;
      padding-left: 32px;
      border-left: 4px solid var(--accent);
    }

    .personality-grid {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .personality-item {
      padding: 16px 32px;
      background: var(--accent);
      color: white;
      border-radius: var(--radius-full);
      font-size: 20px;
      font-weight: 500;
    }

    .color-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .color-card {
      text-align: center;
    }

    .color-swatch {
      width: 100%;
      height: 100px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--card-border);
      margin-bottom: 12px;
    }

    .color-name {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .color-value {
      font-size: 14px;
      color: var(--muted);
      font-family: var(--font-mono), monospace;
    }

    .type-showcase {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
    }

    .type-family {
      padding: 40px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-lg);
    }

    .type-label {
      font-size: 14px;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 16px;
    }

    .type-sample {
      font-weight: 600;
      margin-bottom: 16px;
    }

    .type-chars {
      font-size: 24px;
      color: var(--muted);
    }

    .component-showcase {
      display: flex;
      flex-direction: column;
      gap: 48px;
    }

    .component-label {
      font-size: 16px;
      color: var(--muted);
      margin-bottom: 16px;
    }

    .component-row {
      display: flex;
      gap: 16px;
    }

    .btn {
      padding: 16px 32px;
      font-size: 18px;
      font-weight: 500;
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
    }

    .btn-primary {
      background: var(--accent);
      color: white;
    }

    .btn-secondary {
      background: var(--card-bg);
      color: var(--foreground);
      border: 1px solid var(--card-border);
    }

    .btn-outline {
      background: transparent;
      color: var(--foreground);
      border: 1px solid var(--card-border);
    }

    .radius-showcase {
      display: flex;
      gap: 24px;
    }

    .radius-item {
      text-align: center;
    }

    .radius-box {
      width: 60px;
      height: 60px;
      background: var(--accent);
      margin-bottom: 8px;
    }

    .radius-label {
      font-size: 14px;
      color: var(--muted);
    }

    .examples-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
    }

    .example-label {
      font-size: 16px;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 24px;
    }

    .example-text {
      font-size: 24px;
      margin-bottom: 16px;
      line-height: 1.4;
    }

    .example-text.headline {
      font-family: var(--font-display), system-ui, sans-serif;
      font-weight: 600;
    }

    .cta-examples {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .cta-pill {
      padding: 12px 24px;
      background: var(--accent);
      color: white;
      border-radius: var(--radius-full);
      font-size: 16px;
    }

    .instructions {
      background: #2a2a2a;
      padding: 24px;
      border-radius: 8px;
      color: #aaa;
      font-size: 14px;
      max-width: 600px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="slides-container">
    ${slides.map((slide, i) => `
      <div class="slide" id="slide-${i + 1}">
        <div class="slide-inner">
          ${slide.content(tokens, mode)}
        </div>
        <div class="slide-number">${i + 1} / ${slides.length}</div>
      </div>
    `).join('')}
  </div>

  <div class="instructions">
    <strong>Slideshow Preview</strong><br>
    Slides shown at 50% scale. For presentation: Open in browser, press F11 for fullscreen,
    or use browser print to PDF for each slide.
  </div>

  <script>
    // Simple keyboard navigation
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        currentSlide = Math.min(currentSlide + 1, slides.length - 1);
        slides[currentSlide].scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (e.key === 'ArrowLeft') {
        currentSlide = Math.max(currentSlide - 1, 0);
        slides[currentSlide].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  </script>
</body>
</html>`;
}

export const slideshowGenerator: Generator<SlideshowOptions> = {
  format: 'slideshow',
  name: 'Slideshow',
  description: 'Multi-slide brand presentation deck',
  icon: 'Presentation',

  async generate(tokens: BrandSystem, options: SlideshowOptions = {}): Promise<ExportResult> {
    const brandName = tokens.metadata?.name || 'brand';
    const slug = brandName.toLowerCase().replace(/\s+/g, '-');
    const mode: ColorMode = options.colorMode === 'dark' ? 'dark' : 'light';

    const files = [];

    if (options.colorMode === 'both') {
      files.push({
        filename: `${slug}-slides-light.html`,
        content: generateSlideshowHtml(tokens, 'light', options),
        type: 'html' as const,
      });
      files.push({
        filename: `${slug}-slides-dark.html`,
        content: generateSlideshowHtml(tokens, 'dark', options),
        type: 'html' as const,
      });
    } else {
      files.push({
        filename: `${slug}-slides.html`,
        content: generateSlideshowHtml(tokens, mode, options),
        type: 'html' as const,
      });
    }

    return {
      format: 'slideshow',
      files,
      metadata: {
        generatedAt: getTimestamp(),
        brandName,
        version: tokens.metadata?.version || '2.0.0',
      },
    };
  },
};

export default slideshowGenerator;
