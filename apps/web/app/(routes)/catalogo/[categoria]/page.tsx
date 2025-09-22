import { notFound } from 'next/navigation';
import { ProductCard } from '../../../../components/ProductCard';

async function getProductsByCategory(category: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  const response = await fetch(`${baseUrl}/products`, { next: { revalidate: 60 } });
  if (!response.ok) {
    return [];
  }
  const products = await response.json();
  return products.filter((product: any) => product.category === category);
}

export default async function CatalogPage({ params }: { params: { categoria: string } }) {
  const products = await getProductsByCategory(params.categoria);
  if (!products.length) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Catálogo: {params.categoria}</h1>
        <p className="text-slate-600">Explorá todos los productos disponibles en la categoría seleccionada.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
