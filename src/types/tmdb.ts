// Tipos de los datos que devuelve la API de TMDB (solo los campos que usamos)

export interface Pelicula {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface Genero {
  id: number;
  name: string;
}

export interface Actor {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface PeliculaDetalle extends Pelicula {
  tagline: string;
  runtime: number | null;
  genres: Genero[];
  credits?: { cast: Actor[] };
  recommendations?: { results: Pelicula[] };
}

export interface RespuestaLista {
  page: number;
  results: Pelicula[];
  total_pages: number;
  total_results: number;
}

// Versión reducida que guardamos en favoritos (localStorage)
export type PeliculaResumen = Pick<
  Pelicula,
  "id" | "title" | "poster_path" | "release_date" | "vote_average"
>;
