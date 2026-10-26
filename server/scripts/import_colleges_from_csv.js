import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse";
import { ensureDatabase, getPool } from "../db/pool.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalize(str) {
  if (str == null) return null;
  const s = String(str).trim();
  if (!s || s === "....." || s === "NA" || s === "N/A") return null;
  return s;
}

function toLowerOrNull(str) {
  const s = normalize(str);
  return s ? s.toLowerCase() : null;
}

function deduceType(specialized, collegeName = "") {
  const s = (specialized || collegeName || "").toLowerCase();
  if (/(medical|allopathy|physiotherapy|nursing|dental|ayush)/.test(s)) return "medical";
  if (/(engineering|technology|polytechnic|iit|nit|iiit)/.test(s)) return "technology";
  if (/(design)/.test(s)) return "design";
  if (/(commerce|management|mba|bba|economics|account)/.test(s)) return "commerce";
  if (/(arts|humanities|literature|history|music|performing)/.test(s)) return "arts";
  if (/(science|research|zoology|physics|chemistry|biology)/.test(s)) return "science";
  return "science"; // fallback
}

function deduceOwnership(management) {
  const s = (management || "").toLowerCase();
  if (s.includes("private")) return "private";
  if (s.includes("government") || s.includes("govt") || s.includes("state") || s.includes("central")) return "government";
  return "government"; // fallback
}

function buildDescription(row) {
  const parts = [];
  const ct = normalize(row["College Type"]);
  const mgmt = normalize(row["Management"]);
  const year = normalize(row["Year of Establishment"]) || normalize(row["Year of Establishment "]) || normalize(row["Year of Establishment  "]); // tolerate header noise
  const uni = normalize(row["University Name"]);
  const addr = normalize(row["Address"]);
  if (ct) parts.push(ct);
  if (mgmt) parts.push(mgmt);
  if (year) parts.push(`Established ${year}`);
  if (uni) parts.push(`University: ${uni}`);
  if (addr) parts.push(`Address: ${addr}`);
  return parts.join(" | ") || null;
}

function normalizeHeaders(headers) {
  return headers.map((h, i) => {
    let key = String(h ?? "");
    key = key.replace(/\r?\n/g, " ");
    key = key.replace(/\s+/g, " ").trim();
    if (!key) key = `__unused_${i}`;
    return key;
  });
}

async function upsertCollege(pool, row) {
  const name = normalize(row["College Name"]) || normalize(row["College name"]) || normalize(row["college name"]) || normalize(row["College"]);
  const state = toLowerOrNull(row["State"]);
  const city = toLowerOrNull(row["District"]) || toLowerOrNull(row["City"]) || toLowerOrNull(row["Location"]); // fallback
  const website = normalize(row["Website"]) || null;
  const management = normalize(row["Management"]) || null;
  const specialized = normalize(row["Specialised in"]) || null;

  if (!name || !state) return { skipped: true, reason: "missing name/state" };

  const type = deduceType(specialized, name);
  const ownership = deduceOwnership(management);
  const paths = [type];
  const description = buildDescription(row);

  // See if exists (case-insensitive by name, exact for state/city stored in lowercase)
  const [existingRows] = await pool.query(
    "SELECT id FROM colleges WHERE LOWER(name)=LOWER(?) AND state=? AND (city <=> ?)",
    [name, state, city]
  );

  if (existingRows.length) {
    const id = existingRows[0].id;
    await pool.query(
      `UPDATE colleges
       SET type=?, ownership=?, paths=JSON_ARRAY(?), description=?, website=?
       WHERE id=?`,
      [type, ownership, ...paths, description, website, id]
    );
    return { updated: 1 };
  } else {
    await pool.query(
      `INSERT INTO colleges (name, state, city, type, ownership, paths, description, website)
       VALUES (?, ?, ?, ?, ?, JSON_ARRAY(?), ?, ?)`,
      [name, state, city, type, ownership, ...paths, description, website]
    );
    return { inserted: 1 };
  }
}

async function main() {
  const argPath = process.argv[2];
  const defaultPath = path.resolve(__dirname, "..", "..", "College.csv");
  const csvPath = path.resolve(argPath || defaultPath);

  if (!fs.existsSync(csvPath)) {
    console.error("CSV file not found:", csvPath);
    process.exit(1);
  }

  await ensureDatabase();
  const pool = getPool();

  const parser = fs.createReadStream(csvPath).pipe(
    parse({
      columns: false,
      skip_empty_lines: true,
      relax_column_count: true,
      relax_quotes: true,
      bom: true,
      trim: true,
    })
  );

  let headers = null;
  let count = 0;
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for await (const record of parser) {
    if (!headers) {
      headers = normalizeHeaders(record);
      continue;
    }
    // Map row array to object by headers
    const row = {};
    for (let i = 0; i < headers.length; i++) {
      row[headers[i]] = record[i];
    }

    try {
      const res = await upsertCollege(pool, row);
      if (res?.inserted) inserted += res.inserted;
      else if (res?.updated) updated += res.updated;
      else skipped += 1;
    } catch (e) {
      skipped += 1;
      console.warn("[IMPORT WARN] Failed row:", row?.["College Name"], e?.message || e);
    }

    count += 1;
    if (count % 100 === 0) {
      console.log(`[IMPORT] processed ${count} rows... (ins=${inserted}, upd=${updated}, skip=${skipped})`);
    }
  }

  console.log(`[IMPORT DONE] rows=${count}, inserted=${inserted}, updated=${updated}, skipped=${skipped}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[IMPORT ERROR]", err);
  process.exit(1);
});
