import { useState, useEffect } from 'react';

const PHASES = [
  { duration: 2000, message: 'Analyzing brand inputs...' },
  { duration: 3000, message: 'Generating color palette...' },
  { duration: 3000, message: 'Selecting typography...' },
  { duration: 2000, message: 'Building component tokens...' },
  { duration: 2000, message: 'Assembling design system...' },
];

export function useGenerationProgress(isGenerating: boolean) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setPhase(0);
      return;
    }

    let elapsed = 0;
    const timers: NodeJS.Timeout[] = [];

    PHASES.forEach((p, i) => {
      const timer = setTimeout(() => setPhase(i), elapsed);
      timers.push(timer);
      elapsed += p.duration;
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, [isGenerating]);

  return {
    phase,
    message: PHASES[phase]?.message || 'Processing...',
    totalPhases: PHASES.length,
  };
}
