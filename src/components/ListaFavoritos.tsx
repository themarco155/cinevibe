"use client";

import Link from "next/link";
import { useState } from "react";
import GrillaPeliculas, { GrillaEsqueleto } from "@/components/GrillaPeliculas";
import { useFavoritos } from "@/lib/favoritos";

type Orden = "recientes" | "titulo" | "puntaje";

export default function ListaFavoritos() {
  const { favoritos, listo } = useFavoritos();
  const [orden, setOrden] = useState<Orden>("recientes");

  // localStorage solo existe en el navegador: mientras tanto mostramos el
  // esqueleto para no parpadear con "no tienes favoritos".
  if (!listo) return <GrillaEsqueleto cantidad={5} />;

  if (favoritos.length === 0) {
    return (
      <div className="py-14 text-center">
        <p className="text-5xl">🍿</p>
        <p className="mt-4 text-sm text-zinc-400">
          Todavía no tienes favoritos. Toca el corazón de una película para
          guardarla aquí.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
        >
          Explorar películas
        </Link>
      </div>
    );
  }

  const ordenados = [...favoritos];
  if (orden === "titulo") ordenados.sort((a, b) => a.title.localeCompare(b.title, "es"));
  if (orden === "puntaje") ordenados.sort((a, b) => b.vote_average - a.vote_average);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-zinc-400">
          {favoritos.length} {favoritos.length === 1 ? "película" : "películas"}
        </p>
        <label className="flex items-center gap-2 text-zinc-400">
          Ordenar por
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as Orden)}
            className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 text-white"
          >
            <option value="recientes">Más recientes</option>
            <option value="titulo">Título (A-Z)</option>
            <option value="puntaje">Mejor puntaje</option>
          </select>
        </label>
      </div>
      <GrillaPeliculas peliculas={ordenados} />
    </>
  );
}
