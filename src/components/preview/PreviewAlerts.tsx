'use client';

import { BrandSystem } from '@/types/brand-system';

interface PreviewAlertsProps {
  tokens: BrandSystem;
  colorMode: 'light' | 'dark';
}

export function PreviewAlerts({ tokens, colorMode }: PreviewAlertsProps) {
  const alert = tokens.components?.alert;
  if (!alert) return null;

  const alertMessages: Record<string, string> = {
    success: 'Operation completed successfully.',
    warning: 'Please review before proceeding.',
    error: 'An error occurred. Please try again.',
    info: 'Here is some helpful information.',
  };

  return (
    <div className="space-y-2">
      {Object.entries(alert.variants).map(([variant, styles]) => (
        <div
          key={variant}
          style={{
            backgroundColor: styles.background[colorMode],
            borderLeft: `${alert.borderLeftWidth} solid ${styles.border[colorMode]}`,
            padding: alert.padding,
            borderRadius: '0.375rem',
            color: tokens.colors.foreground[colorMode],
          }}
        >
          <span
            style={{
              fontWeight: 500,
              textTransform: 'capitalize',
              marginRight: '0.5rem',
            }}
          >
            {variant}:
          </span>
          <span style={{ fontSize: '0.875rem' }}>
            {alertMessages[variant] || `This is a ${variant} alert.`}
          </span>
        </div>
      ))}
    </div>
  );
}
