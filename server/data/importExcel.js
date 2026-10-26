/**
 * Enhanced CSV Import - includes all metrics from CSV
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'Vidhika@123',
    database: process.env.MYSQL_DATABASE || 'ansh'
};

function parseCSV(content) {
    const lines = content.trim().split('\n');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        data.push(row);
    }

    return data;
}

const streamMapping = {
    'engineering': 'technology',
    'medical': 'medical',
    'dental': 'medical',
    'pharmacy': 'medical',
    'commerce': 'commerce',
    'management': 'commerce',
    'arts': 'arts',
    'law': 'arts',
    'design': 'design',
    'architecture': 'design',
    'science': 'science',
    'agriculture': 'science'
};

async function importCSVWithMetrics() {
    let conn;
    try {
        console.log('🚀 Starting enhanced import...\n');

        conn = await mysql.createConnection(dbConfig);
        console.log('✅ Connected\n');

        console.log('🗑️  Clearing old data...');
        await conn.query('DELETE FROM colleges');
        console.log('✅ Cleared\n');

        const dataDir = path.join(__dirname, 'excel');
        const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.csv'));

        console.log(`📁 Found ${files.length} files\n`);

        let total = 0;
        let errors = 0;

        for (const file of files) {
            console.log(`📊 ${file}`);

            try {
                const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
                const data = parseCSV(content);

                const fileName = file.toLowerCase().replace('.csv', '');
                let defaultType = 'technology';
                for (const [key, value] of Object.entries(streamMapping)) {
                    if (fileName.includes(key)) {
                        defaultType = value;
                        break;
                    }
                }

                let inserted = 0;

                for (const row of data) {
                    try {
                        const name = row.Name || row['Institute Name'] || row.University;
                        const state = row.State || '';
                        const city = row.City || row['City Name'] || state;

                        if (!name || !state || name.length < 3) continue;

                        // Extract all metrics
                        const instituteId = row['Institute ID'] || '';
                        const tlr = parseFloat(row.TLR) || null;
                        const rpc = parseFloat(row.RPC) || null;
                        const go = parseFloat(row.GO) || null;
                        const oi = parseFloat(row.OI) || null;
                        const perception = parseFloat(row.Perception) || null;
                        const score = parseFloat(row.Score) || null;
                        const rank = parseInt(row.Rank) || null;

                        await conn.query(
                            `INSERT INTO colleges 
               (name, city, state, type, ownership, institute_id, tlr, rpc, go_score, oi, perception, total_score, rank_position) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                                name.substring(0, 255),
                                city.substring(0, 100),
                                state.substring(0, 100),
                                defaultType,
                                'government',
                                instituteId,
                                tlr,
                                rpc,
                                go,
                                oi,
                                perception,
                                score,
                                rank
                            ]
                        );

                        inserted++;
                    } catch (rowErr) {
                        if (!rowErr.message.includes('Duplicate')) {
                            errors++;
                        }
                    }
                }

                console.log(`   ✅ ${inserted} colleges\n`);
                total += inserted;

            } catch (fileErr) {
                console.error(`   ❌ Error: ${fileErr.message}\n`);
                errors++;
            }
        }

        console.log('='.repeat(50));
        console.log(`✅ DONE: ${total} colleges imported with full metrics`);
        console.log(`❌ Errors: ${errors}`);
        console.log('='.repeat(50));

        const [stats] = await conn.query('SELECT type, COUNT(*) as cnt FROM colleges GROUP BY type');
        console.log('\n📈 By Field:');
        stats.forEach(s => console.log(`   ${s.type}: ${s.cnt}`));

        // Show sample with metrics
        const [sample] = await conn.query('SELECT name, tlr, rpc, total_score, rank_position FROM colleges WHERE total_score IS NOT NULL LIMIT 3');
        console.log('\n📊 Sample with metrics:');
        sample.forEach(c => console.log(`   ${c.name}: Score=${c.total_score}, Rank=${c.rank_position}`));

        await conn.end();

    } catch (err) {
        console.error('\n❌ Fatal:', err.message);
        if (conn) await conn.end();
        process.exit(1);
    }
}

importCSVWithMetrics();
