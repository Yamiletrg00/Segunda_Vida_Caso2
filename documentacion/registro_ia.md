# Registro breve de uso de IA

Se utilizó ChatGPT (modelo GPT-6 disponible en la sesión) como apoyo para analizar el PDF, proponer la estructura web, elaborar código HTML/CSS/JavaScript, documentar fórmulas y sugerir pruebas. No se integró una API de IA a la aplicación; la app es estática, determinista y no transmite datos.

**Fecha:** 16 de noviembre de 2026.  
**Objetivo:** convertir actividades de computadora de la Parte 2 del Caso 2 en una microherramienta web local.  
**Instrucción resumida:** trabajar solo con la guía y la ficha de Segunda Vida; preservar datos y restricciones; hacer cálculos manuales antes de programar; crear entradas editables, comparador, explicaciones, pruebas y documentación.

**Propuestas aceptadas:** HTML5/CSS3/JavaScript nativo; modelo de medias y cargas por persona; tabla de comparación Referencia/A/B; análisis de muestreo y ergonomía; pruebas deterministas y exportación CSV.

**Revisión crítica:** se mantuvieron separadas la proporción de ruta M (r) y la tasa de fallo (f); el ensayo automático de 60 s no recibe suplemento; no se volvió a descontar comida/pausas; el 12 % de instantes de retrabajo no se convirtió en tasa de fallo de mandos; no se inventaron datos biomecánicos ni ahorros de tiempo al mover contenedores; la opción C quedó fuera porque es opcional.

**Archivos afectados:** README, app/index.html, app/styles.css, app/app.js, datos/datos_caso2.json, memoria de cálculos, recomendación, matriz y runner de pruebas.

**Comprobación:** referencias manuales independientes codificadas como pruebas; 8/8 pruebas ejecutadas aprobaron. El smoke test usa DOM simulado; la verificación visual en dispositivos reales queda pendiente. El patrón reservado del docente no se recibió; debe conciliarse cuando sea liberado.

**Responsabilidad humana:** la IA no observó el puesto ni realizó un piloto. Los datos son sintéticos de la ficha. Cada integrante debe revisar y explicar fórmulas, supuestos, decisión y limitaciones, y una persona distinta del autor del código debe ejecutar la app siguiendo el README.