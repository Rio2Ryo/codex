import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const input = process.argv[2] || 'public/whitepaper.pdf';
const output = process.argv[3] || 'tmp_whitepaper.txt';

try {
  const data = await fs.readFile(path.resolve(input));
  const res = await pdf(data);
  await fs.writeFile(path.resolve(output), res.text, 'utf8');
  console.log(`Extracted to ${output} (${res.numpages} pages)`);
} catch (e) {
  console.error('PDF extract failed:', e.message);
  process.exit(1);
}
