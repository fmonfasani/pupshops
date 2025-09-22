import { CartSheet } from '../../../components/CartSheet';

export default function CartPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-slate-900">Tu carrito</h1>
      <p className="text-slate-600">Gestioná los productos que querés comprar y finalizá tu pedido cuando estés listo.</p>
      <CartSheet />
    </div>
  );
}
