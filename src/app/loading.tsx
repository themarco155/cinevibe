import { GrillaEsqueleto } from "@/components/GrillaPeliculas";

// Loading UI general: se muestra mientras una página del servidor trae sus datos.
export default function Cargando() {
  return (
    <div>
      <div className="mb-6 h-8 w-56 animate-pulse rounded bg-zinc-800" />
      <GrillaEsqueleto />
    </div>
  );
}
