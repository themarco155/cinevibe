import Link from "next/link";
import { Suspense } from "react";
import GrillaPeliculas, { GrillaEsqueleto } from "@/components/GrillaPeliculas";
import { obtenerLista } from "@/lib/tmdb";
import { LISTAS, esLista, type Lista } from "@/lib/utilidades";

const MAX_PAGINAS = 500; // límite de la API de TMDB

// Server Component: la parte fija (título) se prerenderiza y la lista de
// películas llega por streaming dentro de <Suspense>.
export default function Inicio({ searchParams }: PageProps<"/">) {
  return (
    <>
      <section className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Descubre tu próxima película
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Explora la cartelera, busca títulos y guarda tus favoritas.
        </p>
      </section>
      <Suspense fallback={<GrillaEsqueleto />}>
        <ListaPeliculas searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function ListaPeliculas({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const { lista: listaParam, pagina: paginaParam } = await searchParams;
  const lista: Lista = esLista(listaParam) ? listaParam : "popular";
  const numero = Number(paginaParam);
  const pagina =
    Number.isInteger(numero) && numero >= 1 && numero <= MAX_PAGINAS ? numero : 1;

  const datos = await obtenerLista(lista, pagina);
  const totalPaginas = Math.min(datos.total_pages, MAX_PAGINAS);
  const enlace = (p: number) => `/?lista=${lista}&pagina=${p}`;

  return (
    <>
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {(Object.keys(LISTAS) as Lista[]).map((clave) => (
          <Link
            key={clave}
            href={`/?lista=${clave}`}
            aria-current={clave === lista ? "page" : undefined}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              clave === lista
                ? "bg-white text-zinc-950"
                : "bg-white/10 text-zinc-300 hover:bg-white/20"
            }`}
          >
            {LISTAS[clave]}
          </Link>
        ))}
      </div>

      <GrillaPeliculas peliculas={datos.results} />

      <nav
        aria-label="Paginación"
        className="mt-8 flex items-center justify-center gap-4 text-sm"
      >
        {pagina > 1 ? (
          <Link href={enlace(pagina - 1)} className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/20">
            ← Anterior
          </Link>
        ) : (
          <span className="rounded-full px-4 py-2 text-zinc-600">← Anterior</span>
        )}
        <span className="text-zinc-400">
          Página {pagina} de {totalPaginas}
        </span>
        {pagina < totalPaginas ? (
          <Link href={enlace(pagina + 1)} className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/20">
            Siguiente →
          </Link>
        ) : (
          <span className="rounded-full px-4 py-2 text-zinc-600">Siguiente →</span>
        )}
      </nav>
    </>
  );
}
