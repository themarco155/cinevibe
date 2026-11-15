// Funciones y constantes que se pueden usar tanto en el servidor como en el navegador.

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

type Tamano = "w185" | "w342" | "w500" | "w1280";

export function urlImagen(ruta: string | null, tamano: Tamano = "w342") {
  return ruta ? `https://image.tmdb.org/t/p/${tamano}${ruta}` : null;
}

export function anio(fecha: string | undefined) {
  return fecha ? fecha.slice(0, 4) : "s/f";
}

export function duracion(minutos: number | null) {
  if (!minutos) return null;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return h ? `${h} h ${m} min` : `${m} min`;
}
