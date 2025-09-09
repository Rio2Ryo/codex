#!/usr/bin/env node
// Convert extracted whitepaper text into structured sections JSON
import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';

const inputTxt = process.argv[2] || 'tmp_whitepaper_mvt.txt';
const outputJson = process.argv[3] || 'src/data/whitepaper.json';

function isHeading(line){
  if(!line) return false;
  const l = line.trim();
  if(!l) return false;
  // Common Japanese heading patterns
  if(/^第[ 　]*[0-9０-９一二三四五六七八九十百千]+章/.test(l)) return true; // 第1章 ...
  if(/^\d+(?:[\.．-]\d+)*[ 　．.]/.test(l)) return true; // 1. / 1.1 / 1-1 など
  if(/^[（(]?[一二三四五六七八九十]+[)）][ 　]/.test(l)) return true; // （一）等
  // Short line w/out period looks like a heading
  if(l.length <= 28 && !/[。．]$/.test(l) && !/[、，]$/.test(l)){
    // avoid bullets
    if(!/^[・・]/.test(l) && !/^[-*•]/.test(l)) return true;
  }
  return false;
}

function normalize(line){
  return line.replace(/\s+/g, ' ').trim();
}

function makeId(idx, title){
  const base = normalize(title).replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g,'').toLowerCase();
  return (base && base.length > 1 ? base : `sec-${String(idx).padStart(3,'0')}`);
}

async function main(){
  let raw = '';
  try{
    raw = await fs.readFile(path.resolve(inputTxt), 'utf8');
  }catch(e){
    console.error(`Input not found: ${inputTxt}. Run PDF extract first.`);
    process.exit(1);
  }
  const lines = raw.split(/\r?\n/).map(l=>l.trim());
  const sections = [];
  let cur = null;
  for(const line of lines){
    if(!line){ continue; }
    if(isHeading(line)){
      if(cur){ sections.push(cur); }
      cur = { title: normalize(line), id: '', content: '' };
    }else{
      if(!cur){ cur = { title: '前文', id: '', content: '' }; }
      cur.content += (cur.content ? '\n' : '') + line;
    }
  }
  if(cur){ sections.push(cur); }
  // assign ids, dedupe
  const used = new Set();
  sections.forEach((s, i)=>{
    let id = makeId(i+1, s.title);
    let base = id; let n = 2;
    while(used.has(id)) { id = `${base}-${n++}`; }
    used.add(id); s.id = id;
  });
  const out = { updatedAt: new Date().toISOString(), source: inputTxt, sections };
  await fs.mkdir(path.dirname(path.resolve(outputJson)), { recursive: true });
  await fs.writeFile(path.resolve(outputJson), JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${outputJson} with ${sections.length} sections.`);
}

main().catch((e)=>{ console.error(e); process.exit(1); });

