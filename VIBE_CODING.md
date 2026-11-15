# Proceso de Vibe Coding — CineVibe

Este documento registra cómo se construyó la aplicación usando IA como copiloto.

- **Herramienta de IA:** Claude (Anthropic), en modo agente con acceso a la carpeta del proyecto.
- **Mi rol:** definir la idea, elegir la temática, revisar lo generado, probar la app y hacer el despliegue.
- **Rol de la IA:** proponer la arquitectura, generar el código por partes, ejecutar `build` y `lint`, y corregir los errores que aparecieron.

## 1. Concepción inicial

La temática era libre. La IA propuso cuatro opciones que cumplían los requisitos (recetas, países, clima y películas) y elegí **películas** con la API de TMDB, porque permite mostrar listas, búsqueda, detalle y favoritos: cuatro rutas reales y no de relleno.

## 2. Prompts principales

| # | Prompt | Resultado |
| --- | --- | --- |
| 1 | Pegué el enunciado completo de la tarea (requisitos técnicos y entregables) y pedí: _"continuaremos con la siguiente tarea"_. | La IA revisó la carpeta de trabajo, comprobó las versiones de Node y Next.js y preguntó la temática antes de escribir código. |
| 2 | Elección de temática: _"Películas"_. | Plan de la app: 4 rutas, un Route Handler, favoritos en `localStorage`, y lista de commits por etapa. |

> Con un agente, un prompt bien detallado (el enunciado completo, con requisitos numerados) rinde más que muchos prompts cortos: la IA usó la lista de requisitos como lista de verificación.

| 3 | Le pasé a la IA mi clave de TMDB para configurar el proyecto. | La IA creó `.env.local` (que no se sube a GitHub) y me indicó cómo probar en mi PC. Confirmé que todo se veía bien. |
| 4 | _"Estoy importando el proyecto pero no veo la opción para agregar la variable"_ / _"ya hice deploy, ¿puedo igual agregarla?"_ | La IA me guió: Settings → Environment Variables en Vercel y luego Redeploy. |
| 5 | Le pasé la URL del despliegue. | La IA revisó la URL, detectó que era privada y encontró la pública (ver desafíos). |

## 3. Iteraciones

Cada iteración terminó con `tsc`, `eslint` y `next build` antes de hacer el commit.

| Iteración | Qué se generó | Commit |
| --- | --- | --- |
| 1 | Proyecto base con `create-next-app` (Next.js 16.4, TypeScript, Tailwind 4) | `chore: proyecto base…` |
| 2 | Cliente de TMDB, tipos, `.env.example` | `feat: cliente de TMDB…` |
| 3 | Layout, navbar, inicio con listas y paginación, botón de favorito, loading/error/404 | `feat: layout, navbar y pagina de inicio…` |
| 4 | Detalle de película con reparto, recomendaciones y su propio loading | `feat: pagina de detalle…` |
| 5 | Route Handler `/api/buscar` y buscador con `useState` + `useEffect` | `feat: busqueda con Route Handler…` |
| 6 | Página de favoritos con ordenamiento | `feat: pagina de favoritos…` |
| 7 | Pruebas de todas las rutas, README y este documento | `docs: …` |
| 8 | Prueba local con la clave real, subida a GitHub y despliegue en Vercel | `docs: agrega URL de produccion…` |

## 4. Decisiones técnicas

- **La clave de TMDB solo vive en el servidor.** Las páginas la usan desde Server Components y el buscador pasa por el Route Handler `/api/buscar`. Se comprobó que la clave no aparece en el HTML ni en los archivos JavaScript del navegador.
- **Cache Components (novedad de Next.js 16).** Las funciones de `src/lib/tmdb.ts` usan `"use cache"` con `cacheLife("hours")`: la misma lista no se vuelve a pedir a TMDB en cada visita.
- **Streaming con `<Suspense>`.** En el inicio, el título se prerenderiza y la lista llega después, mostrando un esqueleto mientras tanto.
- **Inicio con `searchParams` (`?lista=…&pagina=…`).** La pestaña y la página quedan en la URL: se pueden compartir y funcionan con el botón "atrás". Los valores inválidos vuelven a los valores por defecto.
- **Server y Client Components mezclados.** `TarjetaPelicula` es de servidor y dentro lleva `BotonFavorito`, que es de cliente. Solo se envía JavaScript para la parte interactiva.
- **Favoritos en `localStorage`.** No hace falta base de datos ni cuentas de usuario para el alcance de la tarea. Se guarda solo un resumen de cada película.
- **Imágenes sin re-optimizar.** TMDB ya entrega varios tamaños, así que se pide el tamaño justo y no se gasta la cuota de optimización de Vercel.
- **Fuentes del sistema** en lugar de Google Fonts: menos peso y la compilación no depende de una descarga externa.

