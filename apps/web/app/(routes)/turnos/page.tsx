'use client';

import { FormEvent, useState } from 'react';
import { DateTimePicker } from '../../../components/DateTimePicker';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

export default function BookingPage() {
  const [date, setDate] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Reservar un turno</h1>
        <p className="text-slate-600">Elegí el servicio, día y horario que mejor se adapte a tu mascota.</p>
      </header>
      <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <Label htmlFor="service">Servicio</Label>
          <Input id="service" required placeholder="Baño y corte" />
        </div>
        <div>
          <Label htmlFor="date">Fecha y hora</Label>
          <DateTimePicker value={date} onChange={setDate} />
        </div>
        <div>
          <Label htmlFor="notes">Notas adicionales</Label>
          <Input id="notes" placeholder="Detalles sobre tu mascota" />
        </div>
        <Button type="submit">Solicitar turno</Button>
        {submitted && <p className="text-sm text-brand">Recibimos tu solicitud. Te contactaremos a la brevedad.</p>}
      </form>
    </div>
  );
}
