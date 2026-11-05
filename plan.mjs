import {bundle} from '@remotion/bundler';
import {selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const c = await selectComposition({serveUrl, id: process.env.COMP});
const n = c.durationInFrames;
const k = Math.max(1, Math.min(parseInt(process.env.CHUNKS || '20'), Math.floor(n / 60) || 1));
const step = Math.ceil(n / k); const inc = [];
for (let i = 0; i < k; i++) { const a = i * step, b = Math.min(n - 1, (i + 1) * step - 1); if (a <= b) inc.push({i: String(i).padStart(3, '0'), range: `${a}-${b}`}); }
fs.appendFileSync(process.env.GITHUB_OUTPUT, `frames=${n}\nmatrix=${JSON.stringify({include: inc})}\n`);
console.log(n, inc.length, 'slices');
