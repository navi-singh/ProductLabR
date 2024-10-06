import { Header } from '@/components/Header';
import { ReviewsList } from '@/components/PostsList';
import { Newsletter } from '@/components/Newsletter';
import { Top10Popular } from '@/components/Top10Popular';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-grow px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <main className="container mx-auto flex flex-grow flex-col px-4 py-8 md:flex-row">
              <article className="md:w-2/3 md:pr-8">
                <nav className="mb-4 text-sm">
                  <Link href="/">Home</Link> &gt; <Link href="/outdoor">Outdoor</Link> &gt;{' '}
                  <Link href="/hunt-fish">Hunt & Fish</Link>
                </nav>
                <h1 className="mb-4 text-4xl font-bold">
                  Field to Fire: Exploring Wild Game Cooking With Andrew Zimmern
                </h1>
                <p className="mb-4">
                  I had the chance to ask the host some questions about his new show and what it
                  means to be a hunter and prepare your own wild game.
                </p>
                <div className="mb-4 flex items-center">
                  <span className="mr-4">Written by Rachelle Schrute</span>
                  <span>Oct 03, 2024 3:51 p.m. ET</span>
                </div>
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Andrew Zimmern holding a dish"
                  width={600}
                  height={400}
                  className="mb-4"
                />
                <p className="mb-4">
                  A new cooking show has found its way onto the Outdoor Channel, and it's hot and
                  wild. Field to Fire will showcase what it really looks like to harvest your own
                  game and prepare it over an open flame.
                </p>
                <p>
                  Andrew Zimmern, a lifelong outdoorsman and chef, is heading back into the wild to
                  source his favorite proteins. From wild pigs in Oklahoma to redfish in Louisiana,
                  Field to Fire will showcase the incredible wild feasts the field has to offer.
                </p>
              </article>
            </main>
          </div>
          <Top10Popular />
        </div>
      </main>
    </div>
  );
}
