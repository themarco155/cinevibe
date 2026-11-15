import Link from "next/link";
import { Suspense } from "react";
import EnlacesNav from "@/components/EnlacesNav";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/85 backdrop-blur">
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3"
      >
        <Link href="/" className="text-lg font-bold tracking-tight">
          🎬 Cine<span className="text-amber-400">Vibe</span>
        </Link>
        <Suspense fallback={null}>
          <EnlacesNav />
        </Suspense>
      </nav>
    </header>
  );
}
