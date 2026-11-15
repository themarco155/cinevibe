import TarjetaPelicula from "@/components/TarjetaPelicula";
import type { PeliculaResumen } from "@/types/tmdb";

const CLASES_GRILLA =
  "grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

export default function GrillaPeliculas({ peliculas }: { peliculas: PeliculaResumen[] }) {
  return (
    <div className={CLASES_GRILLA}>
      {peliculas.map((pelicula) => (
        <TarjetaPelicula key={pelicula.id} pelicula={pelicula} />
      ))}
    </div>
  );
}

// Estado de carga: tarjetas grises con animación mientras llegan los datos.
export function GrillaEsqueleto({ cantidad = 10 }: { cantidad?: number }) {
  return (
    <div className={CLASES_GRILLA} role="status" aria-label="Cargando películas">
      {Array.from({ length: cantidad }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[2/3] rounded-xl bg-zinc-800" />
          <div className="mt-2 h-4 w-4/5 rounded bg-zinc-800" />
          <div className="mt-1.5 h-3 w-2/5 rounded bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}
