import { notFound } from 'next/navigation';
import { formatCurrency } from '../../../../lib/utils';
import { Button } from '../../../../components/ui/button';

async function getService(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  const response = await fetch(`${baseUrl}/services`, { next: { revalidate: 60 } });
  if (!response.ok) {
    return null;
  }
  const services = await response.json();
  return services.find((service: any) => service.slug === slug) ?? null;
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);
  if (!service) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
      <div>
        <span className="text-sm uppercase tracking-wide text-brand">Servicio</span>
        <h1 className="mt-1 text-4xl font-bold text-slate-900">{service.name}</h1>
      </div>
      <p className="text-lg text-slate-600">{service.description}</p>
      <div className="flex flex-col gap-2 text-sm text-slate-500">
        <span>Duración estimada: {service.durationMinutes} minutos</span>
        <span>Precio: {formatCurrency(service.price)}</span>
      </div>
      <Button className="max-w-xs">Reservar turno</Button>
    </div>
  );
}
