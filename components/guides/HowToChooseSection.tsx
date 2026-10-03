interface BuyingAdvice {
  title: string;
  body: string;
}

interface HowToChooseSectionProps {
  title: string;
  intro: string;
  advice: BuyingAdvice[];
}

export function HowToChooseSection({ title, intro, advice }: HowToChooseSectionProps) {
  return (
    <section className="rounded-xl bg-gradient-to-br from-primary-lightest to-primary-light/20 p-5">
      <p className="type-label text-accent">Buying Advice</p>
      <h2 className="type-headline mt-1 text-neutral-900">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">{intro}</p>
      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {advice.map((item) => (
          <div key={item.title} className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900">{item.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-neutral-500">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
