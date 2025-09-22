import Link from 'next/link';
import { formatCurrency } from '../lib/utils';
import { Button } from './ui/button';

type ServiceCardProps = {
  service: {
    id: number;
    name: string;
    slug: string;
    description: string;
    durationMinutes: number;
    price: number;
  };
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">{service.name}</h3>
      <p className="text-sm text-slate-600 line-clamp-3">{service.description}</p>
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Duración: {service.durationMinutes} minutos</span>
        <span className="text-lg font-semibold text-brand">{formatCurrency(service.price)}</span>
      </div>
      <div className="mt-auto flex gap-2">
        <Link href={`/servicios/${service.slug}`} className="flex-1">
          <Button className="w-full" variant="secondary">
            Ver detalles
          </Button>
        </Link>
        <Link href="/turnos" className="flex-1">
          <Button className="w-full">Reservar</Button>
        </Link>
      </div>
    </article>
  );
}
