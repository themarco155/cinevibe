import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CineVibe · Explora películas",
    template: "%s · CineVibe",
  },
  description:
    "Explora películas populares, busca títulos y guarda tus favoritas. Hecho con Next.js 16 y la API de TMDB.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
          {children}
        </main>
        <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-zinc-500">
          <p>Proyecto de Vibe Coding · Kodigo Full Stack Junior</p>
          <p className="mt-1">
            Este producto usa la API de TMDB, pero no está avalado ni certificado
            por TMDB.
          </p>
        </footer>
      </body>
    </html>
  );
}
