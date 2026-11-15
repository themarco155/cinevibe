"use client";

import { useFavoritos } from "@/lib/favoritos";
import type { PeliculaResumen } from "@/types/tmdb";

interface Props {
  pelicula: PeliculaResumen;
  variante?: "icono" | "completo";
}

export default function BotonFavorito({ pelicula, variante = "icono" }: Props) {
  const { esFavorito, alternar } = useFavoritos();
  const activo = esFavorito(pelicula.id);
  const etiqueta = activo ? "Quitar de favoritos" : "Agregar a favoritos";

  const corazon = (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={activo ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );

  if (variante === "completo") {
    return (
      <button
        type="button"
        onClick={() => alternar(pelicula)}
        aria-pressed={activo}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
          activo
            ? "bg-rose-500 text-white hover:bg-rose-400"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        {corazon}
        {etiqueta}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => alternar(pelicula)}
      aria-pressed={activo}
      aria-label={`${etiqueta}: ${pelicula.title}`}
      title={etiqueta}
      className={`absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition ${
        activo
          ? "bg-rose-500 text-white"
          : "bg-black/60 text-white hover:bg-black/80"
      }`}
    >
      {corazon}
    </button>
  );
}
