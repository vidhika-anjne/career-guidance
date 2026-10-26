import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeValue(v) {
  if (v === null || v === undefined) return '';
  let s = String(v);
  // Trim and collapse whitespace
  s = s.replace(/[\t\r\n]+/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  // Fix multiple commas inside field content
  s = s.replace(/,{2,}/g, ',');
  // Normalize spaces around commas to ", "
  s = s.replace(/\s*,\s*/g, ', ');
  // Remove leading/trailing commas
  s = s.replace(/^,\s*/g, '').replace(/\s*,$/g, '');
  return s;
}

function toTitleCaseBasic(s) {
  if (!s) return s;
  // Keep common small words lower-case unless first
  const small = new Set(['of','and','in','for','the','a','an','on','at','by','to','from','with']);
  // Split by spaces, preserve punctuation boundaries
  const words = s.toLowerCase().split(/(\s+|-|\/)/g);
  let pos = 0;
  return words
    .map((w) => {
      // Delimiters
      if (/^(\s+|-|\/)$/.test(w)) return w;
      const plain = w.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '');
      const isFirst = pos++ === 0;
      if (!isFirst && small.has(plain)) return w; // keep as lower-case word
      // Capitalize first alphabetic character
      return w.replace(/^[A-Za-z]/, (ch) => ch.toUpperCase());
    })
    .join('')
    .replace(/\s+/g, ' ') // collapse spaces produced by joins
    .trim();
}

function quoteCsv(val) {
  const s = String(val ?? '');
  if (s.includes('"')) {
    // escape quotes
    const esc = s.replace(/"/g, '""');
    return `"${esc}"`;
  }
  if (s.includes(',') || s.includes('\n') || s.includes('\r')) {
    return `"${s}"`;
  }
  return s;
}

async function main() {
  const [inArg, outArg] = process.argv.slice(2);
  const inPath = inArg ? path.resolve(__dirname, '..', inArg) : path.resolve(__dirname, '../../College.csv');
  const outPath = outArg ? path.resolve(__dirname, '..', outArg) : path.resolve(__dirname, '../../College.cleaned.csv');

  const raw = await fs.readFile(inPath, 'utf8');
  // Parse all rows as arrays so we can drop empty header columns safely
  const rows = parse(raw, {
    skip_empty_lines: true,
  });
  if (!rows.length) throw new Error('CSV appears empty');
  const header = rows[0].map((h) => String(h || '').trim());
  // Determine indices of empty headers to drop
  const dropIdx = new Set();
  header.forEach((h, i) => { if (!h) dropIdx.add(i); });
  const columns = header.filter((_, i) => !dropIdx.has(i));

  // Column name helpers
  const idx = Object.fromEntries(columns.map((c, i) => [c, i]));

  const cleanRows = rows.slice(1).map((row) => row.filter((_, i) => !dropIdx.has(i)));

  // Clean per-field and title-case specific columns
  const TITLE_CASE_COLS = ['College Name', 'State', 'District'];
  const WEBSITE_COL = 'Website';

  const processed = cleanRows.map((row) => {
    const newRow = row.map((val) => normalizeValue(val));
    for (const col of TITLE_CASE_COLS) {
      if (idx[col] !== undefined && idx[col] < newRow.length) {
        newRow[idx[col]] = toTitleCaseBasic(newRow[idx[col]]);
      }
    }
    if (idx[WEBSITE_COL] !== undefined && idx[WEBSITE_COL] < newRow.length) {
      newRow[idx[WEBSITE_COL]] = String(newRow[idx[WEBSITE_COL]] || '').toLowerCase();
    }
    return newRow;
  });

  // Sort by State, then District, then College Name
  processed.sort((a, b) => {
    const sa = (idx['State'] !== undefined ? a[idx['State']] : '').localeCompare(idx['State'] !== undefined ? b[idx['State']] : '', undefined, { sensitivity: 'base' });
    if (sa !== 0) return sa;
    const da = (idx['District'] !== undefined ? a[idx['District']] : '').localeCompare(idx['District'] !== undefined ? b[idx['District']] : '', undefined, { sensitivity: 'base' });
    if (da !== 0) return da;
    return (idx['College Name'] !== undefined ? a[idx['College Name']] : '').localeCompare(idx['College Name'] !== undefined ? b[idx['College Name']] : '', undefined, { sensitivity: 'base' });
  });

  // Write CSV
  const outLines = [];
  outLines.push(columns.map(quoteCsv).join(','));
  for (const row of processed) {
    outLines.push(row.map(quoteCsv).join(','));
  }
  await fs.writeFile(outPath, outLines.join('\n'), 'utf8');
  console.log(`Cleaned ${processed.length} rows. Output: ${outPath}`);
}

main().catch((err) => {
  console.error('[CLEAN ERROR]', err?.message || err);
  process.exit(1);
});
