'use client';

import { useState, useCallback } from 'react';
import { DiscoveryInputs } from '@/types/brand-system';
import {
  WebsiteDiscoveryResult,
  DiscoverWebsiteResponse,
} from '@/types/website-discovery';

interface UseWebsiteDiscoveryReturn {
  discover: (url: string) => Promise<void>;
  result: WebsiteDiscoveryResult | null;
  suggestedInputs: Partial<DiscoveryInputs> | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export function useWebsiteDiscovery(): UseWebsiteDiscoveryReturn {
  const [result, setResult] = useState<WebsiteDiscoveryResult | null>(null);
  const [suggestedInputs, setSuggestedInputs] =
    useState<Partial<DiscoveryInputs> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const discover = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSuggestedInputs(null);

    try {
      const response = await fetch('/api/discover-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data: DiscoverWebsiteResponse = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
        setSuggestedInputs(data.suggestedInputs || null);
      } else {
        setError(data.error || 'Discovery failed');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Network error. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setSuggestedInputs(null);
    setError(null);
    setLoading(false);
  }, []);

  return { discover, result, suggestedInputs, loading, error, reset };
}
