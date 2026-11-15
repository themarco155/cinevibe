// Loading UI del detalle: imita la forma de la página mientras cargan los datos.
export default function CargandoDetalle() {
  return (
    <div className="animate-pulse" role="status" aria-label="Cargando película">
      <div className="h-4 w-32 rounded bg-zinc-800" />
      <div className="mt-4 flex flex-col gap-6 rounded-2xl bg-zinc-900 p-5 sm:flex-row sm:p-8">
        <div className="mx-auto aspect-[2/3] w-44 shrink-0 rounded-xl bg-zinc-800 sm:mx-0 sm:w-56" />
        <div className="flex-1 space-y-3">
          <div className="h-9 w-3/4 rounded bg-zinc-800" />
          <div className="h-4 w-1/3 rounded bg-zinc-800" />
          <div className="h-4 w-full rounded bg-zinc-800" />
          <div className="h-4 w-full rounded bg-zinc-800" />
          <div className="h-4 w-2/3 rounded bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
