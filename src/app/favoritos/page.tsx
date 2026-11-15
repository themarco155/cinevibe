import type { Metadata } from "next";
import ListaFavoritos from "@/components/ListaFavoritos";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Tus películas guardadas.",
};

export default function PaginaFavoritos() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
        Mis favoritos
      </h1>
      <ListaFavoritos />
    </>
  );
}
