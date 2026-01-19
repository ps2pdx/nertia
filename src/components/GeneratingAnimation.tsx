'use client';

import { useGenerationProgress } from '@/hooks/useGenerationProgress';

interface GeneratingAnimationProps {
  isGenerating: boolean;
}

export function GeneratingAnimation({ isGenerating }: GeneratingAnimationProps) {
  const { phase, message, totalPhases } = useGenerationProgress(isGenerating);

  if (!isGenerating) return null;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Main Animation */}
      <div className="relative w-48 h-48 mb-8">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Background pulse */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.1"
            className="animate-ping"
            style={{ animationDuration: '3s' }}
          />

          {/* Orbiting color token */}
          <g
            className="origin-center animate-spin"
            style={{ animationDuration: '8s', transformOrigin: '100px 100px' }}
          >
            <circle
              cx="100"
              cy="30"
              r="8"
              className={`transition-all duration-500 ${
                phase >= 1 ? 'fill-[var(--accent)] opacity-100' : 'fill-current opacity-30'
              }`}
            />
          </g>

          {/* Orbiting typography token */}
          <g
            className="origin-center animate-spin"
            style={{
              animationDuration: '12s',
              animationDirection: 'reverse',
              transformOrigin: '100px 100px',
            }}
          >
            <rect
              x="160"
              y="95"
              width="24"
              height="10"
              rx="2"
              className={`transition-all duration-500 ${
                phase >= 2 ? 'fill-[var(--accent)] opacity-100' : 'fill-current opacity-30'
              }`}
            />
          </g>

          {/* Orbiting component token */}
          <g
            className="origin-center animate-spin"
            style={{ animationDuration: '10s', transformOrigin: '100px 100px' }}
          >
            <rect
              x="88"
              y="160"
              width="24"
              height="24"
              rx="4"
              className={`transition-all duration-500 ${
                phase >= 3 ? 'fill-[var(--accent)] opacity-100' : 'fill-current opacity-30'
              }`}
            />
          </g>

          {/* Center system core */}
          <rect
            x="80"
            y="80"
            width="40"
            height="40"
            rx="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="animate-pulse"
          />

          {/* Connection lines */}
          <g className="opacity-20">
            <line
              x1="100"
              y1="38"
              x2="100"
              y2="80"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <line
              x1="160"
              y1="100"
              x2="120"
              y2="100"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <line
              x1="100"
              y1="120"
              x2="100"
              y2="160"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          </g>
        </svg>
      </div>

      {/* Phase indicator */}
      <div className="text-center">
        <p className="text-sm font-medium mb-3">{message}</p>
        <div className="flex gap-2 justify-center">
          {Array.from({ length: totalPhases }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i <= phase ? 'bg-[var(--accent)]' : 'bg-[var(--card-border)]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
