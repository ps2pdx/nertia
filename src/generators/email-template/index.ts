import { BrandSystem } from '@/types/brand-system';
import {
  Generator,
  EmailTemplateOptions,
  ExportResult,
} from '../types';
import {
  generateEmailInlineStyles,
  getBrandCopy,
  generateButton,
  escapeHtml,
  getTimestamp,
} from '../base-generator';

type ColorMode = 'light' | 'dark';

function generateEmailHtml(
  tokens: BrandSystem,
  mode: ColorMode,
  options: EmailTemplateOptions
): string {
  const styles = generateEmailInlineStyles(tokens, mode);
  const copy = getBrandCopy(tokens);
  const brandName = tokens.metadata?.name || 'Brand';

  const headline = options.customCopy?.headline || copy.headlines[0] || `Welcome to ${brandName}`;
  const description = options.customCopy?.description || copy.descriptions[0] || 'Thank you for joining us. We\'re excited to have you.';
  const ctaText = options.customCopy?.cta || copy.ctas[0] || 'Get Started';

  // Email-safe CSS (inline styles, table-based layout)
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(brandName)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset styles */
    body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }

    /* Responsive */
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 20px !important; }
      .content { padding: 24px !important; }
      h1 { font-size: 24px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${styles.background}; font-family: ${styles.fontBody}, Arial, sans-serif;">
  <!-- Preheader text -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${escapeHtml(description.substring(0, 100))}
  </div>

  <!-- Email wrapper -->
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${styles.background};">
    <tr>
      <td align="center" style="padding: 40px 20px;">

        <!-- Container -->
        <table role="presentation" class="container" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family: ${styles.fontDisplay}, Arial, sans-serif; font-size: 24px; font-weight: 700; color: ${styles.foreground};">
                    ${escapeHtml(brandName)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main content card -->
          <tr>
            <td>
              <table role="presentation" class="content" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${styles.cardBg}; border: 1px solid ${styles.cardBorder}; border-radius: ${styles.radiusLg};">
                <tr>
                  <td style="padding: 48px;">

                    <!-- Headline -->
                    <h1 style="margin: 0 0 16px 0; font-family: ${styles.fontDisplay}, Arial, sans-serif; font-size: 28px; font-weight: 700; color: ${styles.foreground}; line-height: 1.3;">
                      ${escapeHtml(headline)}
                    </h1>

                    <!-- Description -->
                    <p style="margin: 0 0 32px 0; font-family: ${styles.fontBody}, Arial, sans-serif; font-size: 16px; color: ${styles.muted}; line-height: 1.6;">
                      ${escapeHtml(description)}
                    </p>

                    <!-- CTA Button -->
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          ${generateButton(ctaText, tokens, mode, 'primary')}
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family: ${styles.fontBody}, Arial, sans-serif; font-size: 12px; color: ${styles.muted}; text-align: center; line-height: 1.5;">
                    <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} ${escapeHtml(brandName)}. All rights reserved.</p>
                    <p style="margin: 0;">
                      <a href="#" style="color: ${styles.muted}; text-decoration: underline;">Unsubscribe</a>
                      &nbsp;&nbsp;|&nbsp;&nbsp;
                      <a href="#" style="color: ${styles.muted}; text-decoration: underline;">Privacy Policy</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const emailTemplateGenerator: Generator<EmailTemplateOptions> = {
  format: 'email-template',
  name: 'Email Template',
  description: 'Email-safe HTML template with inline styles',
  icon: 'Mail',

  async generate(tokens: BrandSystem, options: EmailTemplateOptions = {}): Promise<ExportResult> {
    const brandName = tokens.metadata?.name || 'brand';
    const slug = brandName.toLowerCase().replace(/\s+/g, '-');
    const mode: ColorMode = options.colorMode === 'dark' ? 'dark' : 'light';

    const files = [];

    // Generate HTML for selected mode(s)
    if (options.colorMode === 'both') {
      files.push({
        filename: `${slug}-email-light.html`,
        content: generateEmailHtml(tokens, 'light', options),
        type: 'html' as const,
      });
      files.push({
        filename: `${slug}-email-dark.html`,
        content: generateEmailHtml(tokens, 'dark', options),
        type: 'html' as const,
      });
    } else {
      files.push({
        filename: `${slug}-email.html`,
        content: generateEmailHtml(tokens, mode, options),
        type: 'html' as const,
      });
    }

    return {
      format: 'email-template',
      files,
      metadata: {
        generatedAt: getTimestamp(),
        brandName,
        version: tokens.metadata?.version || '2.0.0',
      },
    };
  },
};

export default emailTemplateGenerator;
