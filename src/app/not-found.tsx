import Link from "next/link";

export default function NoEncontrado() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="text-6xl font-bold text-amber-400">404</p>
      <h2 className="mt-4 text-xl font-bold">No encontramos esa página</h2>
      <p className="mt-2 text-sm text-zinc-400">
        La película o la dirección que buscas no existe.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-300"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
