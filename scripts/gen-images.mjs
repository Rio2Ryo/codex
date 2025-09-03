import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public/images/generated');
await fs.mkdir(outDir, { recursive: true });

const prompts = JSON.parse(await fs.readFile(path.join(root, 'assets/prompts.json'), 'utf8'));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function gen(name, prompt, size = '1536x1024') {
  console.log('Generating', name);
  const img = await client.images.generate({
    model: 'gpt-image-1',
    prompt,
    size,
    quality: 'high'
  });
  const b64 = img.data[0].b64_json;
  const buf = Buffer.from(b64, 'base64');
  const file = path.join(outDir, `${name}.png`);
  await fs.writeFile(file, buf);
  console.log('Saved', file);
}

await gen('hero', prompts.hero, '1536x1024');
await gen('leaf', prompts.leaf, '1024x1024');
await gen('facility', prompts.facility, '1536x1024');
await gen('roadmap', prompts.roadmap, '1536x1024');
await gen('apps', prompts.apps, '1536x1024');
await gen('sustainability', prompts.sustainability, '1536x1024');
await gen('token', prompts.token, '1024x1024');

console.log('Done.');
