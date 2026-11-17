# Segunda Vida · Caso 2 · Parte 2

Microherramienta web de apoyo a decisiones para el proyecto académico **Estudio y Diseño del Trabajo**. Está construida únicamente con HTML5, CSS3 y JavaScript nativo; no requiere instalación, servidor, API, credenciales ni conexión a internet.

## Quién la utilizaría y qué decisión apoya

La utilizaría el equipo que analiza el reacondicionamiento de mandos y, como apoyo a la decisión, la persona responsable de planear el pedido. Permite estimar las entradas necesarias para obtener una cantidad esperada de mandos buenos, comparar la capacidad de la **Referencia**, **A · Organizador de limpieza** y **B · Cuarta persona y nueva asignación**, comprobar las restricciones de materiales y rendimiento, identificar el cuello de botella y comparar el coste incremental por turno.

La decisión académica de referencia es planear **196 mandos buenos esperados por turno**, con rendimiento mínimo esperado de **98 %**, durante un horizonte de **20 turnos**. Se permite modificar cinco entradas: demanda buena, ventana neta en minutos por persona, alternativa en foco, proporción de ruta M y rendimiento mínimo esperado. Las tres alternativas se recalculan en paralelo.

## Cómo abrirla

1. Descarga o clona el repositorio.
2. Abre `index.html` en un navegador actualizado. La página raíz abre `app/index.html`.
3. Modifica las cinco entradas y revisa el comparador, la capacidad y la restricción limitante.
4. Usa **Restaurar base** para volver a 196 unidades, 420 minutos, A, r = 0.30 y rendimiento mínimo 0.98.
5. En **Validación**, ejecuta la matriz de pruebas. En el comparador puedes descargar un CSV de los resultados del escenario.

No se usan módulos ES ni dependencias remotas; la aplicación funciona al abrir el archivo localmente.

## Estructura

```text
/
  index.html                 # Entrada raíz y redirección a la app
  .nojekyll
  app/
    index.html               # Interfaz responsive
    styles.css               # Estilos
    app.js                   # Fórmulas, validación, cálculos y pruebas
  datos/
    datos_caso2.json         # Datos sintéticos y diccionario de variables
  documentacion/
    memoria_calculos.md      # Cálculo manual independiente y límites
    recomendacion_final.md   # Decisión integrada y sensibilidad
    registro_ia.md           # Declaración breve de uso de IA
  pruebas/
    matriz_validacion.csv    # Matriz esperada y conciliación
    resultados_ejecucion.md # Estado de pruebas ejecutadas
```

## Modelo en síntesis

- Tiempo normal: media de las observaciones × valoración.
- Tiempo estándar manual: tiempo normal × 1.15. El ensayo automático de 60 s no recibe valoración ni suplemento.
- Rendimiento esperado: `1 − 0.10 + 0.10 × 0.80 = 0.98`.
- Entradas planificadas: `techo(demanda buena / rendimiento)`.
- Capacidad de entradas: `piso(ventana neta en segundos / mayor carga estándar por persona y entrada)`.
- Factibilidad: entradas requeridas no mayores que capacidad ni que 300 materiales, y rendimiento esperado no menor al mínimo solicitado.
- Coste incremental por turno: Referencia = 0 €; A = 250 €/20 = 12.50 €; B = 200 €/20 + 90 € recurrentes = 100 €.

La explicación trazable está en `documentacion/memoria_calculos.md`.

## Datos y restricciones

Todos los datos del caso son **sintéticos y didácticos**. La asignación, frecuencias de ruta, tasa de fallo, recuperación, tiempos, costes y perfiles provienen de la ficha Caso 2 del PDF suministrado. Los datos fuente se conservan en `datos/datos_caso2.json`.

La aplicación implementa el alcance obligatorio **Referencia + A + B**. La alternativa C y el contrato de 99.5 % pertenecen a extensiones opcionales de la ficha; no se presentan como entregables obligatorios ni se inventa su resultado en la comparativa. El campo de rendimiento mínimo permite explorar escenarios altos; si ninguna alternativa cumple, la app lo indica.

## Pruebas

Pulsa **Ejecutar pruebas** en la sección Validación (runner Node.js; la versión registrada antes del nuevo caso R-01 reportó 8/8 pruebas aprobadas; ejecutar nuevamente el runner actualizado antes de entregar). La matriz usa tres referencias calculadas manualmente antes de programar, una frontera de capacidad (391 y 390 min), una entrada inválida, una alternativa no factible y una comprobación característica del cambio de mezcla de rutas. La tabla exportable se conserva en `pruebas/`.

El documento PDF señala que el anexo patrón del docente se libera después del checkpoint. Ese anexo no forma parte de los archivos suministrados en esta conversación; por ello las referencias que se documentan son cálculos manuales independientes y no se afirma que hayan sido contrastados con el patrón reservado. Se deberá completar esa conciliación cuando el equipo reciba dicho anexo.

## Qué no puede afirmar

- No garantiza la entrega por turno: es un modelo de medias en régimen.
- No modela colas, variabilidad detallada, secuencia de llegadas, buffers insuficientes ni probabilidades de servicio.
- No convierte el 12 % de instantes de retrabajo en tasa de fallo de unidades.
- No descuenta de nuevo pausas programadas ni agrega el 15 % a los 60 s automáticos.
- No certifica ergonomía o cumplimiento normativo, no diagnostica lesiones y no calcula biomecánica sin masa, fuerza, postura y demás insumos ausentes.
- No asigna segundos ahorrados por mover contenedores: la propuesta ergonómica es geométrica y no tiene un piloto cronometrado.
- No realiza un estudio MTM/MOST porque no se proporcionó la tabla autorizada del profesor.

La demostración académica debe emplear carcasas inertes, tarjetas y croquis. No se deben hacer reparaciones electrónicas reales ni manipular cargas o componentes peligrosos para simular el caso.

## GitHub y publicación

El desarrollo se preparó en la rama `parte2-web-app` del repositorio `Yamiletrg00/Segunda_Vida_Caso2`. GitHub Pages no se declara publicado por esta entrega. El repositorio se encontró con visibilidad **pública** durante esta revisión. No se confirmó que GitHub Pages esté habilitado ni que exista un despliegue publicado; después de integrar esta rama, se puede configurar Pages desde **Settings → Pages → Deploy from a branch → main / (root)**. El `index.html` raíz dirige a `app/index.html`. La versión local es una entrega válida según la ficha.

## Uso de IA

La IA se utilizó como apoyo para organizar el contenido del PDF, proponer la arquitectura estática, escribir y depurar la implementación, documentar las fórmulas y diseñar pruebas. Los datos no se sustituyeron por datos inventados. El equipo debe revisar los cálculos, completar el contraste contra el anexo patrón liberado por el docente y poder explicar personalmente fórmulas, decisiones y limitaciones. El detalle se encuentra en `documentacion/registro_ia.md`.