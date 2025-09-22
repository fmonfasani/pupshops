export default function AccountPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-slate-900">Mi cuenta</h1>
      <p className="text-slate-600">Iniciá sesión para ver tus pedidos, agendar turnos y actualizar tus datos personales.</p>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Próximamente podrás gestionar tu perfil completo, direcciones de envío, mascotas favoritas y medios de pago.
        </p>
      </div>
    </div>
  );
}
