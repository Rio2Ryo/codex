#!/usr/bin/env node
// Build hierarchical chapters from flat OCR-derived sections
import fs from 'node:fs/promises';
import path from 'node:path';

const inputJson = process.argv[2] || 'src/data/whitepaper.json';
const outputJson = process.argv[3] || 'src/data/whitepaper-structured.json';

const zenkakuSpace = /\u3000/g;
const spacesAll = /[\t \u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000]+/g;

function compactJa(s){
  if(!s) return '';
  return String(s)
    .replace(zenkakuSpace, ' ')
    .replace(/[ 。．]/g, (m)=>({ '。':'。', '．':'.', ' ': ' ' }[m] || m))
    .replace(spacesAll, ' ')
    .trim();
}

function removeInnerSpacesForJa(s){
  // Remove spaces between Japanese letters to fix OCR spacing like "エ グ ゼ ク..."
  return s
    .replace(/([\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}])[ \t]+(?=[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}])/gu, '$1')
    .replace(/([A-Za-z])[ \t]+(?=[A-Za-z])/g, '$1');
}

function normalizeTitle(t){
  const s = removeInnerSpacesForJa(compactJa(t))
    .replace(/[\s]+/g,' ')
    .trim();
  return s;
}

function isTopLevel(title){
  const t = normalizeTitle(title).replace(/\s/g,'');
  return /^\d+[\.．]?/.test(t);
}

function cleanTopTitle(title){
  let t = normalizeTitle(title);
  // Remove trailing page numbers like "... 3"
  t = t.replace(/\s+[0-9０-９]+$/, '');
  // Collapse patterns like "1. タイトル" -> "タイトル"
  t = t.replace(/^\d+[\.．]?\s*/, '');
  return t;
}

function shouldSkipTitle(title){
  const t = normalizeTitle(title);
  if(!t) return true;
  if(/^目次$/.test(t)) return true;
  if(/^\d+$/.test(t)) return true; // stray page number
  if(/^[A-Z]{2,}$/.test(t)) return true; // PROJECT, etc
  if(t.length <= 1) return true;
  return false;
}

async function main(){
  const raw = JSON.parse(await fs.readFile(path.resolve(inputJson), 'utf8'));
  const sections = raw.sections || [];
  const chapters = [];
  let cur = null;
  for(const s of sections){
    const title = s.title || '';
    const content = compactJa(s.content || '');
    if(isTopLevel(title)){
      if(cur) chapters.push(cur);
      const t = cleanTopTitle(title);
      cur = { id: '', title: t, blocks: [] };
    } else {
      if(!cur){
        cur = { id: '', title: '前文', blocks: [] };
      }
      if(!shouldSkipTitle(title)){
        const tNorm = normalizeTitle(title);
        if(tNorm) cur.blocks.push({ type:'subhead', text: tNorm });
      }
      if(content) cur.blocks.push({ type:'p', text: content });
    }
  }
  if(cur) chapters.push(cur);
  // Assign ids
  const used = new Set();
  chapters.forEach((c, i)=>{
    let id = normalizeTitle(c.title).replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g,'').toLowerCase();
    if(!id) id = `chap-${i+1}`;
    let base = id, n=2; while(used.has(id)){ id = `${base}-${n++}`; }
    used.add(id); c.id = id;
  });

  const out = { updatedAt: new Date().toISOString(), chapters };
  await fs.writeFile(path.resolve(outputJson), JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${outputJson} with ${chapters.length} chapters.`);
}

main().catch((e)=>{ console.error(e); process.exit(1); });

