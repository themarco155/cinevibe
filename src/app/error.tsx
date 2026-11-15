"use client"; // Los límites de error deben ser Client Components

import { useEffect } from "react";

export default function ErrorPagina({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="mx-auto max-w-md py-16 text-center">
      <p className="text-5xl">🎞️</p>
      <h2 className="mt-4 text-xl font-bold">Algo salió mal</h2>
      <p className="mt-2 text-sm text-zinc-400">
        No pudimos cargar la información de las películas. Puede ser un problema
        temporal con el servicio de TMDB.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-6 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
