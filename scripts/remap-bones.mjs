import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const dir = resolve('src/bones');

for (const file of readdirSync(dir).filter((f) => f.endsWith('.bones.json'))) {
  const path = join(dir, file);
  const data = JSON.parse(readFileSync(path, 'utf8'));
  if (!data.breakpoints) continue;

  const remapped = {};
  for (const entry of Object.values(data.breakpoints)) {
    const containerWidth = entry.viewportWidth ?? entry.width;
    if (containerWidth == null) continue;
    const key = String(Math.max(1, Math.floor(containerWidth) - 1));
    remapped[key] = entry;
  }
  data.breakpoints = remapped;

  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
  console.log(`remapped ${file}: ${Object.keys(remapped).join(', ')}`);
}
