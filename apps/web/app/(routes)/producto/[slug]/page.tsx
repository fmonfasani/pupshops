import { notFound } from 'next/navigation';
import Image from 'next/image';
import { formatCurrency } from '../../../../lib/utils';
import { Button } from '../../../../components/ui/button';

async function getProduct(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  const response = await fetch(`${baseUrl}/products`, { next: { revalidate: 60 } });
  if (!response.ok) {
    return null;
  }
  const products = await response.json();
  return products.find((product: any) => product.slug === slug) ?? null;
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="relative h-96 w-full overflow-hidden rounded-3xl bg-slate-100">
        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-sm uppercase tracking-wide text-brand">{product.category}</span>
          <h1 className="text-4xl font-bold text-slate-900">{product.name}</h1>
          <p className="text-slate-600">{product.description}</p>
        </div>
        <p className="text-3xl font-bold text-brand">{formatCurrency(product.price)}</p>
        <Button className="max-w-sm">Agregar al carrito</Button>
      </div>
    </div>
  );
}
