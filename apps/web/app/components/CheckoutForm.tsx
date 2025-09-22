'use client';

import { FormEvent, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function CheckoutForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <Label htmlFor="name">Nombre completo</Label>
        <Input id="name" name="name" required placeholder="Juan Pérez" />
      </div>
      <div>
        <Label htmlFor="email">Correo electrónico</Label>
        <Input id="email" name="email" type="email" required placeholder="juan@correo.com" />
      </div>
      <div>
        <Label htmlFor="address">Dirección</Label>
        <Input id="address" name="address" required placeholder="Av. Siempreviva 742" />
      </div>
      <Button type="submit">Confirmar pedido</Button>
      {submitted && <p className="text-sm text-brand">¡Gracias por tu compra! Te enviaremos la confirmación por correo.</p>}
    </form>
  );
}
