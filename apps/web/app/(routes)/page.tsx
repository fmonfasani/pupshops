import { Hero } from '../../components/Hero';
import { PromoRibbon } from '../../components/PromoRibbon';
import { ProductCard } from '../../components/ProductCard';
import { ServiceCard } from '../../components/ServiceCard';

async function fetchFromApi<T>(path: string): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      next: { revalidate: 60 }
    });
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  } catch (error) {
    console.error('API request failed', error);
    return [] as T;
  }
}

export default async function HomePage() {
  const [products, services] = await Promise.all([
    fetchFromApi<Array<any>>('/products'),
    fetchFromApi<Array<any>>('/services')
  ]);

  return (
    <div className="flex flex-col gap-12">
      <Hero />
      <PromoRibbon />

      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Productos destacados</h2>
          <span className="text-sm text-slate-500">{products.length} productos disponibles</span>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Servicios para tu mascota</h2>
          <span className="text-sm text-slate-500">{services.length} servicios disponibles</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>
    </div>
  );
}
