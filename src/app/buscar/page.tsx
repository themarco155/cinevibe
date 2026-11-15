import type { Metadata } from "next";
import Buscador from "@/components/Buscador";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busca películas por título.",
};

// Server Component que muestra el título y delega la parte interactiva
// al Client Component <Buscador />.
export default function PaginaBuscar() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
        Buscar películas
      </h1>
      <Buscador />
    </>
  );
}
