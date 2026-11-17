# Auditoría técnica y rediseño · Segunda Vida, Caso 2, Parte 2

**Fecha:** 16 de noviembre de 2026  
**Rama de trabajo:** `auditoria-redisenio-2026`  
**Alcance:** revisión estática del repositorio y conciliación de fórmulas con el PDF adjunto `Diez_casos_Estudiantes_v2(3).pdf`.

## 1. Diagnóstico técnico

- `app/styles.css` existe en la ubicación esperada.
- `app/index.html` enlaza la hoja de estilos relativa a su propia carpeta y carga `app.js` con `defer`; se normalizaron las referencias como `./styles.css` y `./app.js`.
- La página `index.html` de la raíz redirige a `app/index.html`, por lo que el punto de entrada es compatible con la estructura de un sitio estático en GitHub Pages.
- No se encontró una ruta rota ni un selector del DOM claramente ausente en la inspección de las secciones de interfaz utilizadas por el motor.
- El CSS existente es válido a nivel de lectura estructural (no se identificó una regla rota a simple vista), pero está minificado en una sola línea, lo que dificulta su mantenimiento. Se añadieron reglas de accesibilidad y adaptación móvil al final, sin sustituir las reglas existentes.
- La inicialización de la aplicación se realiza al final del script diferido. Si el navegador conserva los marcadores de carga, eso indica que el render no terminó; la inspección del código no permitió reproducir ni atribuir ese comportamiento a una causa única. Debe verificarse en el navegador y en la consola de la instalación donde ocurre.

## 2. Fórmulas y comprobación independiente

Se conservaron los datos y las fórmulas. Con los datos base del caso:

| Elemento | Media (s) | Valoración | TN (s) | TE manual (s) |
|---|---:|---:|---:|---:|
| A | 30 | 100 % | 30 | 34.50 |
| B | 80 | 105 % | 84 | 96.60 |
| C | 120 | 95 % | 114 | 131.10 |
| D | 30 | 100 % | 30 | 34.50 |
| E | 40 | 100 % | 40 | 46.00 |

El ensayo automático se conserva en 60 s sin valoración ni suplemento. Se usa (TE=TN(1+0.15)), como establece el caso.

Para (r=0.30), fallo inicial (f=0.10) y recuperación (q=0.80):
- Rendimiento esperado: (Y=1-f+fq=0.98).
- Entradas para 196 buenos: (lceil196/0.98ceil=200).
- Entradas para 220 buenos: (lceil220/0.98ceil=225).

| Alternativa | Carga limitante (s/entrada) | Capacidad (entradas/turno) | Factibilidad para 196 |
|---|---:|---:|---|
| Referencia | 131.10 · Persona 1 | 192 | No |
| A · Organizador | 117.30 · Persona 1 | 214 | Sí |
| B · Cuarta persona | 103.95 · Persona 3 | 242 | Sí |

Para 196 buenos, A es la alternativa factible de menor coste incremental: 12.50 €/turno. B cuesta 100 €/turno. Para 220 buenos, B es la única alternativa obligatoria que alcanza las 225 entradas requeridas. No se alteraron estas conclusiones ni se introdujeron ahorros nuevos.

## 3. Muestreo y ergonomía

La aplicación conserva el conjunto de 300 observaciones del Caso 2: 210 de primera pasada (70 %), 36 de retrabajo (12 %), 39 de espera (13 %) y 15 de traslado (5 %). El dimensionamiento orientativo con (p=0.13), (z=1.96), (e=0.05) da 173.79, redondeado a 174 observaciones. El 12 % de instantes de retrabajo no se interpreta como tasa de fallo por unidad.

Se conserva la comparación de alcances cómodos 32, 37 y 42 cm y las distancias de contenedores 28, 35 y 48 cm. La ubicación frecuente de 28 cm queda dentro del alcance de los tres perfiles. No se añade un cálculo biomecánico: faltan datos físicos para hacerlo.

## 4. Cambios realizados en esta rama

- `app/styles.css`: refinamientos de foco visible, navegación, contraste, legibilidad de tablas, objetivos táctiles, distribución móvil, tablas ergonómicas sin desplazamiento horizontal innecesario y respeto a `prefers-reduced-motion`.
- `app/index.html`: rutas relativas explícitas, color de tema y anuncios accesibles `aria-live` en los KPI.
- `app/app.js`: la URL temporal de descarga CSV se revoca después de un breve margen para evitar interrumpir el inicio de la descarga.
- `datos/datos_caso2.json`: se actualizó la referencia bibliográfica al nombre del PDF adjunto; los valores del conjunto no se modificaron.

No se eliminaron módulos, alternativas, fórmulas ni datos de entrada.

## 5. Pruebas y limitaciones de verificación

- La matriz existente contiene ocho comprobaciones: tres referencias manuales, frontera, entrada inválida, no factibilidad, sensibilidad de mezcla y sensibilidad de rendimiento.
- El archivo `pruebas/resultados_ejecucion.md` registra históricamente 8/8 pruebas aprobadas y un smoke test de render. Ese registro también declara que no se completó una prueba visual de navegador.
- En esta intervención se inspeccionaron el runner, la matriz y las salidas registradas, y se recalcularon independientemente las referencias anteriores. **No se ejecutó Node.js ni un navegador real en esta sesión**, por lo que no se declara una nueva ejecución aprobada.
- Quedan pendientes la ejecución local de `node pruebas/test_runner.cjs`, `node --check app/app.js`, las pruebas visuales en navegador/dispositivos y la confirmación de la publicación Pages. El patrón reservado del docente tampoco está incluido; la conciliación con él sigue pendiente.

## 6. GitHub Pages

La estructura ya tiene un `index.html` en la raíz que dirige a `app/index.html`, y los recursos de la aplicación usan rutas relativas a `app/`. No se cambió la visibilidad del repositorio ni se habilitó una publicación pública. Antes de activar Pages, revisar la visibilidad del repositorio, el plan y el origen de publicación; publicar un repositorio no convierte automáticamente el sitio en privado.

## 7. Pasos de validación local pendientes

1. Descargar la rama de auditoría o abrir una copia limpia del repositorio.
2. Ejecutar `node --check app/app.js`.
3. Ejecutar `node pruebas/test_runner.cjs`.
4. Abrir `index.html` en un navegador y revisar consola, carga de `app/styles.css` y `app/app.js`.
5. Probar entradas base, demanda 220, mezcla (r=1), rendimiento mínimo 0.995, restauración, CSV e impresión.
6. Revisar anchos aproximados de 360, 390, 768, 1024 y 1440 px.
7. Si se publica, seleccionar la rama y carpeta correctas en Pages y probar la URL publicada.

