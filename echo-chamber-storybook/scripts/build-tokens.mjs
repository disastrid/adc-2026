// Optional: write tokens/*.json out as a plain CSS file (dist/tokens.css),
// for using the same tokens outside Storybook. Storybook itself reads the JSON
// directly, so you never need to run this for the demo.
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { buildCss } from '../src/tokens.js';

const config = JSON.parse(readFileSync('tokens.config.json', 'utf8'));
const files = {};
for (const f of readdirSync('tokens').filter((f) => f.endsWith('.json'))) {
  files[f] = JSON.parse(readFileSync(`tokens/${f}`, 'utf8'));
}
mkdirSync('dist', { recursive: true });
writeFileSync('dist/tokens.css', buildCss(files, config));
console.log(`dist/tokens.css written from ${Object.keys(files).length} file(s)`);
