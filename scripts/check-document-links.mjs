import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { parse } from 'yaml';

const publicRoot = resolve('public');
const validTypes = new Set(['meeting', 'retrospective', 'progress', 'methodology', 'handbook', 'deliverable']);

let errors = 0;
function checkLocalFile(context, file) {
  const target = resolve(publicRoot, file);
  if (!target.startsWith(`${publicRoot}${sep}`) || !existsSync(target) || !statSync(target).isFile()) {
    console.error(`${context}: missing or invalid file: ${file}`);
    errors++;
  } else if (file.endsWith('.pdf') && readFileSync(target).subarray(0, 5).toString() !== '%PDF-') {
    console.error(`${context}: invalid PDF: ${file}`);
    errors++;
  }
}

for (const name of ['documents', 'reports']) {
  const entries = parse(readFileSync(`src/data/${name}.yaml`, 'utf8'));
  for (const entry of entries) {
    const file = entry.file;
    if (!file || /^https?:\/\//.test(file)) continue;
    checkLocalFile(`${name}/${entry.id}`, file);
  }
}

const index = JSON.parse(readFileSync('public/documents.json', 'utf8'));
if (index.schemaVersion !== 1 || !Array.isArray(index.documents)) {
  throw new Error('Invalid public/documents.json format');
}
const ids = new Set();
for (const entry of index.documents) {
  const context = `documents.json/${entry.id}`;
  if (typeof entry.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id) || ids.has(entry.id)) {
    console.error(`${context}: invalid or duplicate id`);
    errors++;
  }
  ids.add(entry.id);
  if (!validTypes.has(entry.type) ||
      typeof entry.name?.en !== 'string' || !entry.name.en.trim() ||
      typeof entry.name?.sk !== 'string' || !entry.name.sk.trim() ||
      typeof entry.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date) ||
      !Number.isFinite(Date.parse(entry.date)) ||
      new Date(entry.date).toISOString().slice(0, 10) !== entry.date ||
      entry.pdf !== `docs/${entry.id}.pdf`) {
    console.error(`${context}: invalid metadata`);
    errors++;
    continue;
  }
  checkLocalFile(context, entry.pdf);
}

if (errors) process.exit(1);
console.log('All local document links resolve.');
