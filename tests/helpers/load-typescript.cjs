const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const ts = require('typescript');
exports.load = function load(file, mocks = {}, cache = new Map()) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} }; cache.set(file, module);
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const localRequire = createRequire(file);
  new Function('require', 'module', 'exports', js)((name) => {
    if (name in mocks) return mocks[name];
    if (name.startsWith('@/')) {
      const base = path.resolve('src', name.slice(2));
      return load(['.ts', '.tsx', '/index.ts', '/index.tsx'].map(ext => base + ext).find(p => fs.existsSync(p)), mocks, cache);
    }
    return localRequire(name);
  }, module, module.exports);
  return module.exports;
};
