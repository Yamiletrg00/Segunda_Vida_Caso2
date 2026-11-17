# Memoria de cálculos independiente · Caso 2, Parte 2

**Fuente:** PDF Diez casos para equipos de Estudio y Diseño del Trabajo, Caso 2, pp. 19–22. Los datos son sintéticos. Esta memoria se calculó independientemente antes de codificar; no se copiaron salidas del programa.

## 1. Datos y convenciones

Tres personas; 480 min nominales menos 60 min programados = 420 min netos = 25,200 s por recurso. Hay 300 mandos de material por turno, amortización de inversión a 20 turnos y presupuesto de inversión máximo de 1,000 €. La mezcla base es 70 % L y 30 % M. Ambas rutas se limpian; solo M recibe un cambio inicial. El 10 % de las entradas falla la primera prueba, requiere un cambio adicional y una segunda prueba. Se recupera el 80 % de los reintentos; el 20 % restante se descarta. Máximo dos pruebas. El ensayo automático ocupa 60 s sin suplemento. Suplemento manual: TE = TN × 1.15; TN = media observada × valoración.

## 2. Tiempos observados, normales y estándar

| Elemento | Media (s) | Valoración | TN (s) | TE (s) |
|---|---:|---:|---:|---:|
| A · Clasificar y registrar | 30 | 100 % | 30 | 34.50 |
| B · Limpiar y trasladar | 80 | 105 % | 84 | 96.60 |
| C · Cambio de módulo | 120 | 95 % | 114 | 131.10 |
| D · Manejo manual de prueba | 30 | 100 % | 30 | 34.50 |
| E · Embalar y guardar un bueno | 40 | 100 % | 40 | 46.00 |

Ejemplo B: media = (78+82+80+81+79+80)/6 = 80 s; TN = 80×1.05 = 84 s; TE = 84×1.15 = 96.60 s. Una prueba ocupa el banco durante D estándar + automático = 34.50+60 = 94.50 s. En la alternativa A, B pasa a 72 s normales según el piloto; TE nuevo = 72×1.15 = 82.80 s.

## 3. Cantidades por cada 100 entradas

Con r=0.30 y tasa de fallo f=0.10: 70 siguen L, 30 siguen M; 30 cambios iniciales; 100 primeras pruebas; 10 fallos; 10 cambios adicionales y 10 segundas pruebas; 8 recuperados y 2 descartados. Buenos esperados = 90 que pasan la primera + 8 recuperados = 98. Rendimiento Y = 1−f+f×0.80 = 0.98. No se debe confundir r (mezcla M) con f (fallo de primera prueba), ni el 12 % de instantes de retrabajo del muestreo con una tasa de fallo por unidad.

## 4. Cargas estándar por persona y entrada

Con r=.30, f=.10, Y=.98; la carga de cambios de módulo es (r+f)×TE_C; pruebas por entrada = 1+f; embalaje = Y×TE_E.

| Alternativa | P1 | P2 | P3 | P4 | Cuello | Capacidad entradas/turno |
|---|---:|---:|---:|---:|---|---:|
| Referencia | A+B = 131.10 | C+E = 97.52 | D+auto = 103.95 | — | P1 | 192 |
| A · Organizador | A+B nuevo = 117.30 | 97.52 | 103.95 | — | P1 | 214 |
| B · Cuarta persona | B = 96.60 | C = 52.44 | D+auto = 103.95 | A+E = 79.58 | P3 | 242 |

Ejemplos: P2 referencia = (.30+.10)×131.10 + .98×46 = 97.52 s/entrada. P3 = (1+.10)×(34.50+60) = 103.95 s/entrada. P4 en B = 34.50+.98×46 = 79.58 s/entrada. Capacidad = piso(25,200 / mayor carga por recurso): Referencia piso(25,200/131.10)=192; A piso(25,200/117.30)=214; B piso(25,200/103.95)=242.

Coste incremental por turno: Referencia 0 €; A = 250/20 = 12.50 €; B = 200/20+90 = 100 €.

## 5. Las tres referencias manuales de la ficha

Entradas requeridas N = techo(demanda buena / Y).

| Prueba | Entradas | N | Capacidad | Buenas a capacidad | Factibilidad |
|---|---|---:|---:|---:|---|
| Referencia, demanda 196 | REF; 420 min; r=.30; Ymin=.98 | 200 | 192 | 188.16 | No |
| Alternativa A, demanda 196 | A; 420 min; r=.30; Ymin=.98 | 200 | 214 | 209.72 | Sí |
| Alternativa B, demanda 220 | B; 420 min; r=.30; Ymin=.98 | 225 | 242 | 237.16 | Sí |

Para 196, la referencia no alcanza N=200; A y B sí. Para 220, N=225: solo B alcanza la capacidad. Coste diario: A 12.50 € y B 100 €. Productividad se define como buenos esperados planificados / horas-persona netas disponibles: A para 196 = 196/(3×7)=9.333 buenos/h-persona; B para 196 =196/28=7.000; B para 220 =220.5/28=7.875. No se calcula productividad de planes no factibles como si hubieran entregado el pedido.

## 6. Muestreo del trabajo

| Estado | Conteo | Proporción |
|---|---:|---:|
| Trabajo de primera pasada | 210 | 70 % |
| Retrabajo | 36 | 12 % |
| Espera | 39 | 13 % |
| Traslado | 15 | 5 % |
| Total | 300 | 100 % |

Para dimensionar una muestra de espera: n=z²p(1−p)/e² = 1.96²×.13×.87/.05² = 173.79; redondeando hacia arriba, **174 observaciones**. Intervalo descriptivo normal aproximado al 95 % para espera observada: .13 ± 1.96√(.13×.87/300) = 9.19 % a 16.81 %. Es una aproximación y no demuestra independencia o representatividad. El retrabajo es actividad observada; no equivale a la tasa de unidades que fallan una prueba.

## 7. Antropometría, ergonomía y límites biomecánicos

Alcances cómodos sintéticos: 32, 37 y 42 cm. Contenedores frecuentes actuales: 28, 35 y 48 cm. 28 cm queda dentro del alcance de los tres perfiles; 35 cm queda fuera para quien tiene 32 cm; 48 cm excede los tres alcances. Propuesta geométrica: llevar los materiales frecuentes a una franja común de hasta 32 cm (referencia 28 cm), manteniendo segregadas entrada, aprobados y descarte. El cambio no se convierte en ahorro de segundos porque no hay piloto cronométrico.

La ficha no proporciona altura de codo/mesa, masa, fuerza, postura, ángulos ni frecuencia de levantamiento; no es posible hacer un cálculo biomecánico cuantitativo. No se infieren percentiles poblacionales desde tres perfiles ni se emiten diagnósticos o certificaciones normativas.

## 8. Sensibilidad, decisión y conciliación pendiente

Con demanda 196 y rendimiento mínimo .98: A es la alternativa obligatoria factible de menor coste (12.50 €/turno). Para demanda 220, B es la única alternativa obligatoria factible (100 €/turno). Al aumentar r a 1 en A, P2 soporta 1.10×131.10 + .98×46 = 189.29 s/entrada y la capacidad baja a 133; el cuello cambia a P2. Con rendimiento mínimo .995, ninguna alternativa obligatoria cumple porque su rendimiento esperado es .98.

El PDF señala que el anexo patrón del docente se libera después del checkpoint. No fue proporcionado con el PDF del estudiante; las cifras anteriores son referencias manuales independientes y deben cotejarse con dicho patrón cuando esté disponible, sin borrar la primera versión.