## 5. Desafíos y cómo se resolvieron con IA

| Desafío | Solución |
| --- | --- |
| **Next.js 16 cambió el modelo de caché.** El proyecto nuevo trae `cacheComponents: true` y un archivo `AGENTS.md` que avisa que la versión es distinta a la que la IA conoce. | La IA leyó la documentación incluida en `node_modules/next/dist/docs` antes de escribir código. De ahí salió el uso de `"use cache"`, `<Suspense>` y la nueva firma de `error.tsx` (`retry` en lugar de `reset`). |
| **El inicio no debía depender de TMDB al compilar.** Con `"use cache"` una página sin parámetros se genera durante el `build`; si la clave falta, el despliegue falla. | La lista se lee según `searchParams` dentro de `<Suspense>`, así se resuelve en cada visita y el `build` no necesita la API. |
| **Código de servidor colándose al navegador.** `urlImagen` estaba en el mismo archivo que las funciones con `"use cache"` y la usan componentes de cliente. | Se separó en `src/lib/utilidades.ts` (compartido) y `src/lib/tmdb.ts` (solo servidor). |
| **La regla de ESLint de React no permite `setState` directo dentro de `useEffect`.** | En el buscador, el estado "cargando" se cambia en el evento `onChange` y el efecto solo hace la petición. Para `localStorage` se usó `useSyncExternalStore`, que además evita errores de hidratación. |
| **Resultados viejos al escribir rápido.** | Debounce de 400 ms y `AbortController` para cancelar la petición anterior. |
| **Google Fonts no se pudo descargar en el entorno de trabajo** y rompía la compilación. | Se cambió a fuentes del sistema. |
| **El entorno de la IA no tenía acceso a TMDB.** | Se agregó la variable opcional `TMDB_BASE_URL` y se probó con un servidor de prueba local que imita las respuestas de TMDB (lista, búsqueda vacía, 404 y error 500). |

### Desafíos del despliegue

| Desafío | Solución |
| --- | --- |
| **Desplegué en Vercel sin la variable `TMDB_API_KEY`.** No vi la sección al importar (viene plegada). | Se agregó después en Settings → Environment Variables y se hizo **Redeploy**, porque las variables solo se aplican en un despliegue nuevo. |
| **La primera URL que copié no era pública.** La dirección `…-git-main-….vercel.app` es la de la rama y pide iniciar sesión en Vercel. | La IA la abrió, vio que redirigía al login y comprobó que la URL pública de producción es <https://marcovibecine.vercel.app/>. |

## 6. Validación del código generado

- `npx tsc --noEmit` y `npm run lint`: sin errores.
- `npm run build`: compila; `/` y `/pelicula/[id]` quedan como _Partial Prerender_, `/buscar` y `/favoritos` como estáticas y `/api/buscar` como dinámica.
- Pruebas con la app compilada: las 4 rutas responden; parámetros inválidos (`?pagina=-4`, `/pelicula/abc`) no rompen la app; una película inexistente muestra la página 404; un fallo de TMDB muestra la pantalla de error; `/api/buscar` responde 400 a búsquedas muy cortas y 502 si TMDB falla.
- Prueba manual en mi PC con la clave real de TMDB: las páginas, los pósters y la búsqueda funcionan.
- En producción (<https://marcovibecine.vercel.app/>): el inicio carga las películas reales de TMDB.

## 7. Limitación conocida

Al usar streaming, una película que no existe muestra la página 404 pero el servidor responde con estado 200 (la respuesta ya había empezado). Es el comportamiento documentado de Next.js 16 con Cache Components.
