"use client";

import { useEffect, useState } from "react";
import GrillaPeliculas, { GrillaEsqueleto } from "@/components/GrillaPeliculas";
import type { Pelicula } from "@/types/tmdb";

type Estado = "inicial" | "cargando" | "listo" | "error";

export default function Buscador() {
  const [texto, setTexto] = useState("");
  const [estado, setEstado] = useState<Estado>("inicial");
  const [resultados, setResultados] = useState<Pelicula[]>([]);
  const [mensajeError, setMensajeError] = useState("");
  const [intento, setIntento] = useState(0);

  const consulta = texto.trim();

  function alEscribir(valor: string) {
    setTexto(valor);
    // El estado se cambia aquí (y no dentro del efecto) para evitar renders extra.
    setEstado(valor.trim().length >= 2 ? "cargando" : "inicial");
  }

  function reintentar() {
    setEstado("cargando");
    setIntento((n) => n + 1);
  }

  // Efecto: espera 400 ms después de la última tecla (debounce) y consulta
  // nuestro Route Handler. Si el usuario sigue escribiendo, se cancela la
  // petición anterior para no mostrar resultados viejos.
  useEffect(() => {
    if (consulta.length < 2) return;

    const control = new AbortController();
    const temporizador = setTimeout(async () => {
      try {
        const res = await fetch(`/api/buscar?q=${encodeURIComponent(consulta)}`, {
          signal: control.signal,
        });
        const datos = await res.json();
        if (!res.ok) throw new Error(datos.error ?? "Error desconocido");
        setResultados(datos.resultados);
        setEstado("listo");
      } catch (error) {
        if (control.signal.aborted) return;
        setMensajeError(
          error instanceof Error && error.message !== "Failed to fetch"
            ? error.message
            : "No hay conexión con el servidor. Revisa tu internet.",
        );
        setEstado("error");
      }
    }, 400);

    return () => {
      clearTimeout(temporizador);
      control.abort();
    };
  }, [consulta, intento]);

  return (
    <div>
      <label htmlFor="busqueda" className="sr-only">
        Buscar películas
      </label>
      <input
        id="busqueda"
        type="search"
        value={texto}
        onChange={(e) => alEscribir(e.target.value)}
        placeholder="Ej. Interestelar, Coco, El Padrino…"
        autoComplete="off"
        maxLength={100}
        className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-base text-white placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none"
      />

      <div className="mt-6" aria-live="polite">
        {estado === "inicial" && (
          <p className="py-10 text-center text-sm text-zinc-500">
            Escribe al menos 2 letras para empezar a buscar.
          </p>
        )}

        {estado === "cargando" && <GrillaEsqueleto cantidad={5} />}

        {estado === "error" && (
          <div role="alert" className="py-10 text-center">
            <p className="text-sm text-rose-400">{mensajeError}</p>
            <button
              type="button"
              onClick={reintentar}
              className="mt-4 rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {estado === "listo" && resultados.length === 0 && (
          <p className="py-10 text-center text-sm text-zinc-400">
            No encontramos películas para “{consulta}”.
          </p>
        )}

        {estado === "listo" && resultados.length > 0 && (
          <>
            <p className="mb-4 text-sm text-zinc-400">
              Resultados para “{consulta}”
            </p>
            <GrillaPeliculas peliculas={resultados} />
          </>
        )}
      </div>
    </div>
  );
}
