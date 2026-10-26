const mysql = require('mysql2/promise');

async function addMetricsColumns() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'ansh',
        database: 'ansh'
    });

    try {
        console.log('🔧 Adding college metrics columns...\n');

        // Add columns one by one
        const columns = [
            { name: 'institute_id', type: 'VARCHAR(50)' },
            { name: 'tlr', type: 'DECIMAL(5,2)' },
            { name: 'rpc', type: 'DECIMAL(5,2)' },
            { name: 'go_score', type: 'DECIMAL(5,2)' },
            { name: 'oi', type: 'DECIMAL(5,2)' },
            { name: 'perception', type: 'DECIMAL(5,2)' },
            { name: 'total_score', type: 'DECIMAL(6,2)' },
            { name: 'rank_position', type: 'INT' }
        ];

        for (const col of columns) {
            try {
                await conn.query(`ALTER TABLE colleges ADD COLUMN ${col.name} ${col.type}`);
                console.log(`   ✅ Added ${col.name}`);
            } catch (err) {
                if (err.message.includes('Duplicate column')) {
                    console.log(`   ⏭️  ${col.name} already exists`);
                } else {
                    console.error(`   ❌ Error adding ${col.name}:`, err.message);
                }
            }
        }

        console.log('\n✅ All columns processed!\n');

        await conn.end();

    } catch (err) {
        console.error('❌ Fatal error:', err.message);
        await conn.end();
        process.exit(1);
    }
}

addMetricsColumns();
