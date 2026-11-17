// Runner determinista para validar el motor sin dependencias externas.
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const elements = new Map();
function element(id) {
  if (!elements.has(id)) {
    elements.set(id, {
      id,
      value: ({ demand: '196', minutes: '420', focus: 'A', routeM: '0.30', minYield: '0.98' }[id] ?? ''),
      innerHTML: '', textContent: '', listeners: {}, attrs: {},
      addEventListener(type, fn) { this.listeners[type] = fn; },
      setAttribute(key, value) { this.attrs[key] = value; },
      click() {}
    });
  }
  return elements.get(id);
}
const document = { getElementById: element, createElement() { return { click() {}, set href(v) {}, set download(v) {} }; } };
const context = { document, window: { print() {} }, console, Intl, Math, Number, String, Object, Array, Blob: global.Blob, URL: global.URL };
vm.createContext(context);
const source = fs.readFileSync(path.join(__dirname, '../app/app.js'), 'utf8') +
  '\n;globalThis.__result=runTests(); globalThis.__renderState={table:document.getElementById("comparisonBody").innerHTML,focus:document.getElementById("focusDetail").innerHTML};';
vm.runInContext(source, context);
console.log(JSON.stringify(context.__result, null, 2));
console.log('render smoke:', context.__renderState.table.length > 0 && context.__renderState.focus.length > 0 ? 'PASS' : 'FAIL');
if (context.__result.passes !== context.__result.total) process.exitCode = 1;
if (!context.__renderState.table || !context.__renderState.focus) process.exitCode = 1;