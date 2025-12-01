#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';

// Simple AST -> JS value converter for object/array literals
function nodeToValue(node) {
  if (!node) return null;
  switch (node.type) {
    case 'ObjectExpression': {
      const obj = {};
      for (const prop of node.properties) {
        if (prop.type === 'ObjectProperty' || prop.type === 'Property') {
          let key = null;
          if (prop.key.type === 'Identifier') key = prop.key.name;
          else if (prop.key.type === 'StringLiteral') key = prop.key.value;
          else continue;
          obj[key] = nodeToValue(prop.value);
        }
      }
      return obj;
    }
    case 'ArrayExpression':
      return node.elements.map(e => nodeToValue(e));
    case 'StringLiteral':
    case 'NumericLiteral':
    case 'BooleanLiteral':
      return node.value;
    case 'NullLiteral':
      return null;
    case 'TemplateLiteral': {
      // Only handle simple template without expressions
      if (node.expressions.length === 0) return node.quasis.map(q => q.value.cooked).join('');
      return null;
    }
    default:
      return null;
  }
}

function extractFromCode(code) {
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx']
  });

  const results = {};

  for (const node of ast.program.body) {
    // variable declarations
    if (node.type === 'VariableDeclaration') {
      for (const decl of node.declarations) {
        const id = decl.id;
        const init = decl.init;
        if (!id || !init) continue;
        const name = id.type === 'Identifier' ? id.name : null;
        if (!name) continue;
        if (init.type === 'ObjectExpression' || init.type === 'ArrayExpression' || init.type === 'TemplateLiteral') {
          const val = nodeToValue(init);
          if (val !== null) results[name] = val;
        }
      }
    }

    // export default {...}
    if (node.type === 'ExportDefaultDeclaration') {
      const decl = node.declaration;
      if (decl.type === 'ObjectExpression' || decl.type === 'ArrayExpression') {
        const val = nodeToValue(decl);
        if (val !== null) results['default'] = val;
      }
    }

    // export const X = {...}
    if (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'VariableDeclaration') {
      for (const decl of node.declaration.declarations) {
        const id = decl.id;
        const init = decl.init;
        if (!id || !init) continue;
        const name = id.type === 'Identifier' ? id.name : null;
        if (!name) continue;
        if (init.type === 'ObjectExpression' || init.type === 'ArrayExpression') {
          const val = nodeToValue(init);
          if (val !== null) results[name] = val;
        }
      }
    }
  }

  return results;
}

async function scanDir(rootDirs, outFile = 'scripts/frontend-data.json') {
  const found = {};

  for (const root of rootDirs) {
    const absRoot = path.resolve(process.cwd(), root);
    if (!fs.existsSync(absRoot)) continue;
    const files = [];
    (function walk(dir) {
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          walk(full);
        } else if (/\.(js|jsx|ts|tsx)$/.test(name)) {
          files.push(full);
        }
      }
    })(absRoot);

    for (const f of files) {
      try {
        const code = fs.readFileSync(f, 'utf8');
        const results = extractFromCode(code);
        for (const [k, v] of Object.entries(results)) {
          // prefer existing keys only if not present
          if (found[k] === undefined) found[k] = v;
          else {
            // if name already exists and both are arrays, concat
            if (Array.isArray(found[k]) && Array.isArray(v)) {
              found[k] = found[k].concat(v);
            }
          }
        }
      } catch (err) {
        // skip parse errors
        // console.warn('parse error', f, err.message);
      }
    }
  }

  const outPath = path.resolve(process.cwd(), outFile);
  fs.writeFileSync(outPath, JSON.stringify(found, null, 2), 'utf8');
  console.log('Wrote extracted data to', outPath);
}

// default scan Buyer and Seller src folders
const roots = ['../Buyers2/src', '../Sellers2/src'];
scanDir(roots).catch(err => {
  console.error(err);
  process.exit(1);
});
