#!/usr/bin/env node
import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';
import { createWorker } from 'tesseract.js';

const pagesDir = path.resolve(process.argv[2] || path.join('public','images','whitepaper90','pages'));
const outTxt = path.resolve(process.argv[3] || 'tmp_whitepaper_ocr.txt');

async function main(){
  const files = (await fs.readdir(pagesDir)).filter(f=>/\.png$/i.test(f)).sort();
  if(files.length === 0){
    console.error('No page images found in', pagesDir);
    process.exit(1);
  }
  const worker = await createWorker('jpn+eng');
  let all = '';
  for(const f of files){
    const full = path.join(pagesDir, f);
    console.log('OCR', f);
    const { data: { text } } = await worker.recognize(full);
    all += (all ? '\n\f\n' : '') + text;
  }
  await worker.terminate();
  await fs.writeFile(outTxt, all, 'utf8');
  console.log('Wrote', outTxt);
}

main().catch((e)=>{ console.error(e); process.exit(1); });

