interface TestMetric {
  title: string;
  description: string;
}

interface HowWeTestedPanelProps {
  title?: string;
  eyebrow?: string;
  intro: string;
  metrics: TestMetric[];
}

export function HowWeTestedPanel({
  title = 'How We Evaluate',
  eyebrow = 'Evaluation Method',
  intro,
  metrics,
}: HowWeTestedPanelProps) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-featured">
      <p className="type-label text-accent">{eyebrow}</p>
      <h2 className="type-headline mt-1 text-neutral-900">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">{intro}</p>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.title} className="rounded-lg bg-neutral-50 p-4">
            <h3 className="text-sm font-bold text-neutral-900">{metric.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-neutral-500">{metric.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
