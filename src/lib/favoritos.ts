"use client";

// Favoritos guardados en localStorage. Se usa useSyncExternalStore para que
// todos los componentes (tarjetas, navbar, página de favoritos) se actualicen
// a la vez y sin errores de hidratación.
import { useSyncExternalStore } from "react";
import type { PeliculaResumen } from "@/types/tmdb";

const CLAVE = "cineapp:favoritos";
const EVENTO = "cineapp:favoritos-cambio";
const VACIO: PeliculaResumen[] = [];

let crudoCache: string | null = null;
let listaCache: PeliculaResumen[] = VACIO;

function leer(): PeliculaResumen[] {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (crudo !== crudoCache) {
      crudoCache = crudo;
      const datos: unknown = crudo ? JSON.parse(crudo) : [];
      listaCache = Array.isArray(datos) ? datos : VACIO;
    }
  } catch {
    listaCache = VACIO;
  }
  return listaCache;
}

function suscribir(avisar: () => void) {
  window.addEventListener("storage", avisar);
  window.addEventListener(EVENTO, avisar);
  return () => {
    window.removeEventListener("storage", avisar);
    window.removeEventListener(EVENTO, avisar);
  };
}

function guardar(lista: PeliculaResumen[]) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista));
  } catch {
    // Sin espacio o modo privado: se ignora, la app sigue funcionando.
  }
  window.dispatchEvent(new Event(EVENTO));
}

export function useFavoritos() {
  const favoritos = useSyncExternalStore(suscribir, leer, () => VACIO);

  function esFavorito(id: number) {
    return favoritos.some((p) => p.id === id);
  }

  function alternar(pelicula: PeliculaResumen) {
    const actual = leer();
    const resumen: PeliculaResumen = {
      id: pelicula.id,
      title: pelicula.title,
      poster_path: pelicula.poster_path,
      release_date: pelicula.release_date,
      vote_average: pelicula.vote_average,
    };
    guardar(
      actual.some((p) => p.id === pelicula.id)
        ? actual.filter((p) => p.id !== pelicula.id)
        : [resumen, ...actual],
    );
  }

  return { favoritos, esFavorito, alternar };
}
