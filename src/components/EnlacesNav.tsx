"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavoritos } from "@/lib/favoritos";

const ENLACES = [
  { href: "/", texto: "Inicio" },
  { href: "/buscar", texto: "Buscar" },
  { href: "/favoritos", texto: "Favoritos" },
];

export default function EnlacesNav() {
  const ruta = usePathname();
  const { favoritos } = useFavoritos();

  return (
    <ul className="flex items-center gap-1 text-sm font-medium">
      {ENLACES.map(({ href, texto }) => {
        const activo = href === "/" ? ruta === "/" : ruta.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={activo ? "page" : undefined}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${
                activo
                  ? "bg-amber-400 text-zinc-950"
                  : "text-zinc-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {texto}
              {href === "/favoritos" && favoritos.length > 0 && (
                <span
                  className={`rounded-full px-1.5 text-xs ${
                    activo ? "bg-zinc-950 text-amber-400" : "bg-rose-500 text-white"
                  }`}
                >
                  {favoritos.length}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
