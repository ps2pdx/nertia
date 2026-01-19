'use client';

import { useState } from 'react';

interface GenerationFeedbackProps {
  generationId: string | undefined;
  onFeedbackSubmit?: () => void;
}

export function GenerationFeedback({ generationId, onFeedbackSubmit }: GenerationFeedbackProps) {
  const [rating, setRating] = useState<1 | 5 | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!generationId) return null;

  const handleSubmit = async () => {
    if (!rating) return;

    setSubmitting(true);

    try {
      const response = await fetch('/api/generations/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationId,
          rating,
          feedbackText: feedback || undefined,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        onFeedbackSubmit?.();
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="border border-[var(--card-border)] rounded-lg p-4 bg-[var(--card-bg)]">
        <p className="text-sm text-muted flex items-center gap-2">
          <span className="text-green-500">✓</span> Thanks for your feedback!
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[var(--card-border)] rounded-lg p-4 bg-[var(--card-bg)]">
      <p className="text-sm font-medium mb-3">How's this brand system?</p>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setRating(1)}
          className={`px-4 py-2 rounded-md text-lg transition-colors ${
            rating === 1
              ? 'bg-red-500/20 border-2 border-red-500'
              : 'bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-red-500/50'
          }`}
          aria-label="Thumbs down"
        >
          👎
        </button>
        <button
          onClick={() => setRating(5)}
          className={`px-4 py-2 rounded-md text-lg transition-colors ${
            rating === 5
              ? 'bg-green-500/20 border-2 border-green-500'
              : 'bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-green-500/50'
          }`}
          aria-label="Thumbs up"
        >
          👍
        </button>
      </div>

      {rating === 1 && (
        <div className="mb-3">
          <textarea
            placeholder="What could be better? (optional but helpful)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--card-border)] rounded-md bg-transparent text-sm resize-none focus:outline-none focus:border-[var(--accent)]"
            rows={2}
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={rating === null || submitting}
        className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-md hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </div>
  );
}
