import { BrandSystem, ColorValue } from '@/types/brand-system';

type ColorMode = 'light' | 'dark';

/**
 * Helper to check if a value is a ColorValue object
 */
function isColorValue(value: unknown): value is ColorValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'light' in value &&
    'dark' in value &&
    typeof (value as ColorValue).light === 'string' &&
    typeof (value as ColorValue).dark === 'string'
  );
}

/**
 * Convert a BrandSystem to CSS custom properties
 */
export function tokensToCssVariables(
  tokens: BrandSystem,
  mode: ColorMode
): Record<string, string> {
  const vars: Record<string, string> = {};

  // ---- Core Colors ----
  Object.entries(tokens.colors).forEach(([key, value]) => {
    // Skip non-ColorValue objects (surface, border, usageRatios)
    if (isColorValue(value)) {
      vars[`--${kebabCase(key)}`] = value[mode];
    }
  });

  // ---- Extended Colors: Surface (v2) ----
  if (tokens.colors.surface) {
    Object.entries(tokens.colors.surface).forEach(([key, value]) => {
      if (isColorValue(value)) {
        vars[`--surface-${kebabCase(key)}`] = value[mode];
      }
    });
  }

  // ---- Extended Colors: Border (v2) ----
  if (tokens.colors.border) {
    Object.entries(tokens.colors.border).forEach(([key, value]) => {
      if (isColorValue(value)) {
        vars[`--border-color-${kebabCase(key)}`] = value[mode];
      }
    });
  }

  // ---- Extended Colors: Overlay (v2) ----
  if (tokens.colors.overlay) {
    vars['--overlay'] = tokens.colors.overlay[mode];
  }

  // ---- Typography: Font Family ----
  vars['--font-sans'] = tokens.typography.fontFamily.sans;
  vars['--font-mono'] = tokens.typography.fontFamily.mono;
  if (tokens.typography.fontFamily.display) {
    vars['--font-display'] = tokens.typography.fontFamily.display;
  }
  if (tokens.typography.fontFamily.body) {
    vars['--font-body'] = tokens.typography.fontFamily.body;
  }

  // ---- Typography: Font Size ----
  Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
    if (typeof value === 'string') {
      vars[`--text-${key}`] = value;
    }
  });

  // ---- Typography: Font Weight ----
  Object.entries(tokens.typography.fontWeight).forEach(([key, value]) => {
    vars[`--font-${key}`] = String(value);
  });

  // ---- Typography: Line Height ----
  Object.entries(tokens.typography.lineHeight).forEach(([key, value]) => {
    vars[`--leading-${key}`] = String(value);
  });

  // ---- Typography: Letter Spacing (v2) ----
  if (tokens.typography.letterSpacing) {
    Object.entries(tokens.typography.letterSpacing).forEach(([key, value]) => {
      vars[`--tracking-${key}`] = value;
    });
  }

  // ---- Typography: Scale (v2) ----
  if (tokens.typography.scale) {
    Object.entries(tokens.typography.scale).forEach(([key, entry]) => {
      vars[`--scale-${key}-size`] = entry.size;
      vars[`--scale-${key}-weight`] = String(entry.weight);
      vars[`--scale-${key}-line-height`] = String(entry.lineHeight);
      if (entry.letterSpacing) {
        vars[`--scale-${key}-letter-spacing`] = entry.letterSpacing;
      }
    });
  }

  // ---- Grid System (v2) ----
  if (tokens.grid) {
    vars['--grid-desktop-columns'] = String(tokens.grid.desktop.columns);
    vars['--grid-desktop-gutter'] = tokens.grid.desktop.gutter;
    vars['--grid-desktop-max-width'] = tokens.grid.desktop.maxWidth;
    vars['--grid-desktop-margin'] = tokens.grid.desktop.margin;
    vars['--grid-mobile-columns'] = String(tokens.grid.mobile.columns);
    vars['--grid-mobile-gutter'] = tokens.grid.mobile.gutter;
    vars['--grid-mobile-margin'] = tokens.grid.mobile.margin;
  }

  // ---- Spacing ----
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    if (typeof value === 'string') {
      vars[`--spacing-${key}`] = value;
    }
  });

  // ---- Spacing: Semantic (v2) ----
  if (tokens.spacing.semantic) {
    const s = tokens.spacing.semantic;
    vars['--spacing-section-x'] = s.section.paddingX;
    vars['--spacing-section-y'] = s.section.paddingY;
    vars['--spacing-card'] = s.card.padding;
    vars['--spacing-component-gap'] = s.component.gap;
    vars['--spacing-text-gap'] = s.text.gap;
    vars['--spacing-inline-gap'] = s.inline.gap;
    vars['--spacing-container-max-width'] = s.container.maxWidth;
    vars['--spacing-container-x'] = s.container.paddingX;
  }

  // ---- Icons (v2) ----
  if (tokens.icons) {
    vars['--icon-sm'] = tokens.icons.sizes.small;
    vars['--icon-default'] = tokens.icons.sizes.default;
    vars['--icon-lg'] = tokens.icons.sizes.large;
    vars['--icon-hero'] = tokens.icons.sizes.hero;
    vars['--icon-stroke'] = tokens.icons.strokeWeight;
    vars['--icon-bounding-box'] = tokens.icons.boundingBox;
  }

  // ---- Components: Button (v2) ----
  if (tokens.components?.button) {
    const btn = tokens.components.button;
    // Primary
    vars['--btn-primary-bg'] = btn.primary.background[mode];
    vars['--btn-primary-fg'] = btn.primary.foreground[mode];
    vars['--btn-primary-bg-hover'] = btn.primary.backgroundHover[mode];
    vars['--btn-primary-border'] = btn.primary.border[mode];
    // Secondary
    vars['--btn-secondary-bg'] = btn.secondary.background[mode];
    vars['--btn-secondary-fg'] = btn.secondary.foreground[mode];
    vars['--btn-secondary-bg-hover'] = btn.secondary.backgroundHover[mode];
    vars['--btn-secondary-border'] = btn.secondary.border[mode];
    // Outline (optional)
    if (btn.outline) {
      vars['--btn-outline-bg'] = btn.outline.background[mode];
      vars['--btn-outline-fg'] = btn.outline.foreground[mode];
      vars['--btn-outline-bg-hover'] = btn.outline.backgroundHover[mode];
      vars['--btn-outline-border'] = btn.outline.border[mode];
    }
    // Disabled (optional)
    if (btn.disabled) {
      vars['--btn-disabled-bg'] = btn.disabled.background[mode];
      vars['--btn-disabled-fg'] = btn.disabled.foreground[mode];
      vars['--btn-disabled-border'] = btn.disabled.border[mode];
    }
    // Button sizing
    vars['--btn-padding-x'] = btn.paddingX;
    vars['--btn-padding-y'] = btn.paddingY;
    vars['--btn-font-size'] = btn.fontSize;
    vars['--btn-font-weight'] = String(btn.fontWeight);
    vars['--btn-radius'] = btn.borderRadius;
    if (btn.letterSpacing) {
      vars['--btn-letter-spacing'] = btn.letterSpacing;
    }
  }

  // ---- Components: Card (v2) ----
  if (tokens.components?.card) {
    const card = tokens.components.card;
    vars['--card-radius'] = card.borderRadius;
    if (card.variants) {
      Object.entries(card.variants).forEach(([variant, v]) => {
        vars[`--card-${variant}-bg`] = v.background[mode];
        vars[`--card-${variant}-border`] = v.border[mode];
        vars[`--card-${variant}-padding`] = v.padding;
      });
    }
  }

  // ---- Components: Input (v2) ----
  if (tokens.components?.input) {
    const input = tokens.components.input;
    vars['--input-bg'] = input.background[mode];
    vars['--input-border'] = input.border[mode];
    vars['--input-border-focus'] = input.borderFocus[mode];
    vars['--input-placeholder'] = input.placeholder[mode];
    vars['--input-padding-x'] = input.paddingX;
    vars['--input-padding-y'] = input.paddingY;
    vars['--input-font-size'] = input.fontSize;
    vars['--input-radius'] = input.borderRadius;
  }

  // ---- Components: Alert (v2) ----
  if (tokens.components?.alert) {
    const alert = tokens.components.alert;
    vars['--alert-padding'] = alert.padding;
    vars['--alert-border-left-width'] = alert.borderLeftWidth;
    if (alert.variants) {
      Object.entries(alert.variants).forEach(([variant, v]) => {
        vars[`--alert-${variant}-bg`] = v.background[mode];
        vars[`--alert-${variant}-border`] = v.border[mode];
      });
    }
  }

  // ---- Components: Table (v2) ----
  if (tokens.components?.table) {
    const table = tokens.components.table;
    vars['--table-header-bg'] = table.headerBackground[mode];
    vars['--table-row-stripe'] = table.rowStripe[mode];
    vars['--table-row-hover'] = table.rowHover[mode];
    vars['--table-border'] = table.borderColor[mode];
    vars['--table-cell-padding-x'] = table.cellPaddingX;
    vars['--table-cell-padding-y'] = table.cellPaddingY;
  }

  // ---- Components: Navigation (v2) ----
  if (tokens.components?.navigation) {
    const nav = tokens.components.navigation;
    vars['--nav-bg'] = nav.background[mode];
    vars['--nav-link'] = nav.linkColor[mode];
    vars['--nav-link-hover'] = nav.linkHover[mode];
    vars['--nav-height'] = nav.height;
  }

  // ---- Border Radius ----
  Object.entries(tokens.borders.radius).forEach(([key, value]) => {
    if (typeof value === 'string') {
      vars[`--radius-${key}`] = value;
    }
  });

  // ---- Border Width ----
  Object.entries(tokens.borders.width).forEach(([key, value]) => {
    vars[`--border-${key}`] = value;
  });

  // ---- Shadows ----
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    vars[`--shadow-${key}`] = value;
  });

  // ---- Motion: Duration ----
  Object.entries(tokens.motion.duration).forEach(([key, value]) => {
    if (typeof value === 'string') {
      vars[`--duration-${key}`] = value;
    }
  });

  // ---- Motion: Easing ----
  Object.entries(tokens.motion.easing).forEach(([key, value]) => {
    vars[`--easing-${key}`] = value;
  });

  // ---- Motion: Interactions (v2) ----
  if (tokens.motion.interactions) {
    const int = tokens.motion.interactions;
    if (int.hover) {
      vars['--interaction-hover-scale'] = String(int.hover.scale);
      vars['--interaction-hover-duration'] = int.hover.duration;
    }
    if (int.fade) {
      vars['--interaction-fade-duration'] = int.fade.duration;
    }
    if (int.slide) {
      vars['--interaction-slide-transform'] = int.slide.transform;
      vars['--interaction-slide-duration'] = int.slide.duration;
    }
  }

  // ---- zIndex (v2) ----
  if (tokens.zIndex) {
    Object.entries(tokens.zIndex).forEach(([key, value]) => {
      vars[`--z-${key}`] = String(value);
    });
  }

  // ---- Breakpoints (v2) ----
  if (tokens.breakpoints) {
    Object.entries(tokens.breakpoints).forEach(([key, value]) => {
      vars[`--breakpoint-${key}`] = value;
    });
  }

  return vars;
}

/**
 * Apply CSS variables to the document root
 */
export function applyCssVariables(vars: Record<string, string>): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

/**
 * Generate a CSS string from variables
 */
export function generateCssString(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
}

/**
 * Generate full CSS with both light and dark mode
 */
export function generateFullCss(tokens: BrandSystem): string {
  const lightVars = tokensToCssVariables(tokens, 'light');
  const darkVars = tokensToCssVariables(tokens, 'dark');

  return `:root {
${generateCssString(lightVars)}
}

@media (prefers-color-scheme: dark) {
  :root {
${generateCssString(darkVars)}
  }
}`;
}

/**
 * Convert camelCase to kebab-case
 */
function kebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
