'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function WhatsAppCTA() {
  const waNumber = process.env.NEXT_PUBLIC_WA || '';
  
  return (
    <section className="py-12 bg-green-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">¿Necesitas ayuda urgente?</h2>
        <p className="text-xl mb-8">Comunicate con nosotros por WhatsApp y te responderemos al instante.</p>
        <Button asChild size="lg" className="bg-green-500 hover:bg-green-600">
          <Link
            href={`https://wa.me/${waNumber}?text=Hola%20👋%2C%20necesito%20información%20sobre%20sus%20productos%20y%20servicios.%20¿Me%20pueden%20ayudar?`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Chatear por WhatsApp
          </Link>
        </Button>
      </div>
    </section>
  );
}