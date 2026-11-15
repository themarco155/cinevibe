# 🎬 CineVibe

Aplicación web para explorar películas: cartelera, búsqueda por título, detalle de cada película y lista de favoritos. Hecha con **Next.js 16 (App Router) + TypeScript + Tailwind CSS** usando la metodología de **Vibe Coding** (IA como copiloto).

- **Demo en producción:** <https://marcovibecine.vercel.app/>
- **Repositorio:** <https://github.com/themarco155/cinevibe>
- **Proceso de Vibe Coding:** [VIBE_CODING.md](./VIBE_CODING.md)

## Funcionalidades

- **Inicio (`/`)**: listas de Populares, Mejor valoradas, Próximamente y En cartelera, con paginación.
- **Buscar (`/buscar`)**: búsqueda en vivo mientras escribes.
- **Detalle (`/pelicula/[id]`)**: sinopsis, géneros, duración, reparto y recomendaciones.
- **Favoritos (`/favoritos`)**: películas guardadas en el navegador, con ordenamiento.
- Diseño responsive (móvil y escritorio), estados de carga y de error.

## Cómo cumple los requisitos

| Requisito | Dónde está |
| --- | --- |
| Next.js 16+ con App Router | `package.json`, carpeta `src/app` |
| TypeScript | todo el código (`.ts` / `.tsx`), tipos en `src/types/tmdb.ts` |
| Tailwind CSS | clases en los componentes, `src/app/globals.css` |
| Mínimo 4 rutas | `/`, `/buscar`, `/pelicula/[id]`, `/favoritos` |
| API externa + Route Handler | API de TMDB en `src/lib/tmdb.ts`; Route Handler en `src/app/api/buscar/route.ts` |
| Server Components | `src/app/page.tsx`, `src/app/pelicula/[id]/page.tsx`, `TarjetaPelicula`, `Navbar` |
| Client Components | `Buscador`, `BotonFavorito`, `ListaFavoritos`, `EnlacesNav`, `error.tsx` |
| `useState` y `useEffect` | `src/components/Buscador.tsx` (ambos), `ListaFavoritos.tsx` (`useState`), `src/app/error.tsx` (`useEffect`) |
| Loading UI | `src/app/loading.tsx`, `src/app/pelicula/[id]/loading.tsx`, esqueletos con `<Suspense>` |
| Error UI | `src/app/error.tsx`, `src/app/not-found.tsx`, errores en el buscador |
| Variables de entorno | `.env.local` (no se sube) y `.env.example` |

## Instalación

Necesitas **Node.js 20.9 o superior** y una clave gratuita de TMDB.

```bash
# 1. Clonar e instalar
git clone https://github.com/themarco155/cinevibe.git
cd cinevibe
npm install

# 2. Variables de entorno
cp .env.example .env.local   # en Windows: copy .env.example .env.local
# Abre .env.local y pega tu clave en TMDB_API_KEY

# 3. Ejecutar en desarrollo
npm run dev
```

Abre <http://localhost:3000>.

### Cómo conseguir la clave de TMDB

1. Crea una cuenta gratis en <https://www.themoviedb.org/signup>.
2. Entra a **Ajustes → API** (<https://www.themoviedb.org/settings/api>) y solicita una clave de tipo _Developer_.
3. Copia la **API Key** (o el **Token de acceso de lectura**, sirven los dos) en `TMDB_API_KEY`.

### Variables de entorno

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `TMDB_API_KEY` | Sí | Clave de la API de TMDB. Solo se usa en el servidor. |
| `TMDB_BASE_URL` | No | URL base de la API. Solo para pruebas locales. |

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run start` | Ejecuta la versión compilada |
| `npm run lint` | Revisa el código con ESLint |

## Estructura

```
src/
├── app/
│   ├── page.tsx              # Inicio (Server Component + Suspense)
│   ├── loading.tsx           # Loading UI general
│   ├── error.tsx             # Error UI general
│   ├── not-found.tsx         # Página 404
│   ├── buscar/page.tsx       # Búsqueda
│   ├── favoritos/page.tsx    # Favoritos
│   ├── pelicula/[id]/        # Detalle (page.tsx + loading.tsx)
│   └── api/buscar/route.ts   # Route Handler
├── components/               # Componentes de servidor y de cliente
├── lib/
│   ├── tmdb.ts               # Cliente de TMDB (solo servidor, con caché)
│   ├── favoritos.ts          # Hook de favoritos (localStorage)
│   └── utilidades.ts         # Funciones compartidas
└── types/tmdb.ts             # Tipos de TypeScript
```

## Despliegue en Vercel

1. Entra a <https://vercel.com/new> e importa el repositorio de GitHub.
2. En **Environment Variables** agrega `TMDB_API_KEY` con tu clave.
3. Presiona **Deploy**. Cada `git push` a `main` vuelve a desplegar.

## Créditos

Datos e imágenes de [The Movie Database (TMDB)](https://www.themoviedb.org/). Este producto usa la API de TMDB, pero no está avalado ni certificado por TMDB.
