'use client';

import { DiscoveryInputs } from '@/types/brand-system';
import { generateRandomInputs } from '@/utils/random-inputs';

interface DiscoveryFormProps {
  inputs: DiscoveryInputs;
  setInputs: (inputs: DiscoveryInputs) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const INDUSTRIES = [
  'AI/ML Infrastructure',
  'Developer Tools',
  'B2B SaaS',
  'Fintech',
  'Healthcare Tech',
  'E-commerce',
  'Consumer Apps',
  'Climate Tech',
];

const PERSONALITIES = [
  'innovative',
  'trustworthy',
  'bold',
  'friendly',
  'premium',
  'technical',
  'playful',
  'minimal',
  'sophisticated',
  'approachable',
];

export function DiscoveryForm({ inputs, setInputs, onGenerate, isLoading }: DiscoveryFormProps) {
  const updateField = <K extends keyof DiscoveryInputs>(field: K, value: DiscoveryInputs[K]) => {
    setInputs({ ...inputs, [field]: value });
  };

  const togglePersonality = (adj: string) => {
    const current = inputs.personalityAdjectives;
    if (current.includes(adj)) {
      updateField(
        'personalityAdjectives',
        current.filter((a) => a !== adj)
      );
    } else if (current.length < 5) {
      updateField('personalityAdjectives', [...current, adj]);
    }
  };

  const handleRandomize = () => {
    setInputs(generateRandomInputs());
  };

  return (
    <div className="space-y-6">
      {/* Header with Randomize */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Brand Discovery</h3>
        <button
          type="button"
          onClick={handleRandomize}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          Randomize
        </button>
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium mb-2">Company Name</label>
        <input
          type="text"
          value={inputs.companyName}
          onChange={(e) => updateField('companyName', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
          placeholder="Acme Corp"
        />
      </div>

      {/* Industry */}
      <div>
        <label className="block text-sm font-medium mb-2">Industry</label>
        <select
          value={inputs.industry}
          onChange={(e) => updateField('industry', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
        >
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-sm font-medium mb-2">Target Audience</label>
        <input
          type="text"
          value={inputs.targetAudience}
          onChange={(e) => updateField('targetAudience', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
          placeholder="Enterprise developers, DevOps teams"
        />
      </div>

      {/* Personality */}
      <div>
        <label className="block text-sm font-medium mb-2">Brand Personality (select up to 5)</label>
        <div className="flex flex-wrap gap-2">
          {PERSONALITIES.map((adj) => (
            <button
              key={adj}
              type="button"
              onClick={() => togglePersonality(adj)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                inputs.personalityAdjectives.includes(adj)
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent)]'
              }`}
            >
              {adj}
            </button>
          ))}
        </div>
      </div>

      {/* Color Mood & Brightness */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Color Mood</label>
          <select
            value={inputs.colorMood}
            onChange={(e) => updateField('colorMood', e.target.value as DiscoveryInputs['colorMood'])}
            className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
          >
            <option value="warm">Warm</option>
            <option value="cool">Cool</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Brightness</label>
          <select
            value={inputs.colorBrightness}
            onChange={(e) =>
              updateField('colorBrightness', e.target.value as DiscoveryInputs['colorBrightness'])
            }
            className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
          >
            <option value="vibrant">Vibrant</option>
            <option value="muted">Muted</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      {/* Typography & Density */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Typography Style</label>
          <select
            value={inputs.typographyStyle}
            onChange={(e) =>
              updateField('typographyStyle', e.target.value as DiscoveryInputs['typographyStyle'])
            }
            className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="playful">Playful</option>
            <option value="technical">Technical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Density</label>
          <select
            value={inputs.densityPreference}
            onChange={(e) =>
              updateField('densityPreference', e.target.value as DiscoveryInputs['densityPreference'])
            }
            className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
          >
            <option value="spacious">Spacious</option>
            <option value="balanced">Balanced</option>
            <option value="compact">Compact</option>
          </select>
        </div>
      </div>

      {/* Existing Color */}
      <div>
        <label className="block text-sm font-medium mb-2">Existing Brand Color (optional)</label>
        <input
          type="text"
          value={inputs.existingBrandColor || ''}
          onChange={(e) => updateField('existingBrandColor', e.target.value || undefined)}
          className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent focus:border-[var(--accent)] focus:outline-none transition-colors"
          placeholder="#FF5500"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isLoading || !inputs.companyName || inputs.personalityAdjectives.length === 0}
        className="w-full py-3 bg-[var(--accent)] text-white font-medium rounded-md hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Generating...' : 'Generate Brand System'}
      </button>
    </div>
  );
}
