import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';
import { catalogs } from '../src/i18n/translation.js';
const traverse = traverseModule.default;
const found = new Map();
function add(text, file) {
  const key = text.trim().replace(/\s+/g, ' ');
  if (!/[A-Za-z]{3}/.test(key) || catalogs.hi[key]) return;
  if (!found.has(key)) found.set(key, new Set());
  found.get(key).add(file);
}
function visit(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (entry.name !== 'i18n') visit(file); continue; }
    if (!file.endsWith('.jsx') || file.includes('.test.')) continue;
    const ast = parse(fs.readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['jsx'] });
    traverse(ast, {
      JSXText(p) { add(p.node.value, file); },
      JSXAttribute(p) { if (['placeholder', 'title', 'aria-label', 'alt'].includes(p.node.name.name) && p.node.value?.type === 'StringLiteral') add(p.node.value.value, file); },
      StringLiteral(p) {
        if (p.parent.type === 'ObjectProperty' && ['name', 'title', 'desc', 'description', 'label', 'text', 'badge', 'tagline'].includes(p.parent.key.name)) add(p.node.value, file);
      }
    });
  }
}
visit('src');
const result = [...found].map(([text, files]) => ({ text, files: [...files] }));
fs.writeFileSync('src/i18n/missing-translations.json', JSON.stringify(result, null, 2) + '\n');
console.log(`${Object.keys(catalogs.hi).length} translated phrases; ${result.length} additional static phrases need translations.`);
console.log(result.filter(x=>x.files.some(f=>f.includes('HomePage'))).map(x=>x.text).join('\n'));
