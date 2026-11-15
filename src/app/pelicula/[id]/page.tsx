import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BotonFavorito from "@/components/BotonFavorito";
import GrillaPeliculas from "@/components/GrillaPeliculas";
import { obtenerPelicula } from "@/lib/tmdb";
import { anio, duracion, urlImagen } from "@/lib/utilidades";

type Props = PageProps<"/pelicula/[id]">;

// Convierte el parámetro de la URL en un id válido, o null si no es un número.
function leerId(texto: string) {
  return /^\d{1,9}$/.test(texto) ? Number(texto) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = leerId((await params).id);
  const pelicula = id ? await obtenerPelicula(id) : null;
  if (!pelicula) return { title: "Película no encontrada" };
  return {
    title: pelicula.title,
    description: pelicula.overview || undefined,
  };
}

export default async function DetallePelicula({ params }: Props) {
  const id = leerId((await params).id);
  if (!id) notFound();

  const pelicula = await obtenerPelicula(id);
  if (!pelicula) notFound();

  const poster = urlImagen(pelicula.poster_path, "w500");
  const fondo = urlImagen(pelicula.backdrop_path, "w1280");
  const reparto = pelicula.credits?.cast.slice(0, 8) ?? [];
  const recomendadas = pelicula.recommendations?.results.slice(0, 5) ?? [];
  const tiempo = duracion(pelicula.runtime);

  return (
    <article>
      <Link href="/" className="text-sm text-zinc-400 hover:text-white">
        ← Volver al inicio
      </Link>

      <div className="relative mt-4 overflow-hidden rounded-2xl bg-zinc-900">
        {fondo && (
          <Image
            src={fondo}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
        )}
        <div className="relative flex flex-col gap-6 p-5 sm:flex-row sm:p-8">
          <div className="relative mx-auto aspect-[2/3] w-44 shrink-0 overflow-hidden rounded-xl bg-zinc-800 sm:mx-0 sm:w-56">
            {poster ? (
              <Image
                src={poster}
                alt={`Póster de ${pelicula.title}`}
                fill
                priority
                sizes="224px"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-sm text-zinc-500">
                Sin póster
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
              {pelicula.title}
            </h1>
            {pelicula.tagline && (
              <p className="mt-1 italic text-zinc-400">{pelicula.tagline}</p>
            )}

            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-300">
              <span>{anio(pelicula.release_date)}</span>
              {tiempo && <span>· {tiempo}</span>}
              {pelicula.vote_average > 0 && (
                <span className="font-semibold text-amber-400">
                  ★ {pelicula.vote_average.toFixed(1)} / 10
                </span>
              )}
            </p>

            <ul className="mt-3 flex flex-wrap gap-2">
              {pelicula.genres.map((genero) => (
                <li
                  key={genero.id}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-200"
                >
                  {genero.name}
                </li>
              ))}
            </ul>

            <h2 className="mt-5 text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Sinopsis
            </h2>
            <p className="mt-1 max-w-prose text-sm leading-relaxed text-zinc-200">
              {pelicula.overview || "Esta película no tiene sinopsis en español."}
            </p>

            <div className="mt-6">
              <BotonFavorito pelicula={pelicula} variante="completo" />
            </div>
          </div>
        </div>
      </div>

      {reparto.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold">Reparto principal</h2>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {reparto.map((actor) => (
              <li key={actor.id} className="rounded-xl bg-white/5 p-3">
                <p className="truncate text-sm font-semibold">{actor.name}</p>
                <p className="truncate text-xs text-zinc-400">{actor.character}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {recomendadas.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold">También te puede gustar</h2>
          <GrillaPeliculas peliculas={recomendadas} />
        </section>
      )}
    </article>
  );
}
