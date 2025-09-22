import { CheckoutForm } from '../../../components/CheckoutForm';

export default function CheckoutPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <p className="text-slate-600">Completá tus datos y confirmá tu pedido en Pupshops.</p>
      </header>
      <CheckoutForm />
    </div>
  );
}
