import Image from "next/image";
import Link from "next/link";
import BotonFavorito from "@/components/BotonFavorito";
import { anio, urlImagen } from "@/lib/utilidades";
import type { PeliculaResumen } from "@/types/tmdb";

export default function TarjetaPelicula({ pelicula }: { pelicula: PeliculaResumen }) {
  const poster = urlImagen(pelicula.poster_path);

  return (
    <article className="group relative">
      <BotonFavorito pelicula={pelicula} />
      <Link
        href={`/pelicula/${pelicula.id}`}
        className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-800">
          {poster ? (
            <Image
              src={poster}
              alt={`Póster de ${pelicula.title}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center p-3 text-center text-sm text-zinc-500">
              Sin póster
            </div>
          )}
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-zinc-100 group-hover:text-amber-400">
          {pelicula.title}
        </h3>
        <p className="mt-0.5 flex items-center gap-2 text-xs text-zinc-400">
          <span>{anio(pelicula.release_date)}</span>
          {pelicula.vote_average > 0 && (
            <span className="text-amber-400">
              ★ {pelicula.vote_average.toFixed(1)}
            </span>
          )}
        </p>
      </Link>
    </article>
  );
}
