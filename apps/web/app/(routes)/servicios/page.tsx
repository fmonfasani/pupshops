import { ServiceCard } from '../../../components/ServiceCard';

async function getServices() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  const response = await fetch(`${baseUrl}/services`, { next: { revalidate: 60 } });
  if (!response.ok) {
    return [];
  }
  return response.json();
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Servicios Pupshops</h1>
        <p className="text-slate-600">Agendá turnos para baños, peluquería y consultas veterinarias desde nuestra web.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((service: any) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
