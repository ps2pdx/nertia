import { BrandSystem } from '@/types/brand-system';
import {
  Generator,
  OneSheeterOptions,
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

function generateOneSheeterHtml(
  tokens: BrandSystem,
  mode: ColorMode,
  options: OneSheeterOptions
): string {
  const fontsLink = generateGoogleFontsLink(tokens);
  const cssVars = generateInlineStyles(tokens, mode);
  const copy = getBrandCopy(tokens);
  const brandName = tokens.metadata?.name || 'Brand';

  // Page dimensions for print
  const pageWidth = options.pageSize === 'a4' ? '210mm' : '8.5in';
  const pageHeight = options.pageSize === 'a4' ? '297mm' : '11in';

  // Color swatches
  const colorSwatches = [
    { name: 'Background', color: tokens.colors.background[mode] },
    { name: 'Foreground', color: tokens.colors.foreground[mode] },
    { name: 'Accent', color: tokens.colors.accent[mode] },
    { name: 'Success', color: tokens.colors.success[mode] },
    { name: 'Warning', color: tokens.colors.warning[mode] },
    { name: 'Error', color: tokens.colors.error[mode] },
  ];

  // Type scale entries
  const typeScale = tokens.typography.scale
    ? Object.entries(tokens.typography.scale).slice(0, 5)
    : [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(brandName)} - Brand Guidelines</title>
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

    @page {
      size: ${pageWidth} ${pageHeight};
      margin: 0;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }

    body {
      font-family: var(--font-body), system-ui, sans-serif;
      background: var(--background);
      color: var(--foreground);
      line-height: 1.5;
    }

    .page {
      width: ${pageWidth};
      min-height: ${pageHeight};
      padding: 0.75in;
      margin: 0 auto;
      background: var(--background);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 2px solid var(--accent);
    }

    .brand-name {
      font-family: var(--font-display), system-ui, sans-serif;
      font-size: 32px;
      font-weight: 700;
      color: var(--foreground);
    }

    .version {
      font-size: 12px;
      color: var(--muted);
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .section {
      margin-bottom: 24px;
    }

    .section-title {
      font-family: var(--font-display), system-ui, sans-serif;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--accent);
      margin-bottom: 12px;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--card-border);
    }

    .color-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .color-swatch {
      text-align: center;
    }

    .color-swatch .swatch {
      width: 100%;
      height: 40px;
      border-radius: var(--radius-md);
      border: 1px solid var(--card-border);
      margin-bottom: 4px;
    }

    .color-swatch .name {
      font-size: 10px;
      color: var(--muted);
    }

    .color-swatch .value {
      font-size: 9px;
      font-family: var(--font-mono), monospace;
      color: var(--muted);
    }

    .type-scale {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .type-item {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      padding: 4px 0;
    }

    .type-sample {
      font-family: var(--font-display), system-ui, sans-serif;
    }

    .type-spec {
      font-size: 9px;
      color: var(--muted);
      font-family: var(--font-mono), monospace;
    }

    .font-family {
      padding: 12px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-md);
      margin-bottom: 8px;
    }

    .font-name {
      font-size: 18px;
      margin-bottom: 4px;
    }

    .font-label {
      font-size: 10px;
      color: var(--muted);
      text-transform: uppercase;
    }

    .personality-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .personality-tag {
      font-size: 12px;
      padding: 4px 12px;
      background: var(--accent);
      color: white;
      border-radius: var(--radius-full);
    }

    .voice-examples {
      font-size: 12px;
    }

    .voice-examples li {
      margin-bottom: 4px;
      padding-left: 12px;
      position: relative;
    }

    .voice-examples li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 8px;
      width: 4px;
      height: 4px;
      background: var(--accent);
      border-radius: 50%;
    }

    .component-preview {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn-preview {
      display: inline-block;
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 500;
      border-radius: var(--radius-md);
      text-decoration: none;
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

    .spacing-scale {
      display: flex;
      align-items: flex-end;
      gap: 4px;
    }

    .spacing-item {
      text-align: center;
    }

    .spacing-bar {
      background: var(--accent);
      width: 20px;
      border-radius: 2px;
      margin-bottom: 4px;
    }

    .spacing-label {
      font-size: 8px;
      color: var(--muted);
    }

    .footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <header class="header">
      <div>
        <h1 class="brand-name">${escapeHtml(brandName)}</h1>
        <p class="version">Brand Guidelines v${tokens.metadata?.version || '2.0.0'}</p>
      </div>
      <div style="text-align: right;">
        <p style="font-size: 10px; color: var(--muted);">${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode</p>
      </div>
    </header>

    <!-- Main Grid -->
    <div class="grid">
      <!-- Left Column -->
      <div>
        <!-- Colors -->
        <section class="section">
          <h2 class="section-title">Colors</h2>
          <div class="color-grid">
            ${colorSwatches.map(s => `
              <div class="color-swatch">
                <div class="swatch" style="background: ${s.color};"></div>
                <p class="name">${s.name}</p>
                <p class="value">${s.color}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Typography -->
        <section class="section">
          <h2 class="section-title">Typography</h2>
          <div class="font-family" style="font-family: var(--font-display), system-ui, sans-serif;">
            <p class="font-name">${(tokens.typography.fontFamily.display || tokens.typography.fontFamily.sans).split(',')[0].replace(/["']/g, '')}</p>
            <p class="font-label">Display</p>
          </div>
          <div class="font-family" style="font-family: var(--font-body), system-ui, sans-serif;">
            <p class="font-name">${(tokens.typography.fontFamily.body || tokens.typography.fontFamily.sans).split(',')[0].replace(/["']/g, '')}</p>
            <p class="font-label">Body</p>
          </div>
        </section>

        <!-- Type Scale -->
        ${typeScale.length > 0 ? `
        <section class="section">
          <h2 class="section-title">Type Scale</h2>
          <div class="type-scale">
            ${typeScale.map(([name, spec]) => `
              <div class="type-item">
                <span class="type-sample" style="font-size: ${spec.size}; font-weight: ${spec.weight};">${name}</span>
                <span class="type-spec">${spec.size} / ${spec.weight}</span>
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- Spacing -->
        <section class="section">
          <h2 class="section-title">Spacing</h2>
          <div class="spacing-scale">
            ${['1', '2', '4', '6', '8', '12', '16'].map(key => {
              const value = tokens.spacing[key as keyof typeof tokens.spacing];
              if (typeof value !== 'string') return '';
              const height = parseInt(value) * 16;
              return `
                <div class="spacing-item">
                  <div class="spacing-bar" style="height: ${Math.min(height, 60)}px;"></div>
                  <span class="spacing-label">${key}</span>
                </div>
              `;
            }).join('')}
          </div>
        </section>
      </div>

      <!-- Right Column -->
      <div>
        <!-- Brand Voice -->
        <section class="section">
          <h2 class="section-title">Brand Voice</h2>
          ${tokens.voiceAndTone.personality && tokens.voiceAndTone.personality.length > 0 ? `
          <div class="personality-tags" style="margin-bottom: 12px;">
            ${tokens.voiceAndTone.personality.map(trait => `
              <span class="personality-tag">${escapeHtml(trait)}</span>
            `).join('')}
          </div>
          ` : ''}
          ${copy.coreMessage ? `
          <p style="font-size: 12px; font-style: italic; margin-bottom: 12px;">"${escapeHtml(copy.coreMessage)}"</p>
          ` : ''}
          <p style="font-size: 11px; color: var(--muted);">${escapeHtml(tokens.voiceAndTone.writingStyle)}</p>
        </section>

        <!-- Headlines -->
        <section class="section">
          <h2 class="section-title">Example Headlines</h2>
          <ul class="voice-examples">
            ${copy.headlines.slice(0, 3).map(h => `<li>${escapeHtml(h)}</li>`).join('')}
          </ul>
        </section>

        <!-- CTAs -->
        <section class="section">
          <h2 class="section-title">Call-to-Actions</h2>
          <ul class="voice-examples">
            ${copy.ctas.slice(0, 3).map(c => `<li>${escapeHtml(c)}</li>`).join('')}
          </ul>
        </section>

        <!-- Components -->
        <section class="section">
          <h2 class="section-title">Components</h2>
          <div class="component-preview">
            <span class="btn-preview btn-primary">Primary Button</span>
            <span class="btn-preview btn-secondary">Secondary</span>
          </div>
        </section>

        <!-- Border Radius -->
        <section class="section">
          <h2 class="section-title">Border Radius</h2>
          <div style="display: flex; gap: 12px;">
            ${['sm', 'md', 'lg'].map(key => {
              const value = tokens.borders.radius[key as keyof typeof tokens.borders.radius];
              if (typeof value !== 'string') return '';
              return `
                <div style="text-align: center;">
                  <div style="width: 32px; height: 32px; background: var(--accent); border-radius: ${value};"></div>
                  <p style="font-size: 9px; color: var(--muted); margin-top: 4px;">${key}</p>
                </div>
              `;
            }).join('')}
          </div>
        </section>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <span>Generated by Nertia Brand Generator</span>
      <span>${new Date().toLocaleDateString()}</span>
    </footer>
  </div>
</body>
</html>`;
}

export const oneSheeterGenerator: Generator<OneSheeterOptions> = {
  format: 'one-sheeter',
  name: 'One-Sheeter',
  description: 'Print-ready brand summary (use browser print to PDF)',
  icon: 'FileText',

  async generate(tokens: BrandSystem, options: OneSheeterOptions = {}): Promise<ExportResult> {
    const brandName = tokens.metadata?.name || 'brand';
    const slug = brandName.toLowerCase().replace(/\s+/g, '-');
    const mode: ColorMode = options.colorMode === 'dark' ? 'dark' : 'light';

    const files = [];

    if (options.colorMode === 'both') {
      files.push({
        filename: `${slug}-brand-sheet-light.html`,
        content: generateOneSheeterHtml(tokens, 'light', options),
        type: 'html' as const,
      });
      files.push({
        filename: `${slug}-brand-sheet-dark.html`,
        content: generateOneSheeterHtml(tokens, 'dark', options),
        type: 'html' as const,
      });
    } else {
      files.push({
        filename: `${slug}-brand-sheet.html`,
        content: generateOneSheeterHtml(tokens, mode, options),
        type: 'html' as const,
      });
    }

    return {
      format: 'one-sheeter',
      files,
      metadata: {
        generatedAt: getTimestamp(),
        brandName,
        version: tokens.metadata?.version || '2.0.0',
      },
    };
  },
};

export default oneSheeterGenerator;
