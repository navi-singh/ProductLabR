'use client';

import { useState } from 'react';

interface NewsletterProps {
  title?: string;
  description?: string;
}

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

const newsletterEndpoint = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

export function Newsletter({ title = 'Get our picks', description = 'Weekly roundup of our best reviews and deals.' }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');

  if (!newsletterEndpoint) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submissionState === 'submitting') return;

    setSubmissionState('submitting');

    try {
      const response = await fetch(newsletterEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: new URLSearchParams({ email }).toString(),
      });

      if (!response.ok) {
        throw new Error(`Newsletter signup failed: ${response.status}`);
      }

      setSubmissionState('success');
      setEmail('');
    } catch {
      setSubmissionState('error');
    }
  };

  return (
    <div className="rounded-xl bg-gradient-to-br from-primary to-primary-dark p-4 text-white">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-white/85">{description}</p>
      {submissionState === 'success' ? (
        <p className="mt-3 text-xs font-semibold text-white/90">Thanks — your subscription was received.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={submissionState === 'submitting'}
            className="mt-2.5 w-full rounded border border-white/25 bg-white/15 px-3 py-2 text-xs text-white placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-white/40 disabled:cursor-not-allowed disabled:opacity-70"
          />
          <button
            type="submit"
            disabled={submissionState === 'submitting'}
            className="mt-1.5 w-full rounded bg-accent py-2 text-xs font-semibold text-white hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submissionState === 'submitting' ? 'Subscribing…' : 'Subscribe'}
          </button>
          {submissionState === 'error' && (
            <p className="mt-2 text-xs font-semibold text-white/90" role="alert">
              We couldn&apos;t subscribe you. Please try again later.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
