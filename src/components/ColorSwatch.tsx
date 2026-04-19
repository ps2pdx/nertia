'use client';

interface ColorSwatchProps {
  name: string;
  lightColor: string;
  darkColor: string;
  showLabels?: boolean;
}

export function ColorSwatch({ name, lightColor, darkColor, showLabels = true }: ColorSwatchProps) {
  return (
    <div className="text-center">
      <div className="flex rounded-md overflow-hidden border border-[var(--card-border)]">
        <div
          className="w-1/2 h-12"
          style={{ backgroundColor: lightColor }}
          title={`Light: ${lightColor}`}
        />
        <div
          className="w-1/2 h-12"
          style={{ backgroundColor: darkColor }}
          title={`Dark: ${darkColor}`}
        />
      </div>
      {showLabels && (
        <span className="text-xs text-muted mt-1 block truncate">{name}</span>
      )}
    </div>
  );
}

interface ColorValue {
  light: string;
  dark: string;
}

// Helper to check if a value is a ColorValue
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

interface ColorPaletteProps {
  colors: Record<string, unknown>;
}

export function ColorPalette({ colors }: ColorPaletteProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {Object.entries(colors)
        .filter(([, value]) => isColorValue(value))
        .map(([name, value]) => (
          <ColorSwatch
            key={name}
            name={name}
            lightColor={(value as ColorValue).light}
            darkColor={(value as ColorValue).dark}
          />
        ))}
    </div>
  );
}
