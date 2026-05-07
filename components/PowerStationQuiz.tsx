// components/PowerStationQuiz.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Answer = string | null;

const QUESTIONS = [
  {
    id: 'budget',
    question: "What's your budget?",
    options: [
      { value: 'under-500', label: 'Under $500', icon: '💰' },
      { value: '500-1000', label: '$500 – $1,000', icon: '💵' },
      { value: '1000-2000', label: '$1,000 – $2,000', icon: '💳' },
      { value: '2000-plus', label: '$2,000+', icon: '🏦' },
    ],
  },
  {
    id: 'use',
    question: 'What will you primarily use it for?',
    options: [
      { value: 'camping', label: 'Camping & outdoors', icon: '⛺' },
      { value: 'home', label: 'Home backup', icon: '🏠' },
      { value: 'rv', label: 'RV & van life', icon: '🚐' },
      { value: 'solar', label: 'Off-grid solar', icon: '☀️' },
    ],
  },
  {
    id: 'solar',
    question: 'How important is solar charging?',
    options: [
      { value: 'essential', label: 'Essential', icon: '🌞' },
      { value: 'nice', label: 'Nice to have', icon: '⛅' },
      { value: 'no', label: 'Not needed', icon: '🔌' },
    ],
  },
] as const;

function getRoute(budget: string, use: string, solar: string): string {
  if (budget === 'under-500') return '/best/power-stations/under-500';
  if (solar === 'essential') return '/best/power-stations/solar-generators';
  if (use === 'rv') return '/best/power-stations/rv-power-stations';
  if (use === 'camping') return budget === '500-1000' ? '/best/power-stations/camping-power-stations' : '/best/power-stations/under-1000';
  if (use === 'solar') return '/best/power-stations/solar-generators';
  if (use === 'home' && budget === '2000-plus') return '/best/power-stations/house-backup-power-stations';
  if (use === 'home') return '/best/power-stations/under-1000';
  if (budget === '500-1000') return '/best/power-stations/under-1000';
  if (budget === '1000-2000') return '/best/power-stations/portable-power-stations';
  return '/best/power-stations/house-backup-power-stations';
}

export function PowerStationQuiz() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, Answer>>({ budget: null, use: null, solar: null });

  const allAnswered = Object.values(answers).every(Boolean);

  function handleSubmit() {
    if (!allAnswered) return;
    router.push(getRoute(answers.budget!, answers.use!, answers.solar!));
  }

  return (
    <div className="rounded-xl border border-primary-light bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-neutral-900 mb-1">Find Your Perfect Power Station</h2>
      <p className="text-xs text-neutral-500 mb-5">Answer 3 questions and we&apos;ll point you to the right category.</p>
      <div className="space-y-6">
        {QUESTIONS.map((q, qi) => (
          <div key={q.id}>
            <p className="text-sm font-semibold text-neutral-700 mb-2">
              <span className="mr-2 text-primary">{qi + 1}.</span>{q.question}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))}
                    className={`rounded-lg border px-3 py-2.5 text-center text-xs font-medium transition-all ${
                      selected
                        ? 'border-primary bg-primary text-white shadow-md'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-primary hover:bg-primary-lightest'
                    }`}
                  >
                    <span className="block text-base mb-0.5">{opt.icon}</span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Find my power station →
        </button>
        <span className="text-xs text-neutral-400">
          {Object.values(answers).filter(Boolean).length} of 3 answered
        </span>
      </div>
    </div>
  );
}
