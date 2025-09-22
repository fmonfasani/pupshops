import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '../lib/utils';
import { Button } from './ui/button';

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    description: string;
    image: string;
    category: string;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative h-48 w-full overflow-hidden rounded-lg bg-slate-100">
        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wide text-brand">{product.category}</span>
        <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
        <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
        <p className="text-xl font-bold text-brand">{formatCurrency(product.price)}</p>
      </div>
      <div className="mt-auto flex gap-2">
        <Link href={`/producto/${product.slug}`} className="flex-1">
          <Button className="w-full" variant="secondary">
            Ver detalle
          </Button>
        </Link>
        <Button className="flex-1">Agregar</Button>
      </div>
    </article>
  );
}
