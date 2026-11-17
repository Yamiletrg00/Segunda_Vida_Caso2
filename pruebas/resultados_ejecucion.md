# Resultados de ejecución de pruebas

**Versión del modelo:** 1.0.0  
**Fecha:** 16 de noviembre de 2026  
**Entorno:** Node.js v22.16.0; motor JavaScript de app/app.js con DOM simulado mínimo para smoke test.  
**Resultado del runner:** **8 de 8 pruebas aprobadas**.  
**Sintaxis:** node --check app/app.js terminó sin errores.  
**Render smoke:** se generaron tablas de comparación y panel de escenario; esto no sustituye una prueba visual del navegador.

| ID | Verificación | Resultado |
|---|---|---|
| M-01 | Referencia, 196, 420 min, r=.30, Ymin=.98 | N=200; cap=192; no viable; cuello P1 |
| M-02 | A, 196, 420 min, r=.30, Ymin=.98 | N=200; cap=214; viable; 12.50 €/turno |
| M-03 | B, 220, 420 min, r=.30, Ymin=.98 | N=225; cap=242; viable; 100.00 €/turno |
| F-01 | A con 391 min y 390 min | 391: cap=200 y viable; 390: cap=199 y no viable |
| I-01 | r=1.20 | Rechazado con mensaje de validación |
| NF-01 | Referencia base | Identifica que N=200 supera capacidad 192 |
| C-01 | A con r=1.00 | Cap=133; cuello Persona 2 (C+E) |
| S-01 | Rendimiento mínimo=.995 | Ninguna alternativa obligatoria viable; Y=.98 |

Las referencias se calcularon manualmente y se compararon con las funciones JavaScript. Las tolerancias están en matriz_validacion.csv. La frontera prueba la igualdad y el valor de minutos inmediatamente inferior. C-01 verifica una característica del caso: una mayor proporción de ruta M aumenta los cambios de módulo y puede cambiar el cuello.

**Limitación de comprobación:** no se completó una prueba visual de navegador ni una prueba física en teléfono o computadora. Chromium headless no pudo inicializarse en este entorno (fallos D-Bus/zygote). El CSS incluye media queries y tablas desplazables; el equipo debe abrir la app en un navegador real y revisar varias anchuras. Esto no se registra como una prueba física o visual aprobada.

El patrón reservado del profesor no se recibió en el archivo fuente del estudiante. Esta matriz conserva referencias manuales independientes; completar conciliación contra el patrón cuando el docente lo libere, sin borrar la primera versión.