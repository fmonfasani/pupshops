'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HeroProps {
  variant: 'A' | 'B';
  title: string;
  description: string;
  primaryCTA: { text: string; href: string };
  secondaryCTA: { text: string; href: string };
}

export function Hero({ variant, title, description, primaryCTA, secondaryCTA }: HeroProps) {
  return (
    <section className={`py-20 ${variant === 'A' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
          <p className="text-xl mb-10">{description}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className={variant === 'A' ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'}>
              <Link href={primaryCTA.href}>{primaryCTA.text}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className={variant === 'A' ? 'border-white text-white hover:bg-white hover:text-blue-600' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}>
              <Link href={secondaryCTA.href}>{secondaryCTA.text}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}