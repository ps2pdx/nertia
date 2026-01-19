'use client';

import { useState } from 'react';
import { BrandSystem, ColorValue } from '@/types/brand-system';

interface TokenEditorProps {
  tokens: BrandSystem;
  onTokensChange: (tokens: BrandSystem) => void;
}

type ColorMode = 'light' | 'dark';

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

export function TokenEditor({ tokens, onTokensChange }: TokenEditorProps) {
  const [activeMode, setActiveMode] = useState<ColorMode>('dark');
  const [editingPath, setEditingPath] = useState<string | null>(null);

  const updateColor = (colorKey: string, mode: ColorMode, value: string) => {
    const newTokens = {
      ...tokens,
      colors: {
        ...tokens.colors,
        [colorKey]: {
          ...tokens.colors[colorKey as keyof typeof tokens.colors],
          [mode]: value,
        },
      },
    };
    onTokensChange(newTokens);
  };

  const updateTypography = (key: 'sans' | 'mono', value: string) => {
    const newTokens = {
      ...tokens,
      typography: {
        ...tokens.typography,
        fontFamily: {
          ...tokens.typography.fontFamily,
          [key]: value,
        },
      },
    };
    onTokensChange(newTokens);
  };

  const updateSpacing = (key: string, value: string) => {
    const newTokens = {
      ...tokens,
      spacing: {
        ...tokens.spacing,
        [key]: value,
      },
    };
    onTokensChange(newTokens);
  };

  const updateBorderRadius = (key: string, value: string) => {
    const newTokens = {
      ...tokens,
      borders: {
        ...tokens.borders,
        radius: {
          ...tokens.borders.radius,
          [key]: value,
        },
      },
    };
    onTokensChange(newTokens);
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted">Editing:</span>
        <button
          onClick={() => setActiveMode('light')}
          className={`px-3 py-1 text-sm rounded-l-md border transition-colors ${
            activeMode === 'light'
              ? 'bg-white text-black border-white'
              : 'border-[var(--card-border)] hover:border-[var(--accent)]'
          }`}
        >
          Light
        </button>
        <button
          onClick={() => setActiveMode('dark')}
          className={`px-3 py-1 text-sm rounded-r-md border border-l-0 transition-colors ${
            activeMode === 'dark'
              ? 'bg-zinc-800 text-white border-zinc-800'
              : 'border-[var(--card-border)] hover:border-[var(--accent)]'
          }`}
        >
          Dark
        </button>
      </div>

      {/* Colors Section */}
      <div>
        <h3 className="text-sm font-medium mb-3">Colors ({activeMode} mode)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(tokens.colors)
            .filter(([, value]) => isColorValue(value))
            .map(([name, value]) => (
              <ColorInput
                key={name}
                label={name}
                value={(value as ColorValue)[activeMode]}
                onChange={(newValue) => updateColor(name, activeMode, newValue)}
                isEditing={editingPath === `colors.${name}`}
                onEditStart={() => setEditingPath(`colors.${name}`)}
                onEditEnd={() => setEditingPath(null)}
              />
            ))}
        </div>
      </div>

      {/* Typography Section */}
      <div>
        <h3 className="text-sm font-medium mb-3">Typography</h3>
        <div className="space-y-3">
          <TextInput
            label="Sans Font"
            value={tokens.typography.fontFamily.sans}
            onChange={(value) => updateTypography('sans', value)}
            placeholder="Inter, system-ui, sans-serif"
          />
          <TextInput
            label="Mono Font"
            value={tokens.typography.fontFamily.mono}
            onChange={(value) => updateTypography('mono', value)}
            placeholder="JetBrains Mono, monospace"
          />
        </div>
      </div>

      {/* Border Radius Section */}
      <div>
        <h3 className="text-sm font-medium mb-3">Border Radius</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {Object.entries(tokens.borders.radius).map(([name, value]) => (
            <div key={name} className="text-center">
              <div
                className="w-10 h-10 mx-auto mb-1 border-2 border-[var(--accent)] bg-[var(--card-bg)]"
                style={{ borderRadius: value }}
              />
              <input
                type="text"
                value={value}
                onChange={(e) => updateBorderRadius(name, e.target.value)}
                className="w-full text-xs text-center bg-transparent border-b border-[var(--card-border)] focus:border-[var(--accent)] outline-none py-1"
              />
              <span className="text-xs text-muted">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing Section (collapsible) */}
      <details className="group">
        <summary className="text-sm font-medium cursor-pointer hover:text-[var(--accent)] transition-colors">
          Edit Spacing
        </summary>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {Object.entries(tokens.spacing)
            .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
            .map(([name, value]) => (
              <div key={name} className="text-center">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateSpacing(name, e.target.value)}
                  className="w-full text-xs text-center bg-transparent border border-[var(--card-border)] rounded px-1 py-1 focus:border-[var(--accent)] outline-none"
                />
                <span className="text-xs text-muted">{name}</span>
              </div>
            ))}
        </div>
      </details>
    </div>
  );
}

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  onEditStart: () => void;
  onEditEnd: () => void;
}

function ColorInput({ label, value, onChange, isEditing, onEditStart, onEditEnd }: ColorInputProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-md border border-[var(--card-border)] bg-[var(--card-bg)]">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
        style={{ padding: 0 }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted truncate">{formatLabel(label)}</p>
        {isEditing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onEditEnd}
            onKeyDown={(e) => e.key === 'Enter' && onEditEnd()}
            autoFocus
            className="w-full text-xs bg-transparent border-b border-[var(--accent)] outline-none font-mono"
          />
        ) : (
          <p
            className="text-xs font-mono cursor-pointer hover:text-[var(--accent)]"
            onClick={onEditStart}
          >
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function TextInput({ label, value, onChange, placeholder }: TextInputProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-xs text-muted w-20 flex-shrink-0">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-sm bg-transparent border border-[var(--card-border)] rounded px-2 py-1 focus:border-[var(--accent)] outline-none"
      />
    </div>
  );
}

function formatLabel(label: string): string {
  return label
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
