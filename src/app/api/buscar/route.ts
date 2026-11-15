import type { NextRequest } from "next/server";
import { buscarPeliculas } from "@/lib/tmdb";

// Route Handler: el navegador llama a /api/buscar?q=... y este código, que corre
// en el servidor, consulta TMDB. Así la clave de la API nunca se expone.
export async function GET(request: NextRequest) {
  const consulta = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (consulta.length < 2) {
    return Response.json(
      { error: "Escribe al menos 2 caracteres para buscar." },
      { status: 400 },
    );
  }
  if (consulta.length > 100) {
    return Response.json({ error: "La búsqueda es demasiado larga." }, { status: 400 });
  }

  try {
    const datos = await buscarPeliculas(consulta);
    return Response.json({
      resultados: datos.results,
      total: datos.total_results,
    });
  } catch (error) {
    console.error("Error al buscar en TMDB:", error);
    return Response.json(
      { error: "No se pudo completar la búsqueda. Intenta de nuevo." },
      { status: 502 },
    );
  }
}
