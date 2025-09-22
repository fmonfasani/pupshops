import Link from 'next/link';
import { Button } from './ui/button';

type WhatsAppCTAProps = {
  phone: string;
};

export function WhatsAppCTA({ phone }: WhatsAppCTAProps) {
  const url = `https://wa.me/${phone}?text=Hola!%20Quiero%20saber%20m%C3%A1s%20sobre%20Pupshops`;

  return (
    <Link href={url} target="_blank" rel="noreferrer">
      <Button variant="secondary">Hablar por WhatsApp</Button>
    </Link>
  );
}
