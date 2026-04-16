'use client';

import { useState } from 'react';

interface NewsletterProps {
  title?: string;
  description?: string;
}

export function Newsletter({ title = 'Get our picks', description = 'Weekly roundup of our best reviews and deals.' }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire to subscription API endpoint
    setSubmitted(true);
    setEmail('');
  };

  return (
    <div className="rounded-xl bg-gradient-to-br from-primary to-primary-dark p-4 text-white">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-white/85">{description}</p>
      {submitted ? (
        <p className="mt-3 text-xs font-semibold text-white/90">Thanks! We&apos;ll be in touch.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2.5 w-full rounded border border-white/25 bg-white/15 px-3 py-2 text-xs text-white placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-white/40"
          />
          <button type="submit" className="mt-1.5 w-full rounded bg-accent py-2 text-xs font-semibold text-white hover:bg-accent/90">
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
