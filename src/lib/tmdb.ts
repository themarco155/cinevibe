// Cliente de TMDB. Solo se ejecuta en el servidor: la clave nunca llega al navegador.
import { cacheLife } from "next/cache";
import type { PeliculaDetalle, RespuestaLista } from "@/types/tmdb";

const BASE_URL = process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3";

export const LISTAS = {
  popular: "Populares",
  top_rated: "Mejor valoradas",
  upcoming: "Próximamente",
  now_playing: "En cartelera",
} as const;

export type Lista = keyof typeof LISTAS;

export function esLista(valor: unknown): valor is Lista {
  return typeof valor === "string" && valor in LISTAS;
}

export class TmdbError extends Error {
  constructor(
    mensaje: string,
    public status: number,
  ) {
    super(mensaje);
    this.name = "TmdbError";
  }
}

async function tmdbFetch<T>(
  ruta: string,
  params: Record<string, string> = {},
): Promise<T> {
  const clave = process.env.TMDB_API_KEY;
  if (!clave) {
    throw new TmdbError(
      "Falta la variable de entorno TMDB_API_KEY. Revisa el archivo .env.local.",
      500,
    );
  }

  const url = new URL(`${BASE_URL}${ruta}`);
  url.searchParams.set("language", "es-MX");
  for (const [nombre, valor] of Object.entries(params)) {
    url.searchParams.set(nombre, valor);
  }

  // TMDB acepta dos tipos de credencial: la "API Key" corta (va en la URL)
  // o el "Token de acceso de lectura" largo (va en la cabecera Authorization).
  const headers: HeadersInit = { accept: "application/json" };
  if (clave.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${clave}`;
  } else {
    url.searchParams.set("api_key", clave);
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new TmdbError(`TMDB respondió con el estado ${res.status}`, res.status);
  }
  return res.json() as Promise<T>;
}

export async function obtenerLista(lista: Lista, pagina = 1) {
  "use cache";
  cacheLife("hours");
  return tmdbFetch<RespuestaLista>(`/movie/${lista}`, { page: String(pagina) });
}

export async function buscarPeliculas(consulta: string, pagina = 1) {
  "use cache";
  cacheLife("hours");
  return tmdbFetch<RespuestaLista>("/search/movie", {
    query: consulta,
    page: String(pagina),
    include_adult: "false",
  });
}

// Devuelve null si la película no existe (404) para poder mostrar la página 404.
export async function obtenerPelicula(id: number) {
  "use cache";
  cacheLife("hours");
  try {
    return await tmdbFetch<PeliculaDetalle>(`/movie/${id}`, {
      append_to_response: "credits,recommendations",
    });
  } catch (error) {
    if (error instanceof TmdbError && error.status === 404) return null;
    throw error;
  }
}

type Tamano = "w185" | "w342" | "w500" | "w1280";

export function urlImagen(ruta: string | null, tamano: Tamano = "w342") {
  return ruta ? `https://image.tmdb.org/t/p/${tamano}${ruta}` : null;
}
