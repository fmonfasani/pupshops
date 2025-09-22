import { Button } from './ui/button';
import { WhatsAppCTA } from './WhatsAppCTA';

export function Hero() {
  return (
    <section className="flex flex-col gap-6 rounded-3xl bg-gradient-to-r from-brand to-brand-dark px-8 py-12 text-white shadow-lg">
      <div className="flex flex-col gap-4 md:max-w-2xl">
        <span className="text-sm uppercase tracking-wide text-white/80">Bienvenido a Pupshops</span>
        <h1 className="text-4xl font-bold md:text-5xl">Todo lo que tu mascota necesita en un solo lugar</h1>
        <p className="text-lg text-white/90">
          Explora nuestro catálogo de productos premium, agenda servicios veterinarios y reservá turnos online en minutos.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button className="shadow-xl" variant="secondary">
          Ver catálogo
        </Button>
        <Button className="shadow-xl" variant="ghost">
          Reservar turno
        </Button>
        <WhatsAppCTA phone="5491122334455" />
      </div>
    </section>
  );
}
