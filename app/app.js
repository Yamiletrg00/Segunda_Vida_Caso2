'use strict';

const MODEL = Object.freeze({
  version: '1.0.0',
  materialAvailable: 300,
  nominalNetMinutes: 420,
  shiftHorizon: 20,
  firstFailure: 0.10,
  recovery: 0.80,
  automaticTestSeconds: 60,
  supplement: 0.15,
  observations: {
    A: [29,31,30,32,28,30],
    B: [78,82,80,81,79,80],
    C: [118,122,120,124,116,120],
    D: [29,31,30,32,28,30],
    E: [38,42,40,41,39,40]
  },
  ratings: { A: 1.00, B: 1.05, C: 0.95, D: 1.00, E: 1.00 },
  optionBNormalTime: 72,
  alternatives: {
    REF: { name: 'Referencia', short: 'Método actual', workers: 3, investment: 0, recurring: 0 },
    A: { name: 'A · Organizador de limpieza', short: 'B = 72 s normales', workers: 3, investment: 250, recurring: 0 },
    B: { name: 'B · Cuarta persona', short: 'Nueva asignación', workers: 4, investment: 200, recurring: 90 }
  }
});

const $ = id => document.getElementById(id);
const fmt = (n, digits=2) => Number.isFinite(n) ? new Intl.NumberFormat('es-MX',{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(n) : '—';
const money = n => `${fmt(n,2)} €`;
const pct = n => `${fmt(n*100,1)} %`;
const ceilDiv = (a,b) => Math.ceil(a/b - 1e-12);
const floorCap = (seconds, load) => Math.floor(seconds/load + 1e-12);
const mean = values => values.reduce((a,b)=>a+b,0)/values.length;
const standard = (element,normalOverride=null) => (normalOverride ?? mean(MODEL.observations[element])*MODEL.ratings[element])*(1+MODEL.supplement);

const TIMES = Object.freeze({
  A: standard('A'), B: standard('B'), C: standard('C'), D: standard('D'), E: standard('E'),
  B_A: standard('B',MODEL.optionBNormalTime)
});

function validateInputs(input) {
  const errors=[];
  if (!Number.isFinite(input.demand) || !Number.isInteger(input.demand) || input.demand < 0) errors.push('La demanda debe ser un entero no negativo.');
  if (!Number.isFinite(input.minutes) || input.minutes <= 0) errors.push('La ventana neta debe ser mayor que cero minutos.');
  if (!['REF','A','B'].includes(input.focus)) errors.push('Selecciona Referencia, A o B.');
  if (!Number.isFinite(input.routeM) || input.routeM < 0 || input.routeM > 1) errors.push('La proporción de ruta M debe estar entre 0 y 1.');
  if (!Number.isFinite(input.minYield) || input.minYield < 0 || input.minYield > 1) errors.push('El rendimiento mínimo debe estar entre 0 y 1.');
  return errors;
}

function calculateAlternative(key, input) {
  if (!Object.hasOwn(MODEL.alternatives,key)) throw new Error(`Alternativa no reconocida: ${key}`);
  const f=MODEL.firstFailure, rec=MODEL.recovery, r=input.routeM;
  const yieldRate=1-f+f*rec;
  const counts={
    inputs:100, lightRoute:100*(1-r), moduleRoute:100*r,
    initialModuleChanges:100*r, firstTests:100, firstFailures:100*f,
    reworkChanges:100*f, secondTests:100*f, recovered:100*f*rec,
    discarded:100*f*(1-rec), good:100*yieldRate
  };
  const loads={};
  const testLoad=TIMES.D+MODEL.automaticTestSeconds;
  if(key==='REF'){
    loads['Persona 1 · A+B']=TIMES.A+TIMES.B;
    loads['Persona 2 · C+E']=(r+f)*TIMES.C+yieldRate*TIMES.E;
    loads['Persona 3 · Pruebas']=(1+f)*testLoad;
  } else if(key==='A'){
    loads['Persona 1 · A+B']=TIMES.A+TIMES.B_A;
    loads['Persona 2 · C+E']=(r+f)*TIMES.C+yieldRate*TIMES.E;
    loads['Persona 3 · Pruebas']=(1+f)*testLoad;
  } else {
    loads['Persona 1 · B']=TIMES.B;
    loads['Persona 2 · C']=(r+f)*TIMES.C;
    loads['Persona 3 · Pruebas']=(1+f)*testLoad;
    loads['Persona 4 · A+E']=TIMES.A+yieldRate*TIMES.E;
  }
  const entriesPerShift=Object.values(loads);
  const bottleneckLoad=Math.max(...entriesPerShift);
  const bottleneck=Object.keys(loads).find(name=>Math.abs(loads[name]-bottleneckLoad)<1e-9);
  const availableSeconds=input.minutes*60;
  const capacity=floorCap(availableSeconds,bottleneckLoad);
  const requiredEntries=ceilDiv(input.demand,yieldRate);
  const materialOK=requiredEntries<=MODEL.materialAvailable;
  const capacityOK=requiredEntries<=capacity;
  const yieldOK=yieldRate+1e-12>=input.minYield;
  const feasible=capacityOK && materialOK && yieldOK;
  const alt=MODEL.alternatives[key];
  const dailyCost=alt.investment/MODEL.shiftHorizon+alt.recurring;
  const goodAtCapacity=capacity*yieldRate;
  const goodAtPlan=requiredEntries*yieldRate;
  const laborHoursAvailable=alt.workers*input.minutes/60;
  const productivity=feasible && laborHoursAvailable>0 ? goodAtPlan/laborHoursAvailable : null;
  let reason='Cumple capacidad, material y rendimiento mínimo.';
  if(!capacityOK) reason=`Capacidad insuficiente: requiere ${requiredEntries} entradas y permite ${capacity}.`;
  else if(!materialOK) reason=`Material insuficiente: requiere ${requiredEntries} entradas y hay ${MODEL.materialAvailable}.`;
  else if(!yieldOK) reason=`Rendimiento ${pct(yieldRate)} inferior al mínimo ${pct(input.minYield)}.`;
  return {key,name:alt.name,short:alt.short,workers:alt.workers,counts,loads,bottleneck,bottleneckLoad,capacity,capacityGood:goodAtCapacity,
    yieldRate,requiredEntries,goodAtPlan,materialOK,capacityOK,yieldOK,feasible,reason,dailyCost,productivity,laborHoursAvailable};
}

function calculateAll(input) { return ['REF','A','B'].map(k=>calculateAlternative(k,input)); }

function readInputs() {
  const numeric = id => $('' + id).value.trim()==='' ? NaN : Number($('' + id).value);
  return {demand:numeric('demand'),minutes:numeric('minutes'),focus:$('focus').value,routeM:numeric('routeM'),minYield:numeric('minYield')};
}

function render() {
  const input=readInputs(), errors=validateInputs(input);
  $('inputError').textContent=errors.join(' ');
  if(errors.length){
    $('recommended').textContent='Entrada inválida'; $('recommendNote').textContent='Corrige los campos para calcular.';
    ['kpiN','kpiCapacity','kpiStatus'].forEach(id=>$(id).textContent='—');
    $('kpiBottleneck').textContent='Cuello de botella: —'; $('kpiStatusNote').textContent='';
    $('comparisonBody').innerHTML=`<tr><td colspan="8"><span class="tag tag-bad">No calculado</span> ${escapeHtml(errors.join(' '))}</td></tr>`;
    $('loadChart').innerHTML=''; $('flowBreakdown').innerHTML=''; $('focusDetail').innerHTML=''; return;
  }
  const rows=calculateAll(input), focused=rows.find(x=>x.key===input.focus);
  const viable=rows.filter(x=>x.feasible).sort((a,b)=>a.dailyCost-b.dailyCost || a.workers-b.workers);
  const best=viable[0]??null;
  $('recommended').textContent=best?best.name.split(' · ')[0]:'Ninguna';
  $('recommendNote').textContent=best?`${best.name} · ${money(best.dailyCost)} por turno`:'Ninguna alternativa obligatoria satisface todas las restricciones.';
  $('kpiN').textContent=fmt(focused.requiredEntries,0);
  $('kpiCapacity').textContent=fmt(focused.capacity,0);
  $('kpiBottleneck').textContent=`Cuello: ${focused.bottleneck.replace(' · ',' ')}`;
  $('kpiStatus').innerHTML=focused.feasible?'<span class="tag tag-good">VIABLE</span>':'<span class="tag tag-bad">NO VIABLE</span>';
  $('kpiStatusNote').textContent=focused.reason;
  $('comparisonBody').innerHTML=rows.map(row=>`<tr class="${row.key===input.focus?'focus-row':''}">
    <td><span class="alt-name">${escapeHtml(row.name)}</span><span class="alt-sub">${escapeHtml(row.short)}</span></td>
    <td>${escapeHtml(row.bottleneck.replace(' · ',' '))}<span class="alt-sub">${fmt(row.bottleneckLoad)} s/entrada</span></td>
    <td><b>${fmt(row.capacity,0)}</b></td><td>${fmt(row.capacityGood)}</td><td>${fmt(row.requiredEntries,0)}</td>
    <td>${row.feasible?'<span class="tag tag-good">Sí</span>':'<span class="tag tag-bad">No</span>'}<span class="alt-sub">${escapeHtml(row.reason)}</span></td>
    <td><b>${money(row.dailyCost)}</b></td><td>${row.productivity===null?'—':`${fmt(row.productivity,3)}<span class="alt-sub">buenos/h-persona</span>`}</td>
  </tr>`).join('');
  renderLoadChart(rows);
  renderFlow(rows[0].counts,focused);
}

function renderLoadChart(rows){
  const max=Math.max(...rows.flatMap(x=>Object.values(x.loads)))*1.08;
  const resources=[...new Set(rows.flatMap(x=>Object.keys(x.loads)))];
  // Common reference lines; absent work assignments in an option are represented as zero.
  $('loadChart').innerHTML=resources.map((resource,index)=>`<div class="chart-row"><div class="chart-row-label">${escapeHtml(resource.replace('Persona ','P'))}</div><div class="bars">${rows.map(row=>{
    const val=row.loads[resource]??0, cls={REF:'bar-ref',A:'bar-a',B:'bar-b'}[row.key];
    return `<div class="bar-line"><div class="bar-fill ${cls}" style="width:${(val/max*100).toFixed(3)}%"></div></div><span class="bar-value">${row.key}: ${fmt(val)} s</span>`;
  }).join('')}</div></div>`).join('');
}

function renderFlow(counts,focused){
  $('flowBreakdown').innerHTML=[
    ['Ruta ligera L',counts.lightRoute],['Ruta módulo M',counts.moduleRoute],['Cambios iniciales',counts.initialModuleChanges],
    ['Fallos 1.ª prueba',counts.firstFailures],['Cambios retrabajo',counts.reworkChanges],['Buenas esperadas',counts.good],['Descartes',counts.discarded]
  ].map(([label,value])=>`<div class="flow-item"><strong>${fmt(value,1)}</strong><span>${label} / 100 entradas</span></div>`).join('');
  $('focusDetail').innerHTML=`<div class="focus-list">
    <div class="focus-line"><span>Alternativa</span><b>${escapeHtml(focused.name)}</b></div>
    <div class="focus-line"><span>Rendimiento esperado</span><b>${pct(focused.yieldRate)}</b></div>
    <div class="focus-line"><span>Entradas para el pedido</span><b>${fmt(focused.requiredEntries,0)}</b></div>
    <div class="focus-line"><span>Capacidad de entradas</span><b>${fmt(focused.capacity,0)}</b></div>
    <div class="focus-line"><span>Inventario de entrada</span><b>${MODEL.materialAvailable} unidades</b></div>
    <div class="focus-line"><span>Coste incremental / turno</span><b>${money(focused.dailyCost)}</b></div>
    <div class="focus-line"><span>Restricción determinante</span><b>${escapeHtml(focused.reason)}</b></div>
  </div>`;
}

function renderSampling(){
  const rows=[['Trabajo primera pasada',210,'#2aa99a'],['Retrabajo',36,'#d4ad58'],['Espera',39,'#84949b'],['Traslado',15,'#b7c4c1']];
  $('samplingLegend').innerHTML=rows.map(([label,n,color])=>`<span><i style="background:${color}"></i>${label} · ${n}</span>`).join('');
  $('samplingStats').innerHTML=rows.map(([label,n])=>`<div class="sampling-stat"><strong>${fmt(n/3,0)}%</strong><b>${label}</b><small>${n} de 300 instantes</small></div>`).join('');
  const p=.13,z=1.96,e=.05;
  const sample=Math.ceil(z*z*p*(1-p)/(e*e));
  const se=Math.sqrt(p*(1-p)/300),lo=Math.max(0,p-z*se),hi=Math.min(1,p+z*se);
  $('samplingDonut').setAttribute('aria-label',`Muestreo: 70 por ciento trabajo inicial, 12 por ciento retrabajo, 13 por ciento espera, 5 por ciento traslado. Intervalo aproximado de espera ${pct(lo)} a ${pct(hi)}.`);
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function runTests(){
  const specs=[];
  const base={demand:196,minutes:420,focus:'REF',routeM:.30,minYield:.98};
  const ref=calculateAlternative('REF',base), a=calculateAlternative('A',base);
  const b220=calculateAlternative('B',{...base,demand:220,focus:'B'});
  specs.push({id:'M-01',inputs:'Referencia · D=196 · 420 min · r=0.30 · y mín.=0.98',expected:'N=200; capacidad=192; no viable; cuello P1',actual:`N=${ref.requiredEntries}; capacidad=${ref.capacity}; ${ref.feasible?'viable':'no viable'}; cuello ${ref.bottleneck.split(' · ')[0]}`,diff:`Δ cap. ${ref.capacity-192}`,tol:'Capacidad ±0; conteos ±0',pass:ref.requiredEntries===200&&ref.capacity===192&&!ref.feasible&&ref.bottleneck.startsWith('Persona 1'),why:'Referencia manual 1: la carga A+B limita el régimen.'});
  specs.push({id:'M-02',inputs:'A · D=196 · 420 min · r=0.30 · y mín.=0.98',expected:'N=200; capacidad=214; viable; coste=12.50 €',actual:`N=${a.requiredEntries}; capacidad=${a.capacity}; ${a.feasible?'viable':'no viable'}; coste ${money(a.dailyCost)}`,diff:`Δ cap. ${a.capacity-214}`,tol:'Capacidad ±0; coste ±0.01 €',pass:a.requiredEntries===200&&a.capacity===214&&a.feasible&&Math.abs(a.dailyCost-12.5)<1e-9,why:'Referencia manual 2: B baja a 72 s normales; P1 sigue limitando.'});
  specs.push({id:'M-03',inputs:'B · D=220 · 420 min · r=0.30 · y mín.=0.98',expected:'N=225; capacidad=242; viable; coste=100.00 €',actual:`N=${b220.requiredEntries}; capacidad=${b220.capacity}; ${b220.feasible?'viable':'no viable'}; coste ${money(b220.dailyCost)}`,diff:`Δ cap. ${b220.capacity-242}`,tol:'Capacidad ±0; coste ±0.01 €',pass:b220.requiredEntries===225&&b220.capacity===242&&b220.feasible&&Math.abs(b220.dailyCost-100)<1e-9,why:'Referencia manual 3: en B, P3 limita la capacidad.'});
  const edgeOK=calculateAlternative('A',{...base,minutes:391});
  const edgeFail=calculateAlternative('A',{...base,minutes:390});
  specs.push({id:'F-01',inputs:'A · D=196 · r=0.30 · 391 min y luego 390 min',expected:'391 min: capacidad 200 y viable; 390 min: capacidad 199 y no viable',actual:`391: ${edgeOK.capacity} (${edgeOK.feasible?'viable':'no viable'}); 390: ${edgeFail.capacity} (${edgeFail.feasible?'viable':'no viable'})`,diff:`${edgeOK.capacity-200} / ${edgeFail.capacity-199}`,tol:'Capacidad ±0; estado exacto',pass:edgeOK.capacity===200&&edgeOK.feasible&&edgeFail.capacity===199&&!edgeFail.feasible,why:'Frontera inclusiva: N puede ser igual a la capacidad; una unidad menos ya no alcanza.'});
  const invalid={...base,routeM:1.2}; const invalidErrors=validateInputs(invalid);
  specs.push({id:'I-01',inputs:'r=1.20 (fuera del intervalo [0,1])',expected:'Rechazar; no calcular; mostrar error de campo',actual:invalidErrors.length?`Rechazado: ${invalidErrors[0]}`:'Aceptado indebidamente',diff:'No aplica',tol:'Rechazo obligatorio',pass:invalidErrors.length>0,why:'Validación del dominio de la proporción de ruta M.'});
  specs.push({id:'NF-01',inputs:'Referencia · D=196 · 420 min · r=0.30 · y mín.=0.98',expected:'No viable porque N=200 supera capacidad 192',actual:`${ref.feasible?'Viable':'No viable'}: ${ref.reason}`,diff:`Capacidad − N = ${ref.capacity-ref.requiredEntries}`,tol:'Estado exacto',pass:!ref.feasible&&!ref.capacityOK,why:'Escenario no factible; no se recomienda como alternativa válida.'});
  const mixA=calculateAlternative('A',{...base,routeM:1});
  specs.push({id:'C-01',inputs:'A · D=196 · 420 min · r=1.00 · y mín.=0.98',expected:'Capacidad=133; cuello Persona 2 (C+E)',actual:`Capacidad=${mixA.capacity}; cuello ${mixA.bottleneck}`,diff:`Δ cap. ${mixA.capacity-133}`,tol:'Capacidad ±0; recurso exacto',pass:mixA.capacity===133&&mixA.bottleneck.startsWith('Persona 2'),why:'Prueba característica: al aumentar la ruta M crece la carga de cambios de módulo y cambia el cuello.'});
  const highMin=calculateAll({...base,minYield:.995});
  specs.push({id:'S-01',inputs:'Demanda=196 · 420 min · r=0.30 · rendimiento mínimo=0.995',expected:'Ninguna opción obligatoria viable: rendimiento previsto 0.98 < 0.995',actual:`${highMin.filter(x=>x.feasible).length} opciones viables; Y=${pct(highMin[0].yieldRate)}`,diff:'No aplica',tol:'Estado exacto',pass:highMin.every(x=>!x.feasible)&&highMin.every(x=>x.yieldRate===.98),why:'Sensibilidad al contrato de rendimiento. La opción C no se modela porque es extensión voluntaria del caso.'});
  const passes=specs.filter(x=>x.pass).length;
  $('testSummary').innerHTML=`<strong class="test-state ${passes===specs.length?'test-pass':'test-fail'}">${passes}/${specs.length} pruebas correctas</strong><span>Ejecutadas en el navegador · tolerancias declaradas en cada prueba</span>`;
  $('testBody').innerHTML=specs.map(x=>`<tr><td><b>${x.id}</b></td><td>${escapeHtml(x.inputs)}</td><td>${escapeHtml(x.expected)}</td><td>${escapeHtml(x.actual)}</td><td>${escapeHtml(x.diff)}</td><td>${escapeHtml(x.tol)}</td><td>${x.pass?'<span class="tag tag-good">OK</span>':'<span class="tag tag-bad">FALLO</span>'}</td><td>${escapeHtml(x.why)}</td></tr>`).join('');
  return {passes,total:specs.length,specs};
}

function downloadCsv(){
  const input=readInputs(),errors=validateInputs(input); if(errors.length){$('inputError').textContent=errors.join(' ');return;}
  const rows=calculateAll(input);
  const matrix=[['Alternativa','Cuello de botella','Carga máxima s/entrada','Capacidad entradas','Rendimiento esperado','Buenas a capacidad','N requerido','Viable','Motivo','Coste incremental €/turno','Productividad buenos/h-persona'],...rows.map(r=>[r.name,r.bottleneck,r.bottleneckLoad,r.capacity,r.yieldRate,r.capacityGood,r.requiredEntries,r.feasible?'Sí':'No',r.reason,r.dailyCost,r.productivity??''])];
  const csv=matrix.map(row=>row.map(value=>`"${String(value).replace(/"/g,'""')}"`).join(';')).join('\r\n');
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='comparacion-segunda-vida-caso2.csv';a.click();URL.revokeObjectURL(url);
}

function restoreBase(){$('demand').value='196';$('minutes').value='420';$('focus').value='A';$('routeM').value='0.30';$('minYield').value='0.98';render();}
['demand','minutes','focus','routeM','minYield'].forEach(id=>$(id).addEventListener('input',render));
$('resetBtn').addEventListener('click',restoreBase);
$('runTests').addEventListener('click',runTests);
$('downloadCsv').addEventListener('click',downloadCsv);
$('printBtn').addEventListener('click',()=>window.print());
renderSampling();render();