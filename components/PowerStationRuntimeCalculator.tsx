'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

export interface RuntimeStation {
  slug: string;
  name: string;
  capacityWh: number;
  outputW?: number;
  score: number;
}

interface Appliance {
  name: string;
  watts: number;
}

const APPLIANCES: Appliance[] = [
  { name: 'Refrigerator', watts: 150 },
  { name: 'CPAP (no heated humidifier)', watts: 40 },
  { name: 'Sump pump', watts: 750 },
  { name: 'Window air conditioner', watts: 1_000 },
  { name: 'Laptop', watts: 65 },
  { name: 'Television', watts: 100 },
];

interface PowerStationRuntimeCalculatorProps {
  stations: RuntimeStation[];
}

export function PowerStationRuntimeCalculator({ stations }: PowerStationRuntimeCalculatorProps) {
  const [ready, setReady] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState(APPLIANCES[0].name);
  const [wattInput, setWattInput] = useState(String(APPLIANCES[0].watts));
  const [customLoad, setCustomLoad] = useState(false);
  const watts = Number(wattInput);
  const validWatts = Number.isFinite(watts) && watts >= 1 && watts <= 5000;

  useEffect(() => {
    setReady(true);
  }, []);

  const results = useMemo(
    () =>
      stations
        .filter(
          (station) => validWatts && station.capacityWh > 0 && (station.outputW ?? 0) >= watts,
        )
        .map((station) => ({
          ...station,
          runtimeHours: (station.capacityWh * 0.85) / watts,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4),
    [stations, validWatts, watts],
  );

  function chooseAppliance(appliance: Appliance) {
    setSelectedAppliance(appliance.name);
    setWattInput(String(appliance.watts));
    setCustomLoad(false);
  }

  return (
    <section
      id="runtime-calculator"
      className="scroll-mt-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-featured sm:p-6"
      aria-labelledby="runtime-calculator-title"
    >
      <p className="type-label text-accent">Start with the appliance</p>
      <h2 id="runtime-calculator-title" className="type-headline mt-1 text-neutral-900">
        Estimate power-station runtime
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">
        Choose a typical load or enter your measured watts. Estimates use 85% of rated battery
        capacity for AC output; actual runtime varies with appliance cycling, inverter losses,
        temperature, and battery age.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {APPLIANCES.map((appliance) => {
          const selected = !customLoad && appliance.name === selectedAppliance;
          return (
            <button
              key={appliance.name}
              type="button"
              disabled={!ready}
              aria-pressed={selected}
              onClick={() => chooseAppliance(appliance)}
              className={`min-h-12 rounded-lg border px-3 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60 ${
                selected
                  ? 'border-primary bg-primary-lightest text-primary'
                  : 'border-neutral-200 text-neutral-700 hover:border-primary/50'
              }`}
            >
              {appliance.name}
              <span className="mt-0.5 block text-xs font-normal text-neutral-500">
                Typical load: {appliance.watts}W
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="block text-sm font-semibold text-neutral-700">
          {customLoad ? 'Your load (watts)' : `${selectedAppliance} load (watts)`}
          <input
            type="number"
            min="1"
            max="5000"
            step="1"
            disabled={!ready}
            value={wattInput}
            onChange={(event) => {
              setWattInput(event.target.value);
              setCustomLoad(true);
            }}
            className="mt-1 block w-40 rounded-md border border-neutral-300 px-3 py-2 text-base font-normal text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-wait disabled:opacity-60"
            aria-describedby="runtime-load-help"
          />
        </label>
        <p id="runtime-load-help" className="pb-2 text-xs text-neutral-500">
          Use the appliance label or a watt meter for a better estimate.
        </p>
      </div>

      <div className="mt-5 border-t border-neutral-200 pt-4">
        <h3 className="text-sm font-bold text-neutral-900">
          Reviews with a listed continuous output of at least{' '}
          {validWatts ? `${watts.toLocaleString()}W` : '—'}
        </h3>
        {!validWatts ? (
          <p className="mt-3 text-sm text-neutral-600" role="status">
            Enter a load between 1W and 5,000W to see estimates.
          </p>
        ) : results.length > 0 ? (
          <ul className="mt-3 divide-y divide-neutral-100">
            {results.map((station) => (
              <li
                key={station.slug}
                className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <Link
                  href={`/articles/${station.slug}`}
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  {station.name}
                </Link>
                <span className="text-sm text-neutral-700">
                  About{' '}
                  {station.runtimeHours < 1
                    ? `${Math.max(1, Math.round(station.runtimeHours * 60))} minutes`
                    : `${station.runtimeHours.toFixed(1)} hours`}
                  <span className="text-neutral-500">
                    {' '}
                    · {station.capacityWh.toLocaleString()}Wh · {station.outputW?.toLocaleString()}W
                    listed output
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600" role="status">
            No reviewed model has both a listed battery capacity and continuous AC output at this
            load. Lower the wattage or check each product specification before choosing.
          </p>
        )}
        <p className="mt-3 text-xs leading-relaxed text-neutral-500">
          This is a planning estimate, not a runtime test. It checks continuous output only; motors
          and compressors may need more starting power. Check the product&apos;s surge rating and
          the appliance&apos;s requirements before relying on it.
        </p>
      </div>
    </section>
  );
}
