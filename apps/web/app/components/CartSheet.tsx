'use client';

import { useState } from 'react';
import { Button } from './ui/button';

export function CartSheet() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button onClick={() => setOpen((prev) => !prev)} variant="secondary">
        {open ? 'Cerrar carrito' : 'Abrir carrito'}
      </Button>
      {open && (
        <div className="absolute right-0 mt-3 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
          <h3 className="text-lg font-semibold">Tu carrito</h3>
          <p className="text-sm text-slate-600">Aún no agregaste productos. Explora el catálogo y añadí tus favoritos.</p>
        </div>
      )}
    </div>
  );
}